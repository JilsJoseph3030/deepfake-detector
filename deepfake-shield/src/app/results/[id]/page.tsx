"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Info,
  UploadCloud,
  CheckCircle,
  Loader2,
  AlertTriangle,
  ChevronRight,
  Maximize2,
  Download,
  SkipBack,
  Play,
  SkipForward,
  Share2,
  FileText,
  LayoutGrid,
  Upload,
  FileBarChart,
  Settings,
  MoveHorizontal,
} from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

export default function VerityDashboard() {
  const params = useParams();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("verity_result");
    if (storedData) {
      try {
        setData(JSON.parse(storedData) as AnalysisResult);
      } catch (e) {
        console.error("Failed to parse stored result", e);
      }
    }
    // Cleanup any lingering interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [params.id]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setLoading(true);
      setUploadProgress(10);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        intervalRef.current = setInterval(() => {
          setUploadProgress((p) => (p < 90 ? p + 10 : 90));
        }, 200);

        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (intervalRef.current) clearInterval(intervalRef.current);
        setUploadProgress(100);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData?.error || `Analysis failed (${response.status})`
          );
        }

        const result = await response.json() as AnalysisResult;
        setData(result);
        sessionStorage.setItem("verity_result", JSON.stringify(result));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Analysis failed. Please try again.";
        setError(message);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setUploadProgress(0);
        }, 500);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2" aria-label="VERITY home">
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
              <nav aria-label="Main navigation">
                <ul className="hidden md:flex items-center space-x-6 list-none">
                  <li>
                    <Link
                      href="/results/current"
                      aria-current="page"
                      className="text-blue-600 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/verify"
                      className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded"
                    >
                      Upload
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100"
                aria-label="Real-time protection is active"
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Real-time Protection Active
              </div>
              <button
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="User account settings"
              >
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt=""
                  role="presentation"
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-3"
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Upload & Batch */}
          <div className="lg:col-span-4 space-y-8">
            <section
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              aria-labelledby="media-analysis-heading"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="media-analysis-heading" className="font-semibold text-lg">
                  Media Analysis
                </h2>
                <Info
                  size={18}
                  className="text-gray-400"
                  aria-label="Upload a media file to run forensic analysis"
                />
              </div>

              <label htmlFor="dashboard-file-upload" className="sr-only">
                Select a media file for analysis
              </label>
              <input
                id="dashboard-file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="video/*,image/*,audio/*"
                aria-describedby="upload-format-hint"
              />
              <div
                role="button"
                tabIndex={0}
                aria-label="Click or press Enter to upload a media file"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <UploadCloud
                  size={40}
                  className="text-blue-500 mb-3 mx-auto"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-slate-800">
                  Drop videos here to scan
                </p>
                <p id="upload-format-hint" className="text-xs text-slate-500 mt-1">
                  MP4, MOV, WEBM, JPG, PNG (Max 500MB)
                </p>
                <span
                  className="mt-4 inline-block px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 shadow-sm"
                  aria-hidden="true"
                >
                  Browse Files
                </span>
              </div>

              {loading && (
                <div className="mt-6" aria-label="Upload analysis progress">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600">
                      Analyzing media...
                    </span>
                    <span
                      className="text-xs text-blue-600 font-semibold"
                      aria-live="polite"
                    >
                      {uploadProgress}%
                    </span>
                  </div>
                  <div
                    className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="File analysis progress"
                  >
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-200 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </section>

            <section
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              aria-labelledby="batch-queue-heading"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="batch-queue-heading" className="font-semibold text-lg">
                  Batch Queue
                </h2>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  3 files recent
                </span>
              </div>
              <ul
                className="space-y-4 max-h-[320px] overflow-y-auto pr-2"
                aria-label="Recently analyzed files"
              >
                <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div
                    className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"
                    aria-hidden="true"
                  >
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-slate-800">
                      news_anchor_clip.mp4
                    </p>
                    <p className="text-[10px] text-emerald-600">
                      Verified Authentic
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                </li>

                {loading && (
                  <li
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100"
                    aria-live="polite"
                  >
                    <div
                      className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 animate-pulse"
                      aria-hidden="true"
                    >
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate text-blue-800">
                        Current Upload
                      </p>
                      <p className="text-[10px] text-blue-600">
                        Analyzing facial artifacts...
                      </p>
                    </div>
                  </li>
                )}

                <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div
                    className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600"
                    aria-hidden="true"
                  >
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-slate-800">
                      ceo_statement_leaked.mov
                    </p>
                    <p className="text-[10px] text-red-600">
                      Deepfake Detected (92%)
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column: Analysis & Comparison */}
          <div className="lg:col-span-8 space-y-8">
            {data ? (
              <>
                {/* Stats */}
                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  role="region"
                  aria-label="Analysis statistics"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <span className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                      Authenticity Score
                    </span>
                    <span
                      className="text-3xl font-bold text-red-600"
                      aria-label={`Authenticity score: ${100 - data.confidence} percent`}
                    >
                      {100 - data.confidence}%
                    </span>
                    <span className="text-xs text-red-500 font-medium mt-1">
                      Highly Suspicious
                    </span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <span className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                      Deepfake Likelihood
                    </span>
                    <span
                      className="text-3xl font-bold text-slate-800"
                      aria-label={`Deepfake likelihood: ${data.confidence} percent`}
                    >
                      {data.confidence}%
                    </span>
                    <div
                      className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden"
                      role="progressbar"
                      aria-valuenow={data.confidence}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Deepfake likelihood bar: ${data.confidence}%`}
                    >
                      <div
                        className="bg-red-500 h-full"
                        style={{ width: `${data.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <span className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                      Detection Nodes
                    </span>
                    <span
                      className="text-3xl font-bold text-slate-800"
                      aria-label="2 out of 3 detection models flagged anomalies"
                    >
                      2/3
                    </span>
                    <span className="text-xs text-slate-500 font-medium mt-1">
                      Models Flagged Anomalies
                    </span>
                  </div>
                </div>

                {/* Frame Comparison */}
                <section
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                  aria-labelledby="comparison-heading"
                >
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h2
                        id="comparison-heading"
                        className="font-semibold text-lg"
                      >
                        Frame-by-Frame Comparison
                      </h2>
                      <p className="text-xs text-slate-500">
                        Comparing original reference vs detected anomalies
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Expand comparison view to fullscreen"
                      >
                        <Maximize2 size={18} aria-hidden="true" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Download comparison frame"
                      >
                        <Download size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div
                    className="relative bg-slate-900 aspect-video group"
                    role="img"
                    aria-label="Side-by-side comparison of original media and deepfake heatmap"
                  >
                    <div className="absolute inset-0 flex">
                      <div className="relative flex-1 overflow-hidden border-r-2 border-blue-600/50 bg-slate-800 flex items-center justify-center">
                        <span className="text-slate-500 font-medium text-sm">
                          Media Source
                        </span>
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 text-white text-[10px] font-bold rounded uppercase tracking-widest backdrop-blur-md">
                          Reference
                        </div>
                      </div>
                      <div className="relative flex-1 overflow-hidden bg-slate-800 flex items-center justify-center">
                        <span className="text-slate-500 font-medium text-sm">
                          Heatmap View
                        </span>
                        <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-red-500/50 via-yellow-500/20 to-transparent pointer-events-none"></div>
                        {data.visualForensics.findings[0]?.nodes?.map(
                          (node, idx) => (
                            <div
                              key={idx}
                              className={`absolute border-2 rounded-lg animate-pulse ${
                                idx === 0
                                  ? "top-1/3 left-1/4 w-32 h-32 border-red-500"
                                  : "top-1/4 right-1/4 w-24 h-24 border-yellow-500"
                              }`}
                              aria-label={`${node.type} detected at ${node.location} with ${node.confidence}% confidence`}
                            >
                              <span
                                className={`absolute -top-6 left-0 text-white text-[8px] px-1 rounded ${
                                  idx === 0 ? "bg-red-500" : "bg-yellow-500"
                                }`}
                                aria-hidden="true"
                              >
                                {node.type}: {node.location} {node.confidence}%
                              </span>
                            </div>
                          )
                        )}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-red-600/80 text-white text-[10px] font-bold rounded uppercase tracking-widest backdrop-blur-md">
                          Suspected Mask
                        </div>
                      </div>
                    </div>
                    <div
                      className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-blue-600 z-10 pointer-events-none shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                      aria-hidden="true"
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white">
                        <MoveHorizontal size={20} />
                      </div>
                    </div>
                  </div>
                  <div
                    className="p-6 flex items-center justify-center gap-8"
                    role="group"
                    aria-label="Media playback controls"
                  >
                    <button
                      className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded"
                      aria-label="Skip to previous frame"
                    >
                      <SkipBack size={20} aria-hidden="true" />
                    </button>
                    <button
                      className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Play media"
                    >
                      <Play size={20} className="translate-x-0.5" aria-hidden="true" />
                    </button>
                    <button
                      className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded"
                      aria-label="Skip to next frame"
                    >
                      <SkipForward size={20} aria-hidden="true" />
                    </button>
                  </div>
                </section>

                {/* Analysis Reports */}
                <section
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  aria-labelledby="reports-heading"
                >
                  <h2 id="reports-heading" className="font-semibold text-lg mb-6">
                    Analysis Insight Reports
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4" aria-label="Visual forensics findings">
                      {data.visualForensics.findings.map((finding, idx) => (
                        <div
                          key={`visual-${idx}`}
                          className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                        >
                          <div
                            className={`mt-1 w-2 h-2 rounded-full ${
                              finding.severity === "high"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                            aria-label={`Severity: ${finding.severity}`}
                          ></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {finding.title}
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">
                              {finding.technical}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4" aria-label="Audio forensics findings">
                      {data.audioForensics.findings.map((finding, idx) => (
                        <div
                          key={`audio-${idx}`}
                          className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                        >
                          <div
                            className={`mt-1 w-2 h-2 rounded-full ${
                              finding.severity === "high"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                            aria-label={`Severity: ${finding.severity}`}
                          ></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {finding.title}
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">
                              {finding.technical}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div
                          className={`mt-1 w-2 h-2 rounded-full ${
                            data.provenance.c2pa
                              ? "bg-emerald-500"
                              : "bg-yellow-500"
                          }`}
                          aria-label={`C2PA status: ${data.provenance.c2pa ? "verified" : "unverified"}`}
                        ></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Metadata Integrity
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">
                            {data.provenance.c2pa
                              ? "C2PA signature verified."
                              : "Original capture metadata present, but file shows evidence of re-encoding or missing C2PA."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Share analysis report"
                    >
                      <Share2 size={16} aria-hidden="true" />
                      Share Report
                    </button>
                    <button
                      className="px-6 py-2 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Export detailed PDF report"
                    >
                      <FileText size={16} aria-hidden="true" />
                      Export Detailed PDF
                    </button>
                  </div>
                </section>
              </>
            ) : (
              <div
                className="h-full flex items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100"
                role="region"
                aria-label="Awaiting media upload"
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    aria-hidden="true"
                  >
                    <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-lg font-medium text-slate-800 mb-2">
                    Awaiting Media
                  </h2>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Upload a video file on the left to generate the spatial
                    analysis report and authenticity breakdown.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50"
        aria-label="Mobile navigation"
      >
        <ul className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 flex items-center justify-around list-none">
          <li>
            <Link
              href="/results/current"
              aria-label="Dashboard"
              aria-current="page"
              className="p-3 text-blue-600 bg-blue-50 rounded-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <LayoutGrid size={24} aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link
              href="/verify"
              aria-label="Upload media"
              className="p-3 text-slate-400 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Upload size={24} aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link
              href="/verify"
              aria-label="Reports"
              className="p-3 text-slate-400 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FileBarChart size={24} aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link
              href="/verify"
              aria-label="Settings"
              className="p-3 text-slate-400 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Settings size={24} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
