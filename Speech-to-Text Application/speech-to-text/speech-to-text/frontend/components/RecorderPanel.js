import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATES = {
  IDLE: "idle",
  RECORDING: "recording",
  PROCESSING: "processing",
  DONE: "done",
  ERROR: "error",
};

export default function RecorderPanel({ onTranscript }) {
  const [recState, setRecState] = useState(STATES.IDLE);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [hasMicPermission, setHasMicPermission] = useState(null); // null = unknown

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    setError("");
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasMicPermission(true);

      // Prefer webm/opus; fall back to whatever the browser supports
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        await sendAudio(blob);
      };

      mediaRecorder.start(250); // collect chunks every 250ms
      setRecState(STATES.RECORDING);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch (err) {
      setHasMicPermission(false);
      setError("Microphone access denied. Please allow microphone permissions and try again.");
      setRecState(STATES.ERROR);
    }
  }, []);

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setRecState(STATES.PROCESSING);
  }, []);

  const sendAudio = async (blob) => {
    const form = new FormData();
    form.append("file", blob, "recording.webm");

    try {
      const res = await axios.post(`${API_URL}/transcribe`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      onTranscript(res.data.transcript, res.data.id);
      setRecState(STATES.DONE);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Transcription failed. Check your API key and backend connection.";
      setError(msg);
      setRecState(STATES.ERROR);
    }
  };

  const reset = () => {
    setRecState(STATES.IDLE);
    setElapsed(0);
    setError("");
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="border border-border p-8 animate-fade-in">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
          {recState === STATES.IDLE && "ready to record"}
          {recState === STATES.RECORDING && "recording..."}
          {recState === STATES.PROCESSING && "transcribing..."}
          {recState === STATES.DONE && "transcription complete"}
          {recState === STATES.ERROR && "error occurred"}
        </span>
        {recState === STATES.RECORDING && (
          <span
            className="text-xs font-mono flex items-center gap-2"
            style={{ color: "var(--accent)" }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: "var(--accent)" }} />
            {formatTime(elapsed)}
          </span>
        )}
      </div>

      {/* Waveform / visual indicator */}
      <div
        className="flex items-center justify-center mb-8"
        style={{ height: "80px" }}
      >
        {recState === STATES.RECORDING ? (
          <div className="flex items-end gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-sm"
                style={{
                  background: i % 3 === 0 ? "var(--accent)" : "var(--ink)",
                  height: `${20 + Math.random() * 60}px`,
                  animation: `pulse-dot ${0.6 + (i % 5) * 0.15}s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        ) : recState === STATES.PROCESSING ? (
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--ink)", borderTopColor: "transparent" }}
            />
            <span className="text-sm font-mono" style={{ color: "var(--muted)" }}>
              sending to deepgram...
            </span>
          </div>
        ) : (
          <div className="flex items-end gap-1 opacity-20">
            {[4, 8, 16, 24, 16, 8, 4, 8, 12, 20, 28, 20, 12, 8, 4, 8, 16, 8, 4, 2].map(
              (h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-sm"
                  style={{ background: "var(--ink)", height: `${h}px` }}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          className="mb-6 p-4 text-xs font-mono animate-slide-up"
          style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {recState === STATES.IDLE && (
          <button onClick={startRecording} className="btn-primary">
            ● start recording
          </button>
        )}

        {recState === STATES.RECORDING && (
          <button onClick={stopRecording} className="btn-primary">
            ■ stop & transcribe
          </button>
        )}

        {(recState === STATES.DONE || recState === STATES.ERROR) && (
          <button onClick={reset} className="btn-secondary">
            ↺ record again
          </button>
        )}

        {recState === STATES.PROCESSING && (
          <button disabled className="btn-primary opacity-50 cursor-not-allowed">
            processing...
          </button>
        )}
      </div>

      {/* Mic permission hint */}
      {hasMicPermission === null && recState === STATES.IDLE && (
        <p className="text-xs text-center mt-4" style={{ color: "var(--muted)" }}>
          your browser will ask for microphone permission on first use
        </p>
      )}
    </div>
  );
}
