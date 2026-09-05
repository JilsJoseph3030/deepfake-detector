import { NextResponse } from "next/server";
import {
  isValidMimeType,
  isValidFileSize,
  sanitizeFileName,
  analyzeRateLimiter,
} from "@/lib/validators";

export async function POST(request: Request) {
  // --- Rate Limiting ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!analyzeRateLimiter.isAllowed(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // --- Presence Check ---
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // --- MIME Type Validation ---
    if (!isValidMimeType(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Supported formats: MP4, WEBM, MOV, AVI, JPG, PNG, WEBP, GIF, MP3, WAV, OGG.",
        },
        { status: 422 }
      );
    }

    // --- File Size Validation ---
    if (!isValidFileSize(file.size)) {
      return NextResponse.json(
        { error: "File size must be between 1 byte and 500 MB." },
        { status: 413 }
      );
    }

    // --- Filename Sanitization ---
    const sanitizedFileName = sanitizeFileName(file.name);

    // --- Forward to Python ML Engine ---
    const pythonFormData = new FormData();
    pythonFormData.append("file", file);

    try {
      const backendBaseUrl =
        process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8000";

      const pythonResponse = await fetch(
        `${backendBaseUrl.replace(/\/$/, "")}/analyze`,
        {
          method: "POST",
          body: pythonFormData,
          signal: AbortSignal.timeout(60_000), // 60s timeout
        }
      );

      if (!pythonResponse.ok) {
        throw new Error(`Python Engine Error: ${pythonResponse.status}`);
      }

      const mlPayload = await pythonResponse.json();
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
      { error: "Failed to process media. Please try again." },
      { status: 500 }
    );
  }
}
