# Deepfake Shield — Master Antigravity Execution Spec (Merged & Optimized)

## 1. Product Identity & Positioning
* **Product Name:** Deepfake Shield
* **Core Value Statement:** "We don't just tell you whether media looks suspicious. We show the evidence, explain why, and help trace where it came from."
* **Strict Positioning Rule:** NEVER claim "100% Real/Fake" or "100% Accurate". Position as an evidence-based investigation platform with honest uncertainty handling.
* **4-Tier Verdict System:**
  1. 🟢 **GREEN:** No Strong Manipulation Indicators
  2. 🟡 **YELLOW:** Manipulation Indicators Detected
  3. 🔴 **RED:** Strong Synthetic / Manipulation Evidence
  4. ⚪ **GREY:** Unable to Verify (High Compression / Insufficient Data)

---

## 2. 3-Hour Timeboxed Execution Schedule

| Time Window | Focus Module | Core Deliverable | Priority |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:15** | Module 1: Layout & Landing | Header, Navbar, Dark Theme, Landing Hero (`/`) | Critical |
| **0:15 – 0:40** | Module 2: Ingestion Workspace | `/verify` Dropzone, URL paste, Preset Samples | Critical |
| **0:40 – 1:00** | Module 3: Processing Engine | Stepper animation, mock pipeline execution | Critical |
| **1:00 – 1:40** | Module 4: Forensic Dashboard | `/results/[id]` Heatmap toggle, Waveform player | Critical |
| **1:40 – 2:00** | Module 5: Explainability | Plain-language VLM box, C2PA trace timeline | Critical |
| **2:00 – 2:15** | Module 6: Sample Cases | `/cases` Pre-built investigation scenarios | High |
| **2:15 – 2:30** | Module 7: Report Generation | PDF export modal for newsroom compliance | High |
| **2:30 – 2:40** | Extension Simulation | `/extension` Mock X/Twitter feed with Shield Badges | Medium |
| **2:40 – 3:00** | Polish & Test | Bug fixes, responsiveness check via Antigravity Agent | Critical |

---

## 3. Data Schema & Mock API Contract (`/api/analyze`)

```json
{
  "id": "case_98231",
  "fileName": "political_speech_edited.mp4",
  "mediaType": "video",
  "timestamp": "2026-09-05T09:55:00Z",
  "verdict": "manipulation_indicators",
  "verdictLabel": "Manipulation Indicators Detected",
  "verdictColor": "yellow",
  "confidence": 82,
  "summary": "The media contains multiple signals consistent with synthetic or manipulated content, specifically in facial landmarks and audio synchronization.",
  "provenance": {
    "c2pa": false,
    "metadata": "partial",
    "software": "Adobe Premiere Pro / Unknown AI Model",
    "status": "Origin cannot be fully established"
  },
  "visualForensics": {
    "score": 82,
    "findings": [
      {
        "title": "Facial-Region Artifacts",
        "severity": "high",
        "technical": "Temporal landmark jitter observed across frames 120-180.",
        "plainLanguage": "The face changes slightly between frames in a way that is uncommon in natural footage."
      }
    ]
  },
  "audioForensics": {
    "score": 71,
    "findings": [
      {
        "title": "Phoneme-Viseme Misalignment",
        "severity": "medium",
        "technical": "120ms lip desynchronization detected at timestamp 00:14.",
        "plainLanguage": "Spoken sounds do not perfectly match lip movements during speech."
      }
    ]
  },
  "sourceTrace": [
    {"source": "Original YouTube Broadcast", "published": "3 days earlier", "similarity": 94},
    {"source": "X (Twitter) Clip Copy", "published": "6 hours earlier", "similarity": 81}
  ]
}
```

---

## 4. Antigravity Build Modules & Prompts

### Module 1: Core Layout & Navigation
```text
Build Module 1 for Deepfake Shield in Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui.
Set up a dark professional digital-forensics newsroom layout.
Build the Header with links: "Verify", "Cases", "Extension", "Reports".
Build the Landing Page (`/`) with Headline: "Verify what you see before you trust it."
Primary CTA: "Verify Media" (routes to `/verify`), Secondary CTA: "Explore Sample Cases".
Include a visual diagram showing: Media -> Provenance -> Forensics -> Source Trace -> Explained Verdict.
Run the dev server and fix any build errors.
```

### Module 2 & 3: Media Ingestion & Processing (`/verify`)
```text
Build Module 2 & 3 at `/verify`.
Create an interactive dropzone supporting drag-and-drop file upload (Image, Audio, Video), URL paste field, and a "Sample Presets" bar (Deepfake Image, Edited Video, Real Audio) for 1-click testing.
When a file/preset is selected, display an animated multi-step analysis progress bar:
1. Extracting C2PA Metadata
2. Computing Perceptual Hashes
3. Running Spatial & Audio Forensics
4. Synthesizing Evidence & Verdict
After 1.5 seconds, automatically route to `/results/case_98231`.
```

### Module 4 & 5: Forensic Dashboard & Explainability (`/results/[id]`)
```text
Build Module 4 & 5 at `/results/[id]`.
Display a high-density investigation dashboard:
1. Top Banner: Media thumbnail, filename, overall 4-tier verdict badge, and confidence percentage.
2. Dual-View Media Inspector: Toggle between "Original View" and "Forensic View" (showing heatmaps and frequency anomalies on the canvas). Include audio waveform player for speech files.
3. Provenance & C2PA Card: Metadata status, creation software, and digital signatures.
4. Explainability Panel: Plain-language explanations written for journalists explaining *why* specific frame/audio anomalies are flagged.
5. Source Trace Timeline: Showing earlier matched versions of the clip.
```

### Module 6 & 7: Sample Cases & Newsroom PDF Export
```text
Build Module 6 (`/cases`) and Module 7 (Report Export).
At `/cases`, display a grid of 4 pre-built scenarios:
1. AI Portrait (Red - Strong Synthetic Evidence)
2. Edited Political Clip (Yellow - Manipulation Indicators)
3. Authentic Photo (Green - No Strong Manipulation Indicators)
4. Highly Compressed Clip (Grey - Unable to Verify)
Add an "Export Verification Report" button on the results page that opens a clean, printable PDF-style modal formatted for newsroom editorial compliance.
```

### Module 8: Chrome Extension Simulation (`/extension`)
```text
Build Module 8 at `/extension`.
Render a mock X/Twitter social feed.
Inject inline "Shield Badges" next to media posts in the feed.
Clicking a badge opens an overlay popup displaying real-time pHash verification, C2PA status, and a "View Full Evidence" button that links to `/results/[id]`.
```
