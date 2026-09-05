"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UploadCloud, Link as LinkIcon, FileVideo, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";

export default function VerifyWorkspace() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [urlInput, setUrlInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Extracting C2PA Metadata...",
    "Computing Perceptual Hashes...",
    "Running Spatial & Audio Forensics...",
    "Synthesizing Evidence & Verdict..."
  ];

  const handleProcess = async (file?: File) => {
    setIsProcessing(true);
    setCurrentStep(0);
    
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else if (urlInput) {
        // If it's a URL, backend might need different handling, but for now we'll mock a blob or just fail gracefully if API expects file
        formData.append("file", new Blob([urlInput], { type: "text/plain" }), "url_input.txt");
      }

      // Start a visual stepper while fetching
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 800);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setCurrentStep(steps.length); // complete

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error || `Analysis failed (${response.status})`);
      }

      const result = await response.json();
      
      // Save result to session storage
      sessionStorage.setItem('verity_result', JSON.stringify(result));

      setTimeout(() => {
        router.push(`/results/${result.id}`);
      }, 500);

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert(error instanceof Error ? error.message : "Failed to process media. Please try again.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcess(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">VERITY</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Ingestion Workspace</h1>
          <p className="text-slate-500 mt-2">Upload media or paste a URL to begin forensic analysis.</p>
        </div>

        {isProcessing ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-2 bg-blue-50 border-4 border-blue-600 rounded-full flex items-center justify-center text-blue-600">
                <Loader2 size={32} className="animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Analyzing Media</h2>
            
            <div className="w-full max-w-md space-y-4">
              {steps.map((step, idx) => {
                const isCompleted = currentStep > idx;
                const isActive = currentStep === idx;
                const isPending = currentStep < idx;
                
                return (
                  <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl border ${isActive ? 'bg-blue-50 border-blue-200' : isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-300 text-gray-500'}`}>
                      {isCompleted ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-blue-800' : isCompleted ? 'text-emerald-700' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Dropzone */}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                className="hidden" 
                accept="video/*,image/*,audio/*"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl p-12 text-center transition-colors cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 group"
              >
                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Click to Upload or Drag & Drop</h3>
                <p className="text-sm text-slate-500 mb-6">Supports MP4, MOV, WEBM, JPG, PNG (Max 500MB)</p>
                <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-50 shadow-sm transition-all group-hover:border-blue-300 group-hover:text-blue-700">
                  Select File
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* URL Paste */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center max-w-2xl mx-auto w-full">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <LinkIcon size={18} className="text-gray-400" />
                  Analyze via URL
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="url" 
                    placeholder="https://example.com/video.mp4" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={() => {}}
                    disabled={!urlInput}
                    className="px-6 py-2 bg-blue-600 disabled:bg-blue-300 text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
