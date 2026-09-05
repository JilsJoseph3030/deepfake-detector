import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. File Type Sanitization
    const validMimeTypes = [
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm',
    ];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Supported: MP4, WEBM, MOV, JPG, PNG, MP3, WAV." }, { status: 422 });
    }

    // 2. File Size Sanitization (500MB cap = 500 * 1024 * 1024 bytes)
    const MAX_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds the 500MB limit." }, { status: 413 });
    }

    // 3. Input Sanitization (Filename)
    // Strip path traversals and special characters
    let sanitizedFileName = file.name.replace(/^.*[\\\/]/, '');
    sanitizedFileName = sanitizedFileName.replace(/[^a-zA-Z0-9.\-_]/g, '');
    if (!sanitizedFileName) {
      sanitizedFileName = "unnamed_video.mp4";
    }

    // Prepare FormData to send to the Python microservice
    const pythonFormData = new FormData();
    pythonFormData.append("file", file);

    try {
      const backendBaseUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8000";
      // Forward the request to the Python ML Engine
      const pythonResponse = await fetch(`${backendBaseUrl.replace(/\/$/, '')}/analyze`, {
        method: "POST",
        body: pythonFormData,
      });

      if (!pythonResponse.ok) {
         throw new Error(`Python Engine Error: ${pythonResponse.status}`);
      }

      const mlPayload = await pythonResponse.json();
      
      // Override the filename in the payload to ensure sanitized naming is respected
      mlPayload.fileName = sanitizedFileName;

      return NextResponse.json(mlPayload, { status: 200 });

    } catch (mlError) {
      console.error("ML Engine Connection Failed:", mlError);
      return NextResponse.json(
        { error: "ML Engine is currently unavailable. Please try again later." },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to process media" },
      { status: 500 }
    );
  }
}
