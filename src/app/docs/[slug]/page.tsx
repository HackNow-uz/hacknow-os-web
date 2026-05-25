import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { getDocs } from "@/lib/github";

export const revalidate = 3600;

const TITLE_MAP: Record<string, string> = {
  "01-kirish": "Kirish — HackNow OS nima?",
  "02-ornatish": "O'rnatish",
  "03-birinchi-qadamlar": "Birinchi qadamlar",
  "04-toollar": "Tool qo'llanma",
  "05-platforma": "HackNow platforma",
  "06-faq": "Ko'p beriladigan savollar",
  "07-troubleshooting": "Muammo hal qilish",
};

const DOC_SLUGS = Object.keys(TITLE_MAP);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(TITLE_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = TITLE_MAP[slug] ?? slug;
  const pageTitle = `${title} | HackNow OS Docs`;

  // Markdown kontentning birinchi 160 belgisini description sifatida olish
  let description =
    "HackNow OS hujjatlari — o'rnatish, sozlash va tool qo'llanmalari.";
  try {
    const docs = await getDocs();
    const doc = docs.find((d) => d.name === `${slug}.md`);
    if (doc) {
      const res = await fetch(doc.download_url, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const text = await res.text();
        // Markdown belgilarini olib, birinchi 160 belgi
        const plain = text
          .replace(/^#+\s+/gm, "")
          .replace(/[`*_[\]()]/g, "")
          .replace(/\s+/g, " ")
          .trim();
        if (plain.length > 0) {
          description = plain.slice(0, 160);
        }
      }
    }
  } catch {
    // fetch xatosi bo'lsa default description qoladi
  }

  const canonicalUrl = `https://os.hacknow.uz/docs/${slug}`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      type: "article",
      url: canonicalUrl,
    },
  };
}

async function fetchMarkdown(downloadUrl: string): Promise<string | null> {
  try {
    const res = await fetch(downloadUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const currentIndex = DOC_SLUGS.indexOf(slug);
  const prevSlug = currentIndex > 0 ? DOC_SLUGS[currentIndex - 1] : null;
  const nextSlug = currentIndex < DOC_SLUGS.length - 1 ? DOC_SLUGS[currentIndex + 1] : null;

  const docs = await getDocs();
  const doc = docs.find((d) => d.name === `${slug}.md`);

  let markdown: string | null = null;
  if (doc) {
    markdown = await fetchMarkdown(doc.download_url);
  }

  if (!doc && !TITLE_MAP[slug]) {
    notFound();
  }

  const title = TITLE_MAP[slug] ?? slug;

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-20 pb-20 min-h-screen">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex items-center gap-2 text-xs font-mono"
            style={{ color: "#5a6a84" }}
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="transition-hover hover:text-[#FF1744]"
            >
              ~
            </Link>
            <span style={{ color: "rgba(255,23,68,0.3)" }}>/</span>
            <Link
              href="/#docs"
              className="transition-hover hover:text-[#FF1744]"
            >
              docs
            </Link>
            <span style={{ color: "rgba(255,23,68,0.3)" }}>/</span>
            <span style={{ color: "#FF1744" }}>{slug}.md</span>
          </nav>

          {/* Title */}
          <h1
            className="font-bold mb-2 tracking-tight"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              color: "#f0f0f0",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>

          <p
            className="text-xs font-mono mb-8"
            style={{ color: "#5a6a84" }}
          >
            {doc ? doc.name : "Hujjat hali tayyorlanmagan"}
          </p>

          <div
            className="mb-10"
            style={{ borderBottom: "1px solid rgba(255,23,68,0.15)" }}
          />

          {/* Markdown content — HackNow platform'ning renderer'i */}
          {markdown ? (
            <MarkdownRenderer content={markdown} />
          ) : (
            <div
              className="rounded-xl p-8"
              style={{
                background: "#080808",
                border: "1px solid rgba(255,23,68,0.1)",
              }}
            >
              <p
                className="font-mono text-sm mb-2"
                style={{ color: "#FF1744" }}
              >
                ► Sahifa tayyorlanmoqda
              </p>
              <p
                className="font-mono text-xs mb-5"
                style={{ color: "#5a6a84" }}
              >
                Hujjat tayyorlanmoqda — tez orada qo&apos;shiladi.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm font-mono transition-hover hover:opacity-80"
                style={{ color: "#FF1744" }}
              >
                Bosh sahifaga qaytish
                <span aria-hidden="true">→</span>
              </a>
            </div>
          )}

          {/* Prev / Next navigation */}
          <nav
            className="mt-12 pt-6 flex items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            aria-label="Hujjatlar navigatsiyasi"
          >
            <div className="flex-1">
              {prevSlug ? (
                <Link
                  href={`/docs/${prevSlug}`}
                  className="inline-flex items-center gap-2 text-sm font-mono transition-hover hover:opacity-80 group"
                  style={{ color: "#a4b1cd" }}
                >
                  <span aria-hidden="true" style={{ color: "#FF1744" }}>←</span>
                  <span>
                    <span className="block text-xs mb-0.5" style={{ color: "#5a6a84" }}>Oldingi</span>
                    <span className="group-hover:text-[#FF1744] transition-hover">{TITLE_MAP[prevSlug]}</span>
                  </span>
                </Link>
              ) : (
                <Link
                  href="/#docs"
                  className="inline-flex items-center gap-2 text-sm font-mono transition-hover hover:opacity-80"
                  style={{ color: "#5a6a84" }}
                >
                  <span aria-hidden="true">←</span>
                  Barcha hujjatlar
                </Link>
              )}
            </div>

            <div className="flex-1 flex justify-end">
              {nextSlug && (
                <Link
                  href={`/docs/${nextSlug}`}
                  className="inline-flex items-center gap-2 text-sm font-mono transition-hover hover:opacity-80 group text-right"
                  style={{ color: "#a4b1cd" }}
                >
                  <span>
                    <span className="block text-xs mb-0.5" style={{ color: "#5a6a84" }}>Keyingi</span>
                    <span className="group-hover:text-[#FF1744] transition-hover">{TITLE_MAP[nextSlug]}</span>
                  </span>
                  <span aria-hidden="true" style={{ color: "#FF1744" }}>→</span>
                </Link>
              )}
            </div>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
