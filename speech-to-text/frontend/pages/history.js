import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function History() {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchTranscripts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/transcripts`);
      setTranscripts(res.data.transcripts);
    } catch (err) {
      setError("Could not load transcripts. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const deleteTranscript = async (id) => {
    try {
      await axios.delete(`${API_URL}/transcripts/${id}`);
      setTranscripts((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Failed to delete transcript.");
    }
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const downloadTxt = (text, id) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Head>
        <title>voxscript — history</title>
      </Head>

      <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h1
                className="text-4xl font-bold mb-2 tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif", color: "var(--ink)" }}
              >
                history.
              </h1>
              <p className="text-sm font-mono" style={{ color: "var(--muted)" }}>
                all transcripts from this session
              </p>
            </div>
            <button
              onClick={fetchTranscripts}
              className="btn-secondary text-xs px-3 py-2"
              style={{ fontSize: "11px" }}
            >
              ↺ refresh
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-3 py-12 justify-center">
              <div
                className="w-5 h-5 border-2 rounded-full animate-spin"
                style={{ borderColor: "var(--ink)", borderTopColor: "transparent" }}
              />
              <span className="text-sm font-mono" style={{ color: "var(--muted)" }}>
                loading...
              </span>
            </div>
          )}

          {error && (
            <div
              className="p-4 text-xs font-mono animate-slide-up"
              style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
            >
              ⚠ {error}
            </div>
          )}

          {!loading && !error && transcripts.length === 0 && (
            <div
              className="border border-border border-dashed p-12 text-center animate-fade-in"
            >
              <p className="text-sm font-mono mb-2" style={{ color: "var(--muted)" }}>
                no transcripts yet
              </p>
              <a href="/" style={{ color: "var(--accent)", fontSize: "12px" }} className="font-mono underline">
                go record something →
              </a>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {transcripts.map((t, i) => (
              <div
                key={t.id}
                className="border border-border animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Header row */}
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer"
                  style={{ borderBottom: expandedId === t.id ? "1px solid var(--border)" : "none" }}
                  onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-xs font-mono px-2 py-1"
                      style={{ background: "var(--ink)", color: "var(--paper)" }}
                    >
                      #{t.id}
                    </span>
                    <div>
                      <p
                        className="text-sm font-mono"
                        style={{
                          color: "var(--ink)",
                          maxWidth: "400px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.text || "(empty transcript)"}
                      </p>
                      <p className="text-xs font-mono mt-1" style={{ color: "var(--muted)" }}>
                        {formatDate(t.created_at)} · {t.text.split(/\s+/).filter(Boolean).length} words
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                    {expandedId === t.id ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded content */}
                {expandedId === t.id && (
                  <div className="px-6 py-4 animate-fade-in">
                    <p
                      className="text-sm font-mono leading-relaxed mb-4"
                      style={{ color: "var(--ink)", whiteSpace: "pre-wrap" }}
                    >
                      {t.text}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => copyText(t.text, t.id)}
                        className="btn-secondary text-xs px-3 py-1"
                        style={{ fontSize: "11px" }}
                      >
                        {copiedId === t.id ? "✓ copied" : "copy"}
                      </button>
                      <button
                        onClick={() => downloadTxt(t.text, t.id)}
                        className="btn-secondary text-xs px-3 py-1"
                        style={{ fontSize: "11px" }}
                      >
                        ↓ .txt
                      </button>
                      <button
                        onClick={() => deleteTranscript(t.id)}
                        className="btn-danger text-xs px-3 py-1"
                        style={{ fontSize: "11px" }}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
