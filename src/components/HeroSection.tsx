import { HACKNOW_ASCII } from "@/lib/ascii-logo";
import { type ReleaseInfo, getDownloadUrl, getIsoAsset } from "@/lib/github";

interface HeroSectionProps {
  release?: ReleaseInfo | null;
}

export default function HeroSection({ release }: HeroSectionProps) {
  const iso = release ? getIsoAsset(release) : undefined;
  const downloadUrl = release ? getDownloadUrl(release) : null;

  return (
    <section
      className="relative flex items-center justify-center min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(255,23,68,0.06) 0%, transparent 55%), #0a0a0a",
      }}
      aria-label="HackNow OS"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
            <pre
              className="font-mono whitespace-pre select-text leading-tight"
              style={{
                color: "#FF1744",
                fontSize: "clamp(0.6rem, 1.1vw, 0.8rem)",
                lineHeight: 1.15,
                textShadow: "0 0 20px rgba(255,23,68,0.4)",
                opacity: 0.92,
              }}
              aria-label="HackNow OS logo"
            >
              {HACKNOW_ASCII}
            </pre>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 mb-7 px-3 py-1 rounded-full text-xs font-mono"
              style={{
                background: "rgba(255,23,68,0.08)",
                border: "1px solid rgba(255,23,68,0.25)",
                color: "#FF1744",
              }}
              role="status"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#FF1744" }}
                aria-hidden="true"
              />
              Alpha — faqat test uchun
            </div>

            <h1
              className="font-bold tracking-tight mb-4"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
                lineHeight: 1.05,
                color: "#f0f0f0",
              }}
            >
              HackNow{" "}
              <span style={{ color: "#FF1744" }}>OS</span>
              <span
                className="cursor-blink inline-block align-baseline ml-1"
                style={{
                  width: "0.55em",
                  height: "0.85em",
                  background: "#FF1744",
                  display: "inline-block",
                  verticalAlign: "text-bottom",
                  marginBottom: "0.05em",
                }}
                aria-hidden="true"
              />
            </h1>

            <p
              className="text-base sm:text-lg mb-2 font-mono"
              style={{ color: "#a4b1cd" }}
            >
              Pentesting va kiberxavfsizlik uchun Linux distributivi
            </p>
            <p
              className="text-sm mb-9 font-mono"
              style={{ color: "#5a6a84" }}
            >
              O&apos;zbekistonda yaratilgan
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-9">
              {downloadUrl && iso ? (
                <a
                  href={downloadUrl}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-sm font-medium font-mono transition-hover hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] w-full sm:w-auto"
                  style={{ background: "#FF1744", color: "#fff" }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Yuklab Olish ({iso.size})
                </a>
              ) : (
                <a
                  href="#download"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-sm font-medium font-mono transition-hover hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] w-full sm:w-auto"
                  style={{
                    background: "rgba(255,23,68,0.15)",
                    border: "1px solid rgba(255,23,68,0.3)",
                    color: "#FF1744",
                  }}
                >
                  Tez orada chiqadi
                </a>
              )}
              <a
                href="#docs"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-sm font-medium font-mono transition-hover hover:bg-white/5 hover:border-[rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] w-full sm:w-auto"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#a4b1cd",
                }}
              >
                Hujjatlar
              </a>
            </div>

            <div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs font-mono"
              style={{ color: "#5a6a84" }}
            >
              <span style={{ color: "#FF1744" }}>{release?.tag ?? "v0.1.0-alpha"}</span>
              <span style={{ color: "rgba(255,23,68,0.3)" }} aria-hidden="true">·</span>
              <span>Debian 12 asosida</span>
              <span style={{ color: "rgba(255,23,68,0.3)" }} aria-hidden="true">·</span>
              <span>GPL-3.0</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0a0a0a)" }}
        aria-hidden="true"
      />
    </section>
  );
}
