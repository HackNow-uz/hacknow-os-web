export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: "1px solid rgba(255,23,68,0.07)" }}
      aria-labelledby="about-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <div
          className="text-xs font-mono uppercase tracking-widest mb-8 flex items-center gap-3"
          style={{ color: "#FF1744" }}
        >
          <span style={{ color: "rgba(255,23,68,0.4)" }} aria-hidden="true">┃</span>
          Haqida
        </div>

        <h2
          id="about-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight mb-10"
          style={{ color: "#f0f0f0" }}
        >
          O&apos;zbekistonning birinchi pentesting distributivi
        </h2>

        <div className="space-y-5" style={{ color: "#a4b1cd", lineHeight: 1.75 }}>
          <p>
            HackNow OS — O&apos;zbekistonda yaratilgan, pentesting va kiberxavfsizlik
            tadqiqotlari uchun mo&apos;ljallangan Linux distributivi. Debian 12 Bookworm
            asosida qurilgan bo&apos;lib, XFCE 4.18 yengil desktop muhitida ishlaydi.
          </p>
          <p>
            Distributiv{" "}
            <span className="font-mono" style={{ color: "#FF1744" }}>60+</span>{" "}
            pentest tool bilan oldindan o&apos;rnatilgan holda keladi —
            razvedka, web, tarmoq, parol, exploit, reverse engineering, wireless,
            forensics va crypto sohalarini qamrab oluvchi{" "}
            <span className="font-mono" style={{ color: "#FF1744" }}>9</span>{" "}
            kategoriyada.
          </p>
          <p>
            <span className="font-mono" style={{ color: "#FF1744" }}>12</span>{" "}
            ta HackNow CLI utility (hn-recon, hn-decode, hn-hash va boshqalar)
            to&apos;g&apos;ridan-to&apos;g&apos;ri HackNow platformasi bilan integratsiya qilingan.
            Interfeys va hujjatlar o&apos;zbek tilida.
          </p>
        </div>

        {/* Red-tinted divider */}
        <div
          className="mt-12 mb-10"
          style={{ height: "1px", background: "rgba(255,23,68,0.08)" }}
          aria-hidden="true"
        />

        {/* Spec list */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
          {[
            { term: "Versiya",       def: "0.1.0-alpha",       red: true },
            { term: "Holat",         def: "Alpha — test uchun", red: false },
            { term: "Asos",          def: "Debian 12 Bookworm", red: false },
            { term: "Desktop",       def: "XFCE 4.18",          red: false },
            { term: "Arxitektura",   def: "amd64 (x86_64)",     red: false },
            { term: "Litsenziya",    def: "GPL-3.0",            red: false },
          ].map(({ term, def, red }) => (
            <div key={term}>
              <dt
                className="text-xs font-mono uppercase tracking-wide mb-1"
                style={{ color: "#5a6a84" }}
              >
                {term}
              </dt>
              <dd
                className="text-sm font-mono font-medium"
                style={{ color: red ? "#FF1744" : "#f0f0f0" }}
              >
                {def}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
