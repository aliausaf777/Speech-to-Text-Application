import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <header className="border-b border-border sticky top-0 z-50" style={{ background: "var(--paper)" }}>
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ background: "var(--ink)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="10" width="2" height="4" fill="var(--paper)" />
              <rect x="5" y="7" width="2" height="7" fill="var(--paper)" />
              <rect x="8" y="4" width="2" height="10" fill="var(--paper)" />
              <rect x="11" y="2" width="2" height="12" fill="var(--accent)" />
            </svg>
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", color: "var(--ink)" }}
          >
            vox<span style={{ color: "var(--accent)" }}>script</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 text-xs font-mono transition-colors"
            style={{
              color: router.pathname === "/" ? "var(--accent)" : "var(--muted)",
              borderBottom: router.pathname === "/" ? "1px solid var(--accent)" : "1px solid transparent",
            }}
          >
            record
          </Link>
          <Link
            href="/history"
            className="px-4 py-2 text-xs font-mono transition-colors"
            style={{
              color: router.pathname === "/history" ? "var(--accent)" : "var(--muted)",
              borderBottom: router.pathname === "/history" ? "1px solid var(--accent)" : "1px solid transparent",
            }}
          >
            history
          </Link>
        </nav>
      </div>
    </header>
  );
}
