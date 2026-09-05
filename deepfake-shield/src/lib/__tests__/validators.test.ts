import {
  isValidMimeType,
  isValidFileSize,
  sanitizeFileName,
  RateLimiter,
  MAX_FILE_SIZE_BYTES,
  VALID_MIME_TYPES,
} from "../validators";

describe("isValidMimeType", () => {
  it("accepts all valid video MIME types", () => {
    expect(isValidMimeType("video/mp4")).toBe(true);
    expect(isValidMimeType("video/webm")).toBe(true);
    expect(isValidMimeType("video/quicktime")).toBe(true);
    expect(isValidMimeType("video/x-msvideo")).toBe(true);
  });

  it("accepts all valid image MIME types", () => {
    expect(isValidMimeType("image/jpeg")).toBe(true);
    expect(isValidMimeType("image/png")).toBe(true);
    expect(isValidMimeType("image/webp")).toBe(true);
    expect(isValidMimeType("image/gif")).toBe(true);
  });

  it("accepts all valid audio MIME types", () => {
    expect(isValidMimeType("audio/mpeg")).toBe(true);
    expect(isValidMimeType("audio/wav")).toBe(true);
    expect(isValidMimeType("audio/ogg")).toBe(true);
    expect(isValidMimeType("audio/webm")).toBe(true);
  });

  it("rejects invalid MIME types", () => {
    expect(isValidMimeType("application/pdf")).toBe(false);
    expect(isValidMimeType("text/html")).toBe(false);
    expect(isValidMimeType("application/exe")).toBe(false);
    expect(isValidMimeType("")).toBe(false);
  });

  it("is case sensitive and rejects uppercased types", () => {
    expect(isValidMimeType("VIDEO/MP4")).toBe(false);
    expect(isValidMimeType("Image/JPEG")).toBe(false);
  });

  it("has the correct number of valid types", () => {
    expect(VALID_MIME_TYPES.length).toBe(12);
  });
});

describe("isValidFileSize", () => {
  it("accepts files within the 500MB limit", () => {
    expect(isValidFileSize(1)).toBe(true);
    expect(isValidFileSize(1024)).toBe(true);
    expect(isValidFileSize(MAX_FILE_SIZE_BYTES)).toBe(true);
    expect(isValidFileSize(MAX_FILE_SIZE_BYTES - 1)).toBe(true);
  });

  it("rejects files exceeding the 500MB limit", () => {
    expect(isValidFileSize(MAX_FILE_SIZE_BYTES + 1)).toBe(false);
    expect(isValidFileSize(MAX_FILE_SIZE_BYTES * 2)).toBe(false);
  });

  it("rejects zero-byte files", () => {
    expect(isValidFileSize(0)).toBe(false);
  });

  it("rejects negative sizes", () => {
    expect(isValidFileSize(-1)).toBe(false);
  });
});

describe("sanitizeFileName", () => {
  it("returns the filename unchanged for safe names", () => {
    expect(sanitizeFileName("video.mp4")).toBe("video.mp4");
    expect(sanitizeFileName("my-file_01.webm")).toBe("my-file_01.webm");
  });

  it("strips path traversal sequences", () => {
    expect(sanitizeFileName("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFileName("..\\windows\\system32\\file.exe")).toBe("file.exe");
  });

  it("removes special characters", () => {
    expect(sanitizeFileName("file name (1).mp4")).toBe("filename1.mp4");
    expect(sanitizeFileName("file@#$%.mp4")).toBe("file.mp4");
  });

  it("falls back to unnamed_file for empty or fully stripped names", () => {
    expect(sanitizeFileName("")).toBe("unnamed_file");
    expect(sanitizeFileName("@#$%^")).toBe("unnamed_file");
  });
});

describe("RateLimiter", () => {
  it("allows requests up to the max limit", () => {
    const limiter = new RateLimiter(3, 60_000);
    expect(limiter.isAllowed("ip-1")).toBe(true); // 1
    expect(limiter.isAllowed("ip-1")).toBe(true); // 2
    expect(limiter.isAllowed("ip-1")).toBe(true); // 3
  });

  it("blocks requests exceeding the limit", () => {
    const limiter = new RateLimiter(2, 60_000);
    limiter.isAllowed("ip-2");
    limiter.isAllowed("ip-2");
    expect(limiter.isAllowed("ip-2")).toBe(false); // 3rd is blocked
  });

  it("tracks different IPs independently", () => {
    const limiter = new RateLimiter(1, 60_000);
    expect(limiter.isAllowed("ip-3")).toBe(true);
    expect(limiter.isAllowed("ip-4")).toBe(true); // different key
    expect(limiter.isAllowed("ip-3")).toBe(false); // ip-3 is now blocked
  });

  it("resets after the window expires", () => {
    jest.useFakeTimers();
    const limiter = new RateLimiter(1, 1000); // 1 second window
    limiter.isAllowed("ip-5");
    expect(limiter.isAllowed("ip-5")).toBe(false);

    // Advance past the window
    jest.advanceTimersByTime(1001);
    expect(limiter.isAllowed("ip-5")).toBe(true); // reset
    jest.useRealTimers();
  });
});
