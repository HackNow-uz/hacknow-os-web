const features = [
  {
    glyph: "01",
    title: "60+ Pentest Tool",
    stat: "60+",
    description:
      "9 kategoriyada asosiy toollar o'rnatilgan holda. Nmap, sqlmap, nikto, john, hashcat, wireshark va ko'plab boshqalar.",
  },
  {
    glyph: "02",
    title: "HackNow CLI",
    stat: "12",
    description:
      "12 ta maxsus utility — hn-recon, hn-decode, hn-hash va boshqalar. HackNow platforma bilan to'g'ridan-to'g'ri integratsiya.",
  },
  {
    glyph: "03",
    title: "O'zbek Tilida",
    stat: "100%",
    description:
      "Interfeys va hujjatlar o'zbek tilida. Mahalliy kiberxavfsizlik hamjamiyati uchun yaratilgan.",
  },
  {
    glyph: "04",
    title: "XFCE Desktop",
    stat: "4.18",
    description:
      "Yengil va tez XFCE 4.18. Minimal resurs sarflaydi. Pentesting uchun moslashtirilgan muhit.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: "1px solid rgba(255,23,68,0.07)" }}
      aria-labelledby="features-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div
          className="text-xs font-mono uppercase tracking-widest mb-8 flex items-center gap-3"
          style={{ color: "#FF1744" }}
        >
          <span style={{ color: "rgba(255,23,68,0.4)" }} aria-hidden="true">┃</span>
          Xususiyatlar
        </div>

        <h2
          id="features-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight mb-14"
          style={{ color: "#f0f0f0" }}
        >
          Nima bor ichida
        </h2>

        {/* 2x2 grid separated by a thin red-tinted gap */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ background: "rgba(255,23,68,0.06)" }}
        >
          {features.map((feature) => (
            <article
              key={feature.title}
              className="feature-card relative flex gap-5 p-7"
              style={{ background: "#0a0a0a" }}
            >
              {/* Red top border line (visible on hover via CSS) */}
              <span
                className="feature-top-bar absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "transparent", transition: "background 0.2s ease" }}
                aria-hidden="true"
              />

              {/* Stat / number column */}
              <div className="flex-shrink-0 flex flex-col items-start gap-1 pt-0.5 w-14">
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "rgba(255,23,68,0.35)" }}
                  aria-hidden="true"
                >
                  {feature.glyph}
                </span>
                <span
                  className="font-mono font-bold leading-none"
                  style={{ color: "#FF1744", fontSize: "1.6rem" }}
                  aria-label={feature.stat}
                >
                  {feature.stat}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3
                  className="text-sm font-mono font-semibold mb-2"
                  style={{ color: "#f0f0f0" }}
                >
                  <span style={{ color: "#FF1744", marginRight: "0.35em" }} aria-hidden="true">►</span>
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#5a6a84" }}
                >
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Inline CSS for hover effect — scoped to feature-card */}
        <style>{`
          .feature-card:hover .feature-top-bar {
            background: #FF1744 !important;
          }
          .feature-card:hover {
            background: #0e0e0e !important;
          }
        `}</style>
      </div>
    </section>
  );
}
