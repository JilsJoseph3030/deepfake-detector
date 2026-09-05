"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function VerifyWorkspace() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [urlInput, setUrlInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = [
    "Extracting C2PA Metadata...",
    "Computing Perceptual Hashes...",
    "Running Spatial & Audio Forensics...",
    "Synthesizing Evidence & Verdict...",
  ];

  const handleProcess = useCallback(
    async (file?: File) => {
      setIsProcessing(true);
      setCurrentStep(0);
      setStatusMessage("Starting analysis...");

      try {
        const formData = new FormData();
        if (file) {
          formData.append("file", file);
        } else if (urlInput) {
          formData.append(
            "file",
            new Blob([urlInput], { type: "text/plain" }),
            "url_input.txt"
          );
        }

        // Stepper animation
        intervalRef.current = setInterval(() => {
          setCurrentStep((prev) => {
            const next = prev < steps.length - 1 ? prev + 1 : prev;
            setStatusMessage(steps[next] ?? steps[steps.length - 1]);
            return next;
          });
        }, 800);

        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (intervalRef.current) clearInterval(intervalRef.current);
        setCurrentStep(steps.length);
        setStatusMessage("Analysis complete.");

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData?.error || `Analysis failed (${response.status})`
          );
        }

        const result = await response.json();
        sessionStorage.setItem("verity_result", JSON.stringify(result));

        setTimeout(() => {
          router.push(`/results/${result.id}`);
        }, 500);
      } catch (error) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        console.error(error);
        setIsProcessing(false);
        setStatusMessage("");
        alert(
          error instanceof Error
            ? error.message
            : "Failed to process media. Please try again."
        );
      }
    },
    [urlInput, router, steps]
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcess(e.target.files[0]);
    }
  };

  const handleDropzoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white border-b border-gray-200" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="VERITY home"
            >
              <div
                className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"
                aria-hidden="true"
              >
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">
                VERITY
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Ingestion Workspace
          </h1>
          <p className="text-slate-500 mt-2">
            Upload media or paste a URL to begin forensic analysis.
          </p>
        </div>

        {/* Aria-live region for async status updates */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {statusMessage}
        </div>

        {isProcessing ? (
          <div
            className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center text-center"
            role="region"
            aria-label="Analysis in progress"
          >
            <div className="relative w-24 h-24 mb-8" aria-hidden="true">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-2 bg-blue-50 border-4 border-blue-600 rounded-full flex items-center justify-center text-blue-600">
                <Loader2 size={32} className="animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Analyzing Media
            </h2>

            {/* Progress indicator */}
            <div
              className="w-full max-w-md mb-6"
              role="progressbar"
              aria-valuenow={Math.round((currentStep / steps.length) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Analysis progress"
            >
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((currentStep / steps.length) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="w-full max-w-md space-y-4" aria-label="Analysis steps">
              {steps.map((step, idx) => {
                const isCompleted = currentStep > idx;
                const isActive = currentStep === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${
                      isActive
                        ? "bg-blue-50 border-blue-200"
                        : isCompleted
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-gray-50 border-gray-100"
                    }`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isActive
                          ? "bg-blue-600 text-white animate-pulse"
                          : "bg-gray-300 text-gray-500"
                      }`}
                      aria-hidden="true"
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-blue-800"
                          : isCompleted
                          ? "text-emerald-700"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                    <span className="sr-only">
                      {isCompleted
                        ? "Complete"
                        : isActive
                        ? "In progress"
                        : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Upload Dropzone */}
            <section
              className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100"
              aria-labelledby="upload-heading"
            >
              <h2 id="upload-heading" className="sr-only">
                Upload Media File
              </h2>
              <label htmlFor="file-upload" className="sr-only">
                Select a media file for analysis
              </label>
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="video/*,image/*,audio/*"
                aria-describedby="file-upload-hint"
              />
              <div
                role="button"
                tabIndex={0}
                aria-label="Click or press Enter to upload a media file for analysis"
                aria-describedby="file-upload-hint"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={handleDropzoneKeyDown}
                className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl p-12 text-center transition-colors cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div
                  className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                >
                  <UploadCloud size={32} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Click to Upload or Drag &amp; Drop
                </h3>
                <p
                  id="file-upload-hint"
                  className="text-sm text-slate-500 mb-6"
                >
                  Supports MP4, MOV, WEBM, JPG, PNG (Max 500MB)
                </p>
                <span
                  className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 group-hover:border-blue-300 group-hover:text-blue-700 shadow-sm"
                  aria-hidden="true"
                >
                  Select File
                </span>
              </div>
            </section>

            {/* URL Analysis */}
            <section
              className="grid grid-cols-1 gap-6"
              aria-labelledby="url-heading"
            >
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center max-w-2xl mx-auto w-full">
                <h2
                  id="url-heading"
                  className="font-semibold text-slate-800 mb-4 flex items-center gap-2"
                >
                  <LinkIcon
                    size={18}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                  Analyze via URL
                </h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="url-input" className="sr-only">
                    Enter media URL
                  </label>
                  <input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-describedby="url-hint"
                  />
                  <button
                    onClick={() => handleProcess()}
                    disabled={!urlInput}
                    aria-disabled={!urlInput}
                    className="px-6 py-2 bg-blue-600 disabled:bg-blue-300 text-white font-medium text-sm rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Analyze
                  </button>
                </div>
                <p id="url-hint" className="text-xs text-slate-400 mt-2">
                  Enter a direct link to a video, image, or audio file.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
