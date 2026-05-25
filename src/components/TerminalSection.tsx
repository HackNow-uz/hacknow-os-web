const categories = [
  { dir: "razvedka",  count: 12, tools: "nmap · masscan · dnsrecon · subfinder · amass · rustscan" },
  { dir: "web",       count: 6,  tools: "sqlmap · nikto · wfuzz · gobuster · ffuf · dirsearch" },
  { dir: "tarmoq",    count: 15, tools: "wireshark · ettercap · tcpdump · bettercap · scapy" },
  { dir: "parol",     count: 8,  tools: "john · hashcat · hydra · medusa · crunch · cewl" },
  { dir: "exploit",   count: 3,  tools: "pwntools · impacket · searchsploit" },
  { dir: "reverse",   count: 8,  tools: "gdb · binwalk · foremost · ghidra · radare2 · pwndbg" },
  { dir: "wireless",  count: 3,  tools: "aircrack-ng · reaver · wifite" },
  { dir: "forensics", count: 6,  tools: "sleuthkit · exiftool · volatility · autopsy" },
  { dir: "crypto",    count: 2,  tools: "hashid · pycryptodome" },
];

export default function TerminalSection() {
  return (
    <section
      id="tools"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: "1px solid rgba(255,23,68,0.07)" }}
      aria-labelledby="tools-heading"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section label */}
        <div
          className="text-xs font-mono uppercase tracking-widest mb-8 flex items-center gap-3"
          style={{ color: "#FF1744" }}
        >
          <span style={{ color: "rgba(255,23,68,0.4)" }} aria-hidden="true">┃</span>
          Tool kategoriyalari
        </div>

        <h2
          id="tools-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3"
          style={{ color: "#f0f0f0" }}
        >
          <span style={{ color: "#FF1744" }}>60+</span> tool,{" "}
          <span style={{ color: "#FF1744" }}>9</span> kategoriya
        </h2>
        <p
          className="text-sm mb-10 font-mono"
          style={{ color: "#5a6a84" }}
        >
          Pentesting va kiberxavfsizlik tadqiqotlari uchun asosiy toollar
        </p>

        {/* Terminal block */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "#080808",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 0 40px rgba(255,23,68,0.04)",
          }}
          role="region"
          aria-label="Tool kategoriyalari terminali"
        >
          {/* Terminal title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              background: "#111111",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <span
              className="text-xs font-mono ml-2"
              style={{ color: "#5a6a84" }}
            >
              bash — root@hacknow-os:~
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-5 sm:p-6 overflow-x-auto">
            {/* First command */}
            <div className="font-mono text-sm mb-4 whitespace-nowrap">
              <span style={{ color: "#FF1744" }}>root</span>
              <span style={{ color: "#a4b1cd" }}>@hacknow-os</span>
              <span style={{ color: "rgba(255,23,68,0.5)" }}>:</span>
              <span style={{ color: "#5a6a84" }}>~</span>
              <span style={{ color: "#FF1744" }}>#</span>
              <span style={{ color: "#f0f0f0" }}> ls -la /usr/local/categories/</span>
            </div>

            {/* Output: header row */}
            <div
              className="font-mono text-xs mb-2 pb-2"
              style={{
                color: "#3d4d60",
                borderBottom: "1px solid rgba(255,23,68,0.06)",
              }}
            >
              total {categories.length}
            </div>

            {/* Directory listing */}
            <div className="space-y-1 mb-5">
              {categories.map((cat) => (
                <div
                  key={cat.dir}
                  className="font-mono text-xs sm:text-sm grid gap-x-4"
                  style={{ gridTemplateColumns: "auto auto auto 1fr" }}
                >
                  <span style={{ color: "#3d4d60" }}>drwxr-xr-x</span>
                  <span
                    className="min-w-[80px]"
                    style={{ color: "#a4b1cd" }}
                  >
                    {cat.dir}
                  </span>
                  <span style={{ color: "#FF1744" }}>
                    {cat.count}
                  </span>
                  <span
                    className="hidden sm:block truncate"
                    style={{ color: "#3d4d60" }}
                  >
                    {cat.tools}
                  </span>
                </div>
              ))}
            </div>

            {/* Blinking cursor prompt */}
            <div className="font-mono text-sm whitespace-nowrap">
              <span style={{ color: "#FF1744" }}>root</span>
              <span style={{ color: "#a4b1cd" }}>@hacknow-os</span>
              <span style={{ color: "rgba(255,23,68,0.5)" }}>:</span>
              <span style={{ color: "#5a6a84" }}>~</span>
              <span style={{ color: "#FF1744" }}>#</span>
              <span> </span>
              <span
                className="cursor-blink inline-block"
                style={{
                  width: "0.55em",
                  height: "1em",
                  background: "#a4b1cd",
                  verticalAlign: "text-bottom",
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p
          className="mt-5 text-xs font-mono"
          style={{ color: "#3d4d60" }}
        >
          <span style={{ color: "rgba(255,23,68,0.4)" }}>#</span>{" "}
          63+ pentesting tool o&apos;rnatilgan holda keladi
        </p>
      </div>
    </section>
  );
}
