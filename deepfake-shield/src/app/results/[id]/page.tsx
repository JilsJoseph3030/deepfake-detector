"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, Info, UploadCloud, CheckCircle, Loader2, AlertTriangle, 
  ChevronRight, Maximize2, Download, SkipBack, Play, SkipForward, Share2, 
  FileText, LayoutGrid, Upload, FileBarChart, Settings, MoveHorizontal
} from 'lucide-react';

export default function VerityDashboard() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('verity_result');
    if (storedData) {
      try {
        setData(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse stored result", e);
      }
    }
  }, [params.id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setUploadProgress(10);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const interval = setInterval(() => {
        setUploadProgress(p => (p < 90 ? p + 10 : 90));
      }, 200);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!response.ok) throw new Error("Analysis failed");

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  useEffect(() => {
    fetchMockData();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">VERITY</span>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-blue-600 font-medium text-sm">Dashboard</a>
                <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">Upload</a>
                <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">Reports</a>
                <a href="#" className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors">Batch Processing</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Real-time Protection Active
              </div>
              <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload & Batch */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Media Analysis</h2>
                <Info size={18} className="text-gray-400" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="video/*,image/*,audio/*"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50/50"
              >
                <UploadCloud size={40} className="text-blue-500 mb-3 mx-auto" />
                <p className="text-sm font-medium text-slate-800">Drop videos here to scan</p>
                <p className="text-xs text-slate-500 mt-1">MP4, MOV, WEBM (Max 500MB)</p>
                <button className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 shadow-sm">
                  Browse Files
                </button>
              </div>
              
              {loading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600">Analyzing media...</span>
                    <span className="text-xs text-blue-600 font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-200 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Batch Queue</h2>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">3 files recent</span>
              </div>
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-slate-800">news_anchor_clip.mp4</p>
                    <p className="text-[10px] text-emerald-600">Verified Authentic</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
                
                {loading && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 animate-pulse">
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate text-blue-800">Current Upload</p>
                      <p className="text-[10px] text-blue-600">Analyzing facial artifacts...</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-slate-800">ceo_statement_leaked.mov</p>
                    <p className="text-[10px] text-red-600">Deepfake Detected (92%)</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Analysis & Comparison */}
          <div className="lg:col-span-8 space-y-8">
            {data ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <span className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Authenticity Score</span>
                    <span className="text-3xl font-bold text-red-600">{100 - data.confidence}%</span>
                    <span className="text-xs text-red-500 font-medium mt-1">Highly Suspicious</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <span className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Deepfake Likelihood</span>
                    <span className="text-3xl font-bold text-slate-800">{data.confidence}%</span>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: `${data.confidence}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <span className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Detection Nodes</span>
                    <span className="text-3xl font-bold text-slate-800">2/3</span>
                    <span className="text-xs text-slate-500 font-medium mt-1">Models Flagged Anomalies</span>
                  </div>
                </div>

                <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-lg">Frame-by-Frame Comparison</h2>
                      <p className="text-xs text-slate-500">Comparing original reference vs detected anomalies</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-slate-600 transition-colors"><Maximize2 size={18} /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-slate-600 transition-colors"><Download size={18} /></button>
                    </div>
                  </div>
                  <div className="relative bg-slate-900 aspect-video group">
                    <div className="absolute inset-0 flex">
                      <div className="relative flex-1 overflow-hidden border-r-2 border-blue-600/50 bg-slate-800 flex items-center justify-center">
                        <span className="text-slate-500 font-medium text-sm">Media Source</span>
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 text-white text-[10px] font-bold rounded uppercase tracking-widest backdrop-blur-md">Reference</div>
                      </div>
                      <div className="relative flex-1 overflow-hidden bg-slate-800 flex items-center justify-center">
                        <span className="text-slate-500 font-medium text-sm">Heatmap View</span>
                        <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-red-500/50 via-yellow-500/20 to-transparent pointer-events-none"></div>
                        
                        {data.visualForensics.findings[0]?.nodes?.map((node: any, idx: number) => (
                          <div key={idx} className={`absolute border-2 rounded-lg animate-pulse ${idx === 0 ? 'top-1/3 left-1/4 w-32 h-32 border-red-500' : 'top-1/4 right-1/4 w-24 h-24 border-yellow-500'}`}>
                            <span className={`absolute -top-6 left-0 text-white text-[8px] px-1 rounded ${idx === 0 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                              {node.type}: {node.location} {node.confidence}%
                            </span>
                          </div>
                        ))}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-red-600/80 text-white text-[10px] font-bold rounded uppercase tracking-widest backdrop-blur-md">Suspected Mask</div>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-blue-600 z-10 pointer-events-none shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white">
                        <MoveHorizontal size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-center gap-8">
                       <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                          <SkipBack size={20} />
                       </button>
                       <button className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                          <Play size={20} className="translate-x-0.5" />
                       </button>
                       <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                          <SkipForward size={20} />
                       </button>
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="font-semibold text-lg mb-6">Analysis Insight Reports</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {data.visualForensics.findings.map((finding: any, idx: number) => (
                        <div key={`visual-${idx}`} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                          <div className={`mt-1 w-2 h-2 rounded-full ${finding.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{finding.title}</p>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">{finding.technical}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {data.audioForensics.findings.map((finding: any, idx: number) => (
                        <div key={`audio-${idx}`} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                          <div className={`mt-1 w-2 h-2 rounded-full ${finding.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{finding.title}</p>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">{finding.technical}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className={`mt-1 w-2 h-2 rounded-full ${data.provenance.c2pa ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Metadata Integrity</p>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">
                            {data.provenance.c2pa ? "C2PA signature verified." : "Original capture metadata present, but file shows evidence of re-encoding or missing C2PA."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-3">
                    <button className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Share2 size={16} />
                      Share Report
                    </button>
                    <button className="px-6 py-2 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2">
                      <FileText size={16} />
                      Export Detailed PDF
                    </button>
                  </div>
                </section>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">Awaiting Media</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">Upload a video file on the left to generate the spatial analysis report and authenticity breakdown.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation (Floating Bottom Bar) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
        <nav className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 flex items-center justify-around">
          <a href="#" className="p-3 text-blue-600 bg-blue-50 rounded-xl"><LayoutGrid size={24} /></a>
          <a href="#" className="p-3 text-slate-400"><Upload size={24} /></a>
          <a href="#" className="p-3 text-slate-400"><FileBarChart size={24} /></a>
          <a href="#" className="p-3 text-slate-400"><Settings size={24} /></a>
        </nav>
      </div>
    </div>
  );
}
