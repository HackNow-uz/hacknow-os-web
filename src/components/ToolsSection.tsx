"use client";

import { useEffect, useRef, useState } from "react";

const toolCategories = [
  {
    name: "Razvedka",
    nameEn: "RECON",
    color: "#00d4ff",
    tools: ["nmap", "subfinder", "nuclei", "amass", "masscan", "rustscan"],
  },
  {
    name: "Web",
    nameEn: "WEB PENTEST",
    color: "#FF1744",
    tools: ["sqlmap", "burpsuite", "ffuf", "gobuster", "nikto", "dirsearch"],
  },
  {
    name: "Tarmoq",
    nameEn: "NETWORK",
    color: "#00FF41",
    tools: ["wireshark", "bettercap", "tcpdump", "mitmproxy", "scapy"],
  },
  {
    name: "Parol",
    nameEn: "PASSWORD",
    color: "#F59E0B",
    tools: ["john", "hashcat", "hydra", "medusa", "crunch", "cewl"],
  },
  {
    name: "Exploit",
    nameEn: "EXPLOITATION",
    color: "#FF1744",
    tools: ["metasploit", "pwntools", "searchsploit", "beef", "impacket"],
  },
  {
    name: "Reverse",
    nameEn: "REVERSING",
    color: "#00d4ff",
    tools: ["ghidra", "gdb", "radare2", "pwndbg", "ida-free", "binwalk"],
  },
  {
    name: "Wireless",
    nameEn: "WIRELESS",
    color: "#00FF41",
    tools: ["aircrack-ng", "wifite", "reaver", "hostapd", "airgeddon"],
  },
  {
    name: "Forensics",
    nameEn: "FORENSICS",
    color: "#F59E0B",
    tools: ["autopsy", "volatility", "foremost", "steghide", "exiftool"],
  },
  {
    name: "OSINT",
    nameEn: "OSINT",
    color: "#00d4ff",
    tools: ["sherlock", "maltego", "theHarvester", "recon-ng", "spiderfoot"],
  },
  {
    name: "CTF",
    nameEn: "CTF TOOLS",
    color: "#FF1744",
    tools: ["pwntools", "CyberChef", "stegsolve", "checksec", "ROPgadget"],
  },
];

function ModuleCard({ cat, index }: { cat: typeof toolCategories[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const el = cardRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <div
      ref={cardRef}
      className="module-card rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0f0f10 0%, #111827 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`,
      }}
    >
      {/* Module header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: `linear-gradient(90deg, ${cat.color}12, transparent)`,
          borderBottom: `1px solid ${cat.color}20`,
        }}
      >
        <div>
          <div
            className="font-display font-bold text-xs tracking-widest"
            style={{ color: cat.color }}
          >
            {cat.nameEn}
          </div>
          <div
            className="font-body text-xs mt-0.5"
            style={{ color: "#5a6a84" }}
          >
            {cat.name}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              background: cat.color,
              boxShadow: `0 0 6px ${cat.color}`,
            }}
            aria-hidden="true"
          />
          <span
            className="font-code text-xs"
            style={{ color: cat.color }}
          >
            LOADED
          </span>
        </div>
      </div>

      {/* Tools list */}
      <div className="px-4 py-3">
        <ul className="space-y-1.5" aria-label={`${cat.name} tools`}>
          {cat.tools.map((tool) => (
            <li
              key={tool}
              className="flex items-center gap-2 font-code text-xs transition-colors"
              style={{ color: "#a4b1cd" }}
            >
              <span
                style={{ color: cat.color, flexShrink: 0 }}
                aria-hidden="true"
              >
                {">"}
              </span>
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ToolsSection() {
  return (
    <section
      id="tools"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      aria-labelledby="tools-heading"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(0,212,255,0.03) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 text-xs font-code uppercase tracking-widest mb-4 px-4 py-1.5 rounded"
            style={{
              color: "#00d4ff",
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            <span aria-hidden="true">$</span>
            apt list --installed | wc -l
          </div>
          <h2
            id="tools-heading"
            className="font-display font-black tracking-tight mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#f0f0f0",
              lineHeight: 1.1,
            }}
          >
            250+ Professional{" "}
            <span
              className="text-glow-cyan"
              style={{ color: "#00d4ff" }}
            >
              Toollar
            </span>
          </h2>
          <p
            className="max-w-2xl mx-auto font-body text-base sm:text-lg"
            style={{ color: "#a4b1cd" }}
          >
            Pentesting, CTF va kiberxavfsizlik tadqiqotlari uchun zarur bo&apos;lgan
            barcha toollar kategoriyalar bo&apos;yicha modullar sifatida joylashgan.
          </p>
        </div>

        {/* Module selection grid — 5 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {toolCategories.map((cat, index) => (
            <ModuleCard key={cat.name} cat={cat} index={index} />
          ))}
        </div>

        {/* Bottom count note */}
        <div className="flex items-center justify-center mt-10 gap-3">
          <div className="divider-red flex-1 max-w-xs" aria-hidden="true" />
          <p className="font-code text-sm" style={{ color: "#5a6a84" }}>
            va boshqa ko&apos;plab toollar...
          </p>
          <div className="divider-red flex-1 max-w-xs" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
