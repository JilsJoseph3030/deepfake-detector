const fs = require('fs');

async function runTests() {
  const url = 'http://localhost:3000/api/analyze';

  console.log("--- Starting API Security & Logic Tests ---\n");

  // Test 1: Valid Video Upload
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['test content'], { type: 'video/mp4' }), 'valid_video.mp4');
    const res = await fetch(url, { method: 'POST', body: formData });
    console.log('Test 1 (Valid Video): Status', res.status);
    const json = await res.json();
    console.log('-> Success, Returned Payload ID:', json.id);
  } catch (e) { console.error('Test 1 failed', e); }
  
  console.log("\n");

  // Test 2: Invalid MIME Type Upload (Image)
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['test content'], { type: 'image/png' }), 'image.png');
    const res = await fetch(url, { method: 'POST', body: formData });
    console.log('Test 2 (Invalid MIME Type): Status', res.status);
    console.log('-> Response:', await res.json());
  } catch (e) { console.error('Test 2 failed', e); }

  console.log("\n");

  // Test 3: Filename Sanitization (Path Traversal Attempt)
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['test content'], { type: 'video/webm' }), '../../etc/passwd_video.webm');
    const res = await fetch(url, { method: 'POST', body: formData });
    console.log('Test 3 (Path Traversal Upload): Status', res.status);
    const json = await res.json();
    console.log('-> Sanitized Filename returned by server:', json.fileName);
  } catch (e) { console.error('Test 3 failed', e); }

  console.log("\n--- Tests Complete ---");
}

runTests();
