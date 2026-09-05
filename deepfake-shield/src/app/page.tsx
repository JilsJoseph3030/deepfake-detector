"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight, PlayCircle, Fingerprint, Activity, Server, UploadCloud } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">VERITY</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/verify" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">Verify</Link>
            </nav>
            <div>
              <Link href="/verify" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm shadow-blue-200">
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Deepfake Shield Engine v2.0
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Verify what you see <br/>
            <span className="text-blue-600">before you trust it.</span>
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed">
            We don't just tell you whether media looks suspicious. We show the evidence, explain why, and help trace where it came from using advanced spatial forensics and C2PA metadata.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 group">
              Verify Media Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Visual Diagram Section */}
        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl shadow-gray-200/40 border border-gray-100 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800">The Verification Pipeline</h2>
            <p className="text-slate-500 mt-2">How we deconstruct and analyze media in real-time.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gray-100 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 border-4 border-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                <UploadCloud size={32} />
              </div>
              <h3 className="font-semibold text-slate-800">1. Ingestion</h3>
              <p className="text-xs text-slate-500 mt-2">Upload or paste URL.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 border-4 border-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                <Fingerprint size={32} />
              </div>
              <h3 className="font-semibold text-slate-800">2. Provenance</h3>
              <p className="text-xs text-slate-500 mt-2">C2PA & Hash checks.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 border-4 border-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                <Activity size={32} />
              </div>
              <h3 className="font-semibold text-slate-800">3. Forensics</h3>
              <p className="text-xs text-slate-500 mt-2">Spatial/Audio models.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 border-4 border-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                <Server size={32} />
              </div>
              <h3 className="font-semibold text-slate-800">4. Verdict</h3>
              <p className="text-xs text-slate-500 mt-2">Explainable output.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
