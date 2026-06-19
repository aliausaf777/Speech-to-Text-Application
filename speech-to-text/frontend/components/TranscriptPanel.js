import { useState } from "react";

export default function TranscriptPanel({ transcript }) {
  const [copied, setCopied] = useState(false);

  if (!transcript) {
    return (
      <div
        className="border border-border border-dashed p-8 flex flex-col items-center justify-center text-center animate-fade-in"
        style={{ minHeight: "200px" }}
      >
        <div className="mb-3 opacity-20">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="8" width="20" height="2" rx="1" fill="var(--ink)" />
            <rect x="6" y="13" width="14" height="2" rx="1" fill="var(--ink)" />
            <rect x="6" y="18" width="17" height="2" rx="1" fill="var(--ink)" />
            <rect x="6" y="23" width="10" height="2" rx="1" fill="var(--ink)" />
          </svg>
        </div>
        <p className="text-sm font-mono" style={{ color: "var(--muted)" }}>
          transcript will appear here
        </p>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadTxt = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-border animate-slide-up">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
          transcript
        </span>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="btn-secondary text-xs px-3 py-1"
            style={{ fontSize: "11px" }}
          >
            {copied ? "✓ copied" : "copy"}
          </button>
          <button
            onClick={downloadTxt}
            className="btn-secondary text-xs px-3 py-1"
            style={{ fontSize: "11px" }}
          >
            ↓ .txt
          </button>
        </div>
      </div>

      {/* Text */}
      <div className="p-6">
        <p
          className="font-mono text-sm leading-relaxed"
          style={{ color: "var(--ink)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {transcript}
        </p>
      </div>

      {/* Word count */}
      <div
        className="px-6 py-3 border-t flex gap-4"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
          {transcript.split(/\s+/).filter(Boolean).length} words
        </span>
        <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
          {transcript.length} characters
        </span>
      </div>
    </div>
  );
}
