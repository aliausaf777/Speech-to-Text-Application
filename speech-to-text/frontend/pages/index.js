import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import RecorderPanel from "../components/RecorderPanel";
import TranscriptPanel from "../components/TranscriptPanel";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [transcriptId, setTranscriptId] = useState(null);

  const handleTranscript = (text, id) => {
    setTranscript(text);
    setTranscriptId(id);
  };

  return (
    <>
      <Head>
        <title>voxscript — speech to text</title>
        <meta name="description" content="Convert speech to text with Deepgram AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎙️</text></svg>" />
      </Head>

      <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
          {/* Page heading */}
          <div className="mb-10">
            <h1
              className="text-4xl font-bold mb-2 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif", color: "var(--ink)" }}
            >
              speak.
              <span style={{ color: "var(--accent)" }}> transcribe.</span>
            </h1>
            <p className="text-sm font-mono" style={{ color: "var(--muted)" }}>
              powered by deepgram nova-2 — record your voice, get accurate text instantly.
            </p>
          </div>

          <div className="grid gap-6">
            <RecorderPanel onTranscript={handleTranscript} />
            <TranscriptPanel transcript={transcript} />
          </div>

          {transcript && (
            <p className="text-xs font-mono mt-4 text-center animate-fade-in" style={{ color: "var(--muted)" }}>
              transcript #{transcriptId} saved to session — view all in{" "}
              <a href="/history" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                history
              </a>
            </p>
          )}
        </main>

        <footer
          className="border-t border-border px-6 py-4 text-center"
        >
          <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>
            voxscript — speech-to-text app
          </p>
        </footer>
      </div>
    </>
  );
}
