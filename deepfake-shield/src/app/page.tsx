"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  UploadCloud,
  Fingerprint,
  Activity,
  Server,
} from "lucide-react";

const pipelineSteps = [
  {
    icon: UploadCloud,
    label: "1. Ingestion",
    description: "Upload or paste URL.",
  },
  {
    icon: Fingerprint,
    label: "2. Provenance",
    description: "C2PA & Hash checks.",
  },
  {
    icon: Activity,
    label: "3. Forensics",
    description: "Spatial/Audio models.",
  },
  {
    icon: Server,
    label: "4. Verdict",
    description: "Explainable output.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                    href="/verify"
                    className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded"
                  >
                    Verify
                  </Link>
                </li>
              </ul>
            </nav>
            <div>
              <Link
                href="/verify"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="text-center max-w-3xl mx-auto mb-20">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100 mb-6"
            aria-label="Deepfake Shield Engine version 2.0 — Active"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Deepfake Shield Engine v2.0
          </div>
          <h1
            id="hero-heading"
            className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Verify what you see <br />
            <span className="text-blue-600">before you trust it.</span>
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed">
            We don't just tell you whether media looks suspicious. We show the
            evidence, explain why, and help trace where it came from using
            advanced spatial forensics and C2PA metadata.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/verify"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Verify Media Now
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>

        {/* Pipeline Section */}
        <section
          className="bg-white rounded-3xl p-10 md:p-16 shadow-xl shadow-gray-200/40 border border-gray-100 mb-20"
          aria-labelledby="pipeline-heading"
        >
          <div className="text-center mb-12">
            <h2
              id="pipeline-heading"
              className="text-2xl font-bold text-slate-800"
            >
              The Verification Pipeline
            </h2>
            <p className="text-slate-500 mt-2">
              How we deconstruct and analyze media in real-time.
            </p>
          </div>

          <ol
            className="grid grid-cols-1 md:grid-cols-4 gap-8 relative list-none"
            aria-label="Verification pipeline steps"
          >
            {/* Connecting line (desktop) */}
            <div
              className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gray-100 z-0"
              aria-hidden="true"
            ></div>

            {pipelineSteps.map(({ icon: Icon, label, description }) => (
              <li
                key={label}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div
                  className="w-20 h-20 bg-blue-50 border-4 border-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4"
                  aria-hidden="true"
                >
                  <Icon size={32} />
                </div>
                <h3 className="font-semibold text-slate-800">{label}</h3>
                <p className="text-xs text-slate-500 mt-2">{description}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
