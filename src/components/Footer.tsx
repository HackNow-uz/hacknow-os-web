const currentYear = new Date().getFullYear();

const footerLinks = [
  { label: "Telegram", href: "https://t.me/hacknow_uz" },
  { label: "hacknow.uz", href: "https://hacknow.uz" },
];

export default function Footer() {
  return (
    <footer
      className="py-12 px-4 sm:px-6 lg:px-8"
      style={{ borderTop: "1px solid rgba(255,23,68,0.07)" }}
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <a
            href="/"
            className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded"
            aria-label="HackNow OS"
          >
            <span
              className="font-mono text-sm font-medium"
              style={{ color: "#f0f0f0" }}
            >
              HackNow <span style={{ color: "#FF1744" }}>OS</span>
            </span>
          </a>

          {/* Links */}
          <nav aria-label="Footer navigatsiyasi">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2" role="list">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono transition-hover hover:text-[#FF1744] focus:outline-none focus:ring-1 focus:ring-[#FF1744] focus:ring-offset-1 focus:ring-offset-[#0a0a0a] rounded"
                    style={{ color: "#5a6a84" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom row */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
          style={{ borderTop: "1px solid rgba(255,23,68,0.06)" }}
        >
          <p
            className="text-xs font-mono"
            style={{ color: "#3d4d60" }}
          >
            O&apos;zbekiston kiberxavfsizlik hamjamiyati
          </p>
          <p
            className="text-xs font-mono"
            style={{ color: "#3d4d60" }}
          >
            GPL-3.0 &middot; &copy; {currentYear} HackNow
          </p>
        </div>
      </div>
    </footer>
  );
}
