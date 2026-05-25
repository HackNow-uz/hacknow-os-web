"use client";

import { useState } from "react";
import { type ReleaseInfo, getDownloadUrl, getIsoAsset, getTorrentUrl, getZsyncUrl } from "@/lib/github";

interface DownloadSectionProps {
  release?: ReleaseInfo | null;
}

export default function DownloadSection({ release }: DownloadSectionProps) {
  const [copied, setCopied] = useState(false);
  const iso = release ? getIsoAsset(release) : undefined;
  const downloadUrl = release ? getDownloadUrl(release) : "#releases";
  const torrentUrl = release ? getTorrentUrl(release) : null;
  const zsyncUrl = release ? getZsyncUrl(release) : null;

  const handleCopy = async () => {
    if (!iso?.sha256) return;
    try {
      await navigator.clipboard.writeText(iso.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <section
      id="download"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: "1px solid rgba(255,23,68,0.07)" }}
      aria-labelledby="download-heading"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="text-xs font-mono uppercase tracking-widest mb-8 flex items-center justify-center gap-3"
          style={{ color: "#FF1744" }}
        >
          <span style={{ color: "rgba(255,23,68,0.4)" }} aria-hidden="true">┃</span>
          Yuklab Olish
        </div>

        <h2
          id="download-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3"
          style={{ color: "#f0f0f0" }}
        >
          HackNow <span style={{ color: "#FF1744" }}>OS</span>{" "}
          <span className="font-mono" style={{ color: "#FF1744" }}>
            {release?.tag ?? "v0.1.0-alpha"}
          </span>
        </h2>
        <p className="text-sm mb-10 font-mono" style={{ color: "#5a6a84" }}>
          Debian 12 (Bookworm) amd64
          {iso && <span style={{ color: "#3d4d60" }}> · {iso.size}</span>}
        </p>

        {release && iso ? (
          <>
            <a
              href={downloadUrl}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg text-sm font-mono font-medium transition-hover hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] mb-4"
              style={{ background: "#FF1744", color: "#fff" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              ISO Yuklab Olish ({iso.size})
            </a>
            <div className="flex items-center justify-center gap-3 mb-10">
              {torrentUrl && (
                <a
                  href={torrentUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-hover hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#a4b1cd" }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                  </svg>
                  Torrent
                </a>
              )}
              {zsyncUrl && (
                <a
                  href={zsyncUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-hover hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#a4b1cd" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Zsync
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="mb-10 flex flex-col items-center gap-4">
            <div
              className="w-full max-w-md px-5 py-4 rounded-lg text-left"
              style={{
                background: "rgba(255,23,68,0.04)",
                border: "1px solid rgba(255,23,68,0.15)",
              }}
              role="status"
            >
              <p className="font-mono text-sm mb-1" style={{ color: "#FF1744" }}>
                ► Birinchi release tez orada
              </p>
              <p className="font-mono text-xs" style={{ color: "#5a6a84" }}>
                Kutilayotgan versiya:{" "}
                <span style={{ color: "#a4b1cd" }}>v0.1.0-alpha</span>
              </p>
            </div>
            <a
              href="https://t.me/hacknow_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg text-sm font-mono font-medium transition-hover hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              style={{ background: "#FF1744", color: "#fff" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram&apos;da kuzating
            </a>
          </div>
        )}

        <div
          className="text-left space-y-3 px-4 py-4 rounded-lg mb-8"
          style={{
            background: "#080808",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs" style={{ color: "rgba(255,23,68,0.7)" }}>
                SHA256:{" "}
              </span>
              <span className="font-mono text-xs" style={{ color: "#3d4d60" }}>
                {iso?.sha256 || "(build natijasi kelganda)"}
              </span>
            </div>
            {iso?.sha256 && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex-shrink-0 text-xs font-mono px-2 py-1 rounded transition-hover hover:bg-white/5 focus:outline-none focus:ring-1 focus:ring-[#FF1744] focus:ring-offset-1 focus:ring-offset-[#0a0a0a]"
                style={{ color: copied ? "#a4b1cd" : "#5a6a84" }}
                aria-label="SHA256 nusxalash"
              >
                {copied ? "✓ nusxalandi" : "nusxalash"}
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs" style={{ color: "rgba(255,23,68,0.7)" }}>
                GPG:{" "}
              </span>
              <span className="font-mono text-xs" style={{ color: "#3d4d60" }}>
                EE639BAA5A076195
              </span>
            </div>
            <a
              href="/releases/hacknow-os-signing-key.asc"
              className="flex-shrink-0 text-xs font-mono px-2 py-1 rounded transition-hover hover:bg-white/5"
              style={{ color: "#5a6a84" }}
            >
              kalit yuklab olish
            </a>
          </div>
          {release && iso && (
            <div>
              <span className="font-mono text-xs" style={{ color: "rgba(255,23,68,0.7)" }}>
                SIG:{" "}
              </span>
              <a
                href={`/releases/${iso.filename}.asc`}
                className="font-mono text-xs hover:underline"
                style={{ color: "#3d4d60" }}
              >
                {iso.filename}.asc
              </a>
            </div>
          )}
        </div>

        <p className="text-xs font-mono leading-relaxed" style={{ color: "#3d4d60" }}>
          # Faqat qonuniy maqsadlar, ta&apos;lim va ruxsat berilgan pentesting uchun.
        </p>
      </div>
    </section>
  );
}
