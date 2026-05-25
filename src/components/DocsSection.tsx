import { getDocs, type DocFile } from "@/lib/github";

const TITLE_MAP: Record<string, string> = {
  "01-kirish.md": "Kirish — HackNow OS nima?",
  "02-ornatish.md": "O'rnatish",
  "03-birinchi-qadamlar.md": "Birinchi qadamlar",
  "04-toollar.md": "Tool qo'llanma",
  "05-platforma.md": "HackNow platforma",
  "06-faq.md": "Ko'p beriladigan savollar",
  "07-troubleshooting.md": "Muammo hal qilish",
};

function getTitle(filename: string): string {
  return TITLE_MAP[filename] ?? filename.replace(/^\d+-/, "").replace(/\.md$/, "");
}

export default async function DocsSection() {
  const docs = await getDocs();

  return (
    <section
      id="docs"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: "1px solid rgba(255,23,68,0.07)" }}
      aria-labelledby="docs-heading"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-10">
          <p
            className="text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-3"
            style={{ color: "#FF1744" }}
          >
            <span style={{ color: "rgba(255,23,68,0.4)" }} aria-hidden="true">┃</span>
            Documentation
          </p>
          <h2
            id="docs-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2"
            style={{ color: "#f0f0f0" }}
          >
            Hujjatlar
          </h2>
          <p className="text-sm font-mono" style={{ color: "#5a6a84" }}>
            O&apos;zbek tilida to&apos;liq qo&apos;llanma
          </p>
        </div>

        {/* Empty state — graceful fallback */}
        {docs.length === 0 ? (
          <div
            className="rounded-xl p-8"
            style={{
              background: "#080808",
              border: "1px solid rgba(255,23,68,0.1)",
            }}
          >
            <p
              className="font-mono text-sm mb-1"
              style={{ color: "#FF1744" }}
            >
              ► Hujjatlar tayyorlanmoqda
            </p>
            <p
              className="font-mono text-xs mb-5"
              style={{ color: "#5a6a84" }}
            >
              Kutilayotgan sahifalar: kirish, o&apos;rnatish, tool qo&apos;llanma, FAQ
            </p>
            <a
              href="https://t.me/hacknow_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono font-medium transition-hover hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-[#FF1744] rounded"
              style={{ color: "#FF1744" }}
            >
              Telegram&apos;da kuzating
              <span aria-hidden="true">→</span>
            </a>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
            {docs.map((doc) => (
              <DocCard key={doc.path} doc={doc} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function DocCard({ doc }: { doc: DocFile }) {
  // Slug — fayl nomidan .md ni olib tashlash
  const slug = doc.name.replace(/\.md$/, "");

  return (
    <li>
      <a
        href={`/docs/${slug}`}
        className="group block rounded-xl p-4 transition-hover focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-1 focus:ring-offset-[#0a0a0a]"
        style={{
          background: "#080808",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="font-mono text-sm flex-shrink-0 mt-0.5 transition-hover"
            style={{ color: "rgba(255,23,68,0.5)" }}
            aria-hidden="true"
          >
            ►
          </span>
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-mono font-medium mb-1 truncate transition-hover group-hover:text-[#FF1744]"
              style={{ color: "#f0f0f0" }}
            >
              {getTitle(doc.name)}
            </h3>
            <p
              className="text-xs font-mono"
              style={{ color: "#3d4d60" }}
            >
              {doc.name}
            </p>
          </div>
        </div>
      </a>
    </li>
  );
}
