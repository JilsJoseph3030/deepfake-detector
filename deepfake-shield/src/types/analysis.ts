// Typed interfaces for VERITY analysis results

export interface ForensicNode {
  type: string;
  location: string;
  confidence: number;
}

export interface Finding {
  title: string;
  technical: string;
  severity: "high" | "medium" | "low";
  nodes?: ForensicNode[];
}

export interface VisualForensics {
  findings: Finding[];
}

export interface AudioForensics {
  findings: Finding[];
}

export interface Provenance {
  c2pa: boolean;
  hash?: string;
  source?: string;
  captureDate?: string;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  confidence: number;
  verdict: "deepfake" | "authentic" | "inconclusive";
  visualForensics: VisualForensics;
  audioForensics: AudioForensics;
  provenance: Provenance;
  analyzedAt?: string;
}
