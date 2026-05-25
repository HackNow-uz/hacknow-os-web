import { getAllReleases, formatDate, getDownloadUrl, getIsoAsset, type ReleaseInfo } from "@/lib/github";

export default function ReleasesSection() {
  const releases = getAllReleases();

  return (
    <section
      id="releases"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: "1px solid rgba(255,23,68,0.07)" }}
      aria-labelledby="releases-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p
            className="text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-3"
            style={{ color: "#FF1744" }}
          >
            <span style={{ color: "rgba(255,23,68,0.4)" }} aria-hidden="true">┃</span>
            Releases
          </p>
          <h2
            id="releases-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2"
            style={{ color: "#f0f0f0" }}
          >
            Yangilanishlar
          </h2>
          <p className="text-sm font-mono" style={{ color: "#5a6a84" }}>
            Barcha versiyalar va changelog
          </p>
        </div>

        {releases.length === 0 ? (
          <div
            className="rounded-xl p-8"
            style={{
              background: "#080808",
              border: "1px solid rgba(255,23,68,0.1)",
            }}
          >
            <p className="font-mono text-sm mb-1" style={{ color: "#FF1744" }}>
              ► Birinchi release tez orada
            </p>
            <p className="font-mono text-xs" style={{ color: "#5a6a84" }}>
              Kutilayotgan versiya:{" "}
              <span style={{ color: "#a4b1cd" }}>v0.1.0-alpha</span>
            </p>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {releases.map((release) => (
              <ReleaseCard key={release.tag} release={release} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ReleaseCard({ release }: { release: ReleaseInfo }) {
  const iso = getIsoAsset(release);
  const downloadUrl = getDownloadUrl(release);

  return (
    <li
      className="rounded-xl p-5 transition-hover"
      style={{
        background: "#080808",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <span className="font-mono text-base font-semibold" style={{ color: "#f0f0f0" }}>
            {release.name}
          </span>
          <p className="text-xs font-mono mt-0.5" style={{ color: "#5a6a84" }}>
            <span style={{ color: "#FF1744" }}>{release.tag}</span>
            {" · "}
            {formatDate(release.date)}
          </p>
        </div>
        {release.prerelease && (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(245,158,11,0.1)",
              color: "#F59E0B",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
          >
            pre-release
          </span>
        )}
      </div>

      {release.changelog && (
        <p className="text-xs font-mono mb-3" style={{ color: "#5a6a84" }}>
          {release.changelog}
        </p>
      )}

      {iso && (
        <div
          className="flex items-center justify-between gap-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,23,68,0.06)" }}
        >
          <div className="font-mono text-xs" style={{ color: "#5a6a84" }}>
            <span style={{ color: "rgba(255,23,68,0.6)" }}>iso:</span>{" "}
            {iso.filename}{" "}
            <span style={{ color: "#3d4d60" }}>({iso.size})</span>
          </div>
          <a
            href={downloadUrl}
            className="text-xs font-mono font-medium px-3 py-1.5 rounded transition-hover hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-1 focus:ring-offset-[#0a0a0a]"
            style={{ background: "#FF1744", color: "#fff" }}
          >
            Yuklash
          </a>
        </div>
      )}
    </li>
  );
}
