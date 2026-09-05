import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VERITY — AI-Powered Deepfake Detection",
  description:
    "VERITY uses advanced spatial forensics, C2PA provenance checks, and audio analysis to detect deepfakes and verify the authenticity of media.",
  keywords: ["deepfake detection", "media forensics", "AI", "C2PA", "authenticity"],
  openGraph: {
    title: "VERITY — AI-Powered Deepfake Detection",
    description: "Verify what you see before you trust it.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
