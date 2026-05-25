const rows = [
  { label: "CPU",     min: "x86_64, 2-yadro",   rec: "4+ yadro" },
  { label: "RAM",     min: "2 GB",               rec: "8 GB" },
  { label: "Disk",    min: "20 GB",              rec: "50 GB" },
  { label: "ISO",     min: "~4 GB",              rec: "~4 GB" },
  { label: "Network", min: "—",                  rec: "Internet (yangilash uchun)" },
];

export default function SystemRequirements() {
  return (
    <section
      id="requirements"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: "1px solid rgba(255,23,68,0.07)" }}
      aria-labelledby="requirements-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <div
          className="text-xs font-mono uppercase tracking-widest mb-8 flex items-center gap-3"
          style={{ color: "#FF1744" }}
        >
          <span style={{ color: "rgba(255,23,68,0.4)" }} aria-hidden="true">┃</span>
          Tizim talablari
        </div>

        <h2
          id="requirements-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight mb-12"
          style={{ color: "#f0f0f0" }}
        >
          Zamonaviy kompyuter yoki virtual mashina
        </h2>

        {/* Requirements table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-3 px-5 py-3 text-xs font-mono uppercase tracking-widest"
            style={{
              background: "#0e0e0e",
              borderBottom: "1px solid rgba(255,23,68,0.08)",
              color: "#5a6a84",
            }}
          >
            <span style={{ color: "#FF1744" }}>Komponent</span>
            <span>Minimum</span>
            <span>Tavsiya</span>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-3 px-5 py-4 text-sm"
              style={{
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)",
                borderBottom:
                  i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <span
                className="font-mono text-xs font-semibold"
                style={{ color: "#FF1744" }}
              >
                {row.label}
              </span>
              <span className="font-mono text-xs" style={{ color: "#5a6a84" }}>
                {row.min}
              </span>
              <span className="font-mono text-xs" style={{ color: "#a4b1cd" }}>
                {row.rec}
              </span>
            </div>
          ))}
        </div>

        {/* VM note */}
        <div
          className="mt-5 px-4 py-3 rounded-lg flex items-start gap-3"
          style={{
            background: "rgba(255,23,68,0.03)",
            border: "1px solid rgba(255,23,68,0.08)",
          }}
          role="note"
        >
          <span
            className="font-mono text-xs flex-shrink-0 mt-0.5"
            style={{ color: "rgba(255,23,68,0.5)" }}
            aria-hidden="true"
          >
            //
          </span>
          <p className="text-sm font-mono" style={{ color: "#5a6a84" }}>
            VMware, VirtualBox yoki QEMU/KVM da ishlaydi.
            Hardware virtualizatsiya (VT-x / AMD-V) yoqilgan bo&apos;lishi kerak.
          </p>
        </div>
      </div>
    </section>
  );
}
