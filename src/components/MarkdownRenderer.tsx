"use client";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Renderer, Marked } from "marked";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { MEDIA_URL } from "@/constants/api";
import { emojiToIconMap } from "@/utils/emojiMap";
// Emoji shortcode → Unicode lookup (covers the most common shortcodes used in markdown)
const EMOJI_SHORTCODES: Record<string, string> = {
  rocket: "🚀", fire: "🔥", star: "⭐",
  tada: "🎉", zap: "⚡", bulb: "💡",
  warning: "⚠️", info: "ℹ️", check: "✅",
  x: "❌", book: "📚", books: "📚",
  gear: "⚙️", lock: "🔒", key: "🔑",
  shield: "🛡️", bug: "🐛", wrench: "🔧",
  hammer: "🔨", pencil: "✏️", memo: "📝",
  clipboard: "📋", link: "🔗", arrow_right: "➡️",
  arrow_left: "⬅️", arrow_up: "⬆️", arrow_down: "⬇️",
  white_check_mark: "✅", heavy_check_mark: "✔️",
  heavy_exclamation_mark: "❗", question: "❓", grey_question: "❔",
  stop_sign: "🛑", no_entry: "⛔", prohibited: "🚫",
  eyes: "👀", point_right: "👉", point_left: "👈",
  point_up: "👆", point_down: "👇",
  thumbsup: "👍", "+1": "👍",
  thumbsdown: "👎", "-1": "👎",
  clap: "👏", heart: "❤️", blue_heart: "💙",
  green_heart: "💚", yellow_heart: "💛",
  computer: "💻", desktop_computer: "🖥️",
  keyboard: "⌨️", mouse: "🖱️",
  file_folder: "📁", open_file_folder: "📂",
  page_facing_up: "📄", spiral_notepad: "🗒️",
  chart_with_upwards_trend: "📈", bar_chart: "📊",
  package: "📦", inbox_tray: "📥", outbox_tray: "📤",
  bell: "🔔", no_bell: "🔕",
  clock1: "🕐", hourglass: "⌛", stopwatch: "⏱️",
  calendar: "📅", date: "📅",
  trophy: "🏆", medal: "🏅", medal_sports: "🏅",
  dart: "🎯", target: "🎯",
  light_bulb: "💡", mag: "🔍", magnifying_glass_tilted_left: "🔍",
  satellite: "🛰️", telescope: "🔭",
  microscope: "🔬", test_tube: "🧪",
  dna: "🧬", atom: "⚛️",
  electric_plug: "🔌", battery: "🔋",
  signal_strength: "📶", wifi: "📶",
  globe_with_meridians: "🌐", earth_africa: "🌍",
  earth_americas: "🌎", earth_asia: "🌏",
  cloud: "☁️", cloud_with_lightning: "⛈️",
  sparkles: "✨", rainbow: "🌈",
  game_die: "🎲", joystick: "🕹️",
  robot: "🤖", alien: "👽",
  skull: "💀", skull_and_crossbones: "☠️",
  recycle: "♻️", infinity: "♾️",
  new: "🆕", free: "🆓", soon: "🆜",
  ok: "🆗", cool: "🆒", sos: "🆘",
  id: "🆔", ab: "🆎", cl: "🆑",
  vs: "🆚", ng: "🆖",
};

function getEmojiByShortcode(code: string): string | undefined {
  return EMOJI_SHORTCODES[code];
}

// ─── PlantUML Component ───────────────────────────────────────────────────────
const PlantUMLComponent = ({ url, code }: { url: string; code: string }) => {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    if (isZoomed) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isZoomed]);

  if (status === "error") {
    return (
      <div className="my-6 rounded-xl border border-red-500/30 bg-red-900/10 p-6">
        <div className="text-red-400 font-medium mb-3 text-center">
          ⚠️ PlantUML serverga ulanib bo&apos;lmadi
        </div>
        <pre className="text-xs text-[#8b949e] overflow-x-auto bg-[#0d1117] p-3 rounded-lg mb-3 whitespace-pre-wrap">
          {code}
        </pre>
        <div className="flex justify-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#58a6ff] text-sm hover:underline"
          >
            Brauzerda ochish ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="my-6 relative group flex justify-center plantuml-wrapper">
        {status === "loading" && (
          <div className="w-full h-32 flex items-center justify-center bg-[#161b22] rounded-lg border border-[#30363d]">
            <span className="text-[#8b949e] text-sm animate-pulse">
              PlantUML yuklanmoqda...
            </span>
          </div>
        )}
        <img
          src={url}
          alt="PlantUML Diagram"
          className={`max-w-full h-auto bg-white p-4 rounded-lg shadow-lg cursor-zoom-in transition-opacity ${status === "loading" ? "opacity-0 absolute" : "opacity-100"
            }`}
          loading="lazy"
          onLoad={() => setStatus("ok")}
          onError={() => setStatus("error")}
          onClick={() => setIsZoomed(true)}
        />
        {status === "ok" && (
          <button
            onClick={() => setIsZoomed(true)}
            className="absolute top-2 right-2 bg-[#1e3a8a] hover:bg-[#2563eb] text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-xs border border-[#60a5fa]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Kattalashtirish
          </button>
        )}
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-[95vw] max-h-[95vh] bg-white rounded-xl overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-2 right-2 z-10 bg-red-500/90 text-white w-8 h-8 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center font-bold"
            >
              ✕
            </button>
            <img
              src={url}
              alt="PlantUML Diagram"
              className="max-w-full h-auto p-6"
            />
          </div>
        </div>
      )}
    </>
  );
};

// ─── Mermaid Component ────────────────────────────────────────────────────────
const MermaidComponent = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            darkMode: true,
            background: "#0d1117",
            primaryColor: "#1e293b",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#60a5fa",
            lineColor: "#93c5fd",
            secondaryColor: "#1e3a8a",
            tertiaryColor: "#1e1e1e",
            textColor: "#ffffff",
            mainBkg: "#0d1117",
            nodeBorder: "#60a5fa",
            clusterBkg: "rgba(30, 58, 138, 0.2)",
            clusterBorder: "#60a5fa",
            defaultLinkColor: "#93c5fd",
            titleColor: "#ffffff",
            edgeLabelBackground: "#1e293b",
            actorBorder: "#60a5fa",
            actorBkg: "#1e3a8a",
            actorTextColor: "#ffffff",
            signalColor: "#ffffff",
            signalTextColor: "#ffffff",
            labelBoxBkgColor: "#1e293b",
            labelBoxBorderColor: "#60a5fa",
            labelTextColor: "#ffffff",
            loopTextColor: "#ffffff",
            noteBorderColor: "#fbbf24",
            noteBkgColor: "#1e293b",
            noteTextColor: "#fbbf24",
          },
          securityLevel: "strict",
          fontFamily: "Inter, sans-serif",
          fontSize: 16,
          flowchart: { htmlLabels: true, curve: "basis", useMaxWidth: true },
        });
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        setSvg(renderedSvg);
      } catch (err) {
        console.error("Mermaid error:", err);
        setError(err instanceof Error ? err.message : "Render error");
      }
    };
    renderMermaid();
  }, [chart]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) setIsZoomed(false);
    };
    if (isZoomed) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isZoomed]);

  // Reset zoom/pan when modal opens
  useEffect(() => {
    if (isZoomed) { setZoom(1); setPan({ x: 0, y: 0 }); }
  }, [isZoomed]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.min(Math.max(0.2, z + delta), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  };

  if (error) {
    return (
      <div className="mermaid-error">
        <strong>Mermaid render xatosi:</strong>
        <pre className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{error}</pre>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs opacity-50">
            Manba kodi
          </summary>
          <pre className="mt-1 text-xs opacity-40 text-left whitespace-pre-wrap">
            {chart}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <>
      <div className="relative group my-12">
        <div
          className="w-full h-auto flex justify-center overflow-x-auto cursor-pointer mermaid-scroll-container"
          onClick={() => setIsZoomed(true)}
        >
          <div dangerouslySetInnerHTML={{ __html: svg }} className="mermaid-inline-svg" />
        </div>
        {svg && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
            className="absolute top-2 right-2 bg-[#1e3a8a] hover:bg-[#2563eb] text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-xs border border-[#60a5fa]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Kattalashtirish
          </button>
        )}
      </div>

      {isZoomed &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md"
            style={{ zIndex: 99999 }}
            onClick={() => setIsZoomed(false)}
          >
            <div
              className="relative w-full h-full bg-[#0d1117] rounded-2xl border border-[#60a5fa]/30 flex flex-col overflow-hidden"
              style={{ maxWidth: "95vw", maxHeight: "95vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-4 py-3 flex justify-between items-center border-b border-white/10 bg-[#0d1117] z-10 shrink-0">
                <span className="text-white/60 text-sm">
                  🖱️ Sichqonchani suring · Scroll bilan kattalashtiring · ESC yopish
                </span>
                <div className="flex items-center gap-2">
                  {/* Zoom controls */}
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1 border border-white/10">
                    <button onClick={() => setZoom(z => Math.max(0.2, z - 0.2))} className="text-white/70 hover:text-white px-1.5 py-0.5 rounded text-sm font-bold transition-colors">−</button>
                    <span className="text-white/60 text-xs min-w-[3rem] text-center font-mono">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(5, z + 0.2))} className="text-white/70 hover:text-white px-1.5 py-0.5 rounded text-sm font-bold transition-colors">+</button>
                  </div>
                  <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="text-white/50 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-all border border-white/10" title="Asl holatga qaytarish">
                    Qaytarish
                  </button>
                  <button
                    onClick={() => setIsZoomed(false)}
                    className="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Pan+Zoom Canvas */}
              <div
                ref={canvasRef}
                className="flex-grow overflow-hidden"
                style={{ cursor: "grab" }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isDragging.current ? "none" : "transform 0.15s ease-out",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: svg }}
                    className="mermaid-zoom-svg"
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

// ─── Markdown Preprocessor ────────────────────────────────────────────────────

/**
 * Line-by-line fenced code block parser.
 * Correctly handles nested fences and detects Jupyter cells.
 */
function preprocessFencedBlocks(src: string): string {
  // src is already normalized to \n by preprocessMarkdown
  const lines = src.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const fenceOpen = /^(`{3,}|~{3,})([\w.{}-]*)\s*$/.exec(line);

    if (fenceOpen) {
      const fenceStr = fenceOpen[1];
      const fenceChar = fenceStr[0];
      const fenceLen = fenceStr.length;
      const rawLang = (fenceOpen[2] || "").trim();

      const codeLines: string[] = [];
      let foundClosing = false;
      let j = i + 1;

      while (j < lines.length) {
        const closeMatch = /^(`{3,}|~{3,})\s*$/.exec(lines[j]);
        if (
          closeMatch &&
          closeMatch[1][0] === fenceChar &&
          closeMatch[1].length >= fenceLen
        ) {
          foundClosing = true;
          break;
        }
        codeLines.push(lines[j]);
        j++;
      }

      if (foundClosing) {
        const code = codeLines.join("\n");
        const trimmed = code.trim();

        // Detect Jupyter: {code-cell} or heuristic markers
        const isJupyterLang = rawLang === "{code-cell}" || rawLang.startsWith("{code-cell}");
        const isJupyterContent = rawLang !== "jupyter" && (trimmed.match(/^#\s*Jupyter/i) !== null || trimmed.includes("ipywidgets") || trimmed.includes("interact("));
        const isPumlAlias = rawLang === "puml" || rawLang === "plantuml"; // added plantuml just in case

        let openingFence: string;
        if (isJupyterLang || isJupyterContent) openingFence = "```jupyter";
        else if (isPumlAlias) openingFence = "```plantuml";
        else openingFence = `\`\`\`${rawLang}`;

        out.push(openingFence);
        out.push(...codeLines);
        out.push("```");
        i = j + 1;
      } else {
        out.push(line);
        i++;
      }
    } else {
      out.push(line);
      i++;
    }
  }

  return out.join("\n");
}

function fixMermaidSyntax(mermaidCode: string): string {
  if (!mermaidCode) return "";
  const lines = mermaidCode.trim().split("\n");
  if (lines.length === 0) return "";

  const fixedLines: string[] = [];
  
  // 1. Enforce flowchart over graph
  let firstLine = lines[0].trim();
  if (firstLine.startsWith("graph ")) {
    firstLine = firstLine.replace("graph ", "flowchart ");
  }
  fixedLines.push(firstLine);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("%%")) {
      fixedLines.push(line);
      continue;
    }

    let fixedLine = line;

    // Subgraph quoting only
    if (fixedLine.includes("subgraph")) {
      fixedLine = fixedLine.replace(/(\s*subgraph\s+)(?!")(.+)/g, (match, prefix, namePart) => {
        const trimmedName = namePart.trim();
        if (!(trimmedName.startsWith('"') && trimmedName.endsWith('"')) && !trimmedName.includes("[") && !trimmedName.includes("(")) {
          return `${prefix}"${trimmedName.replace(/"/g, "'")}"`;
        }
        return match;
      });
    }

    fixedLines.push(fixedLine);
  }

  return fixedLines.join("\n");
}

function preprocessBareMermaid(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];
  let i = 0;

  const mermaidKeywords = [
    "graph",
    "flowchart",
    "sequenceDiagram",
    "classDiagram",
    "stateDiagram",
    "erDiagram",
    "pie",
    "gantt",
    "journey",
    "gitGraph",
    "mindmap",
    "timeline",
  ];

  let inCodeBlock = false;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      out.push(line);
      i++;
      continue;
    }

    if (
      !inCodeBlock &&
      mermaidKeywords.some((kw) => trimmed.startsWith(kw + " ") || trimmed === kw)
    ) {
      // Potential bare mermaid
      const mermaidLines = [line];
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        if (
          nextLine.trim() === "" ||
          nextLine.trim().startsWith("#") ||
          nextLine.trim().startsWith("```")
        ) {
          break;
        }
        mermaidLines.push(nextLine);
        j++;
      }

      if (mermaidLines.length > 1 || trimmed.startsWith("pie")) {
        const code = mermaidLines.join("\n");
        const fixedCode = fixMermaidSyntax(code);
        out.push("```mermaid");
        out.push(fixedCode);
        out.push("```");
        i = j;
        continue;
      }
    }

    out.push(line);
    i++;
  }
  return out.join("\n");
}

function preprocessMarkdown(markdown: string): string {
  if (!markdown) return "";
  // Uniform line endings (handle \r\n from Windows) and remove trailing whitespace at end of lines
  let processed = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 1. PlantUML: bare @startuml...@enduml → fenced plantuml code blocks
  processed = processed.replace(
    /@start(uml|puml|json|mindmap|gantt|yaml|wbs|chronology|ditaa|ery)[\s\S]*?@end\1/gi,
    (match) => `\n\n\`\`\`plantuml\n${match.trim()}\n\`\`\`\n\n`
  );

  // 2. Mermaid: detect bare mermaid diagrams (graph TD, flowchart, etc.)
  processed = preprocessBareMermaid(processed);

  // 3. Mermaid: fix syntax for ALREADY fenced mermaid blocks (non-indented only — indented ones belong to tab content)
  processed = processed.replace(
    /^```mermaid\s*\n([\s\S]*?)\n```/gim,
    (match, code) => `\n\n\`\`\`mermaid\n${fixMermaidSyntax(code)}\n\`\`\`\n\n`
  );

  // 4. Fenced code blocks: detect Jupyter, puml alias (line-by-line, handles nesting)
  processed = preprocessFencedBlocks(processed);

  // 3. HTML <details>/<summary> → MkDocs collapsible admonitions
  processed = processed.replace(
    /^([ \t]*)<details>\s*<summary>(.*?)<\/summary>\s*([\s\S]*?)<\/details>/gim,
    (_match: string, indent: string, title: string, content: string) => {
      const indentedContent = content
        .trim()
        .split("\n")
        .map((line: string) => indent + "    " + line.trimStart())
        .join("\n");
      return `${indent}??? note "${title}"\n${indentedContent}\n`;
    }
  );

  // 4. GitHub + Obsidian admonitions: > [!TYPE] → !!! type
  // Obsidian Callouts qo'llaydigan barcha turlari ham bu yerda — quote/cite,
  // hint, failure/error, check, attention va h.k.
  // Manba: https://help.obsidian.md/Editing+and+formatting/Callouts
  processed = processed.replace(
    /^>\s*\[!([A-Za-z][A-Za-z0-9-]*)\]\s*\n((?:>\s*.*(?:\n|$))+)/gim,
    (_m: string, t: string, c: string) => {
      const clean = c
        .split("\n")
        .map((l: string) => "    " + l.replace(/^>\s*/, ""))
        .join("\n");
      // Obsidian + GitHub callout aliaslari -> ichki turga moslashtiruv
      const typeMap: Record<string, string> = {
        // GitHub
        NOTE: "note",
        TIP: "tip",
        WARNING: "warning",
        IMPORTANT: "important",
        CAUTION: "caution",
        // Bu yerdan boshlab Obsidian-only
        DANGER: "danger",
        INFO: "info",
        SUCCESS: "success",
        CHECK: "success",
        DONE: "success",
        BUG: "bug",
        EXAMPLE: "example",
        QUESTION: "question",
        HELP: "question",
        FAQ: "question",
        ABSTRACT: "abstract",
        SUMMARY: "abstract",
        TLDR: "abstract",
        SEEALSO: "seealso",
        TODO: "todo",
        QUOTE: "quote",
        CITE: "quote",
        HINT: "tip",
        ATTENTION: "warning",
        FAILURE: "danger",
        FAIL: "danger",
        MISSING: "danger",
        ERROR: "danger",
      };
      const upper = t.toUpperCase();
      const mapped = typeMap[upper];
      // Noma'lum tur — original turni saqlaymiz, ammo CSS class fallback bilan
      const finalType = mapped ?? upper.toLowerCase();
      return `!!! ${finalType}\n${clean}\n`;
    }
  );

  // 5. YouTube/Video URLs: standalone YouTube/Vimeo links → embed placeholders
  processed = processed.replace(
    /^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(?:[^\s]*))$/gim,
    (_m: string, _url: string, videoId: string) => {
      return `<div class="md-video-embed" data-video-id="${videoId}" data-provider="youtube"></div>`;
    }
  );
  processed = processed.replace(
    /^(https?:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:[^\s]*))$/gim,
    (_m: string, _url: string, videoId: string) => {
      return `<div class="md-video-embed" data-video-id="${videoId}" data-provider="vimeo"></div>`;
    }
  );

  // 6. Tabbed content: === "Tab Title" blocks → HTML tabs
  processed = preprocessTabs(processed);

  // 7. Definition lists: Term\n: Definition
  processed = preprocessDefinitionLists(processed);

  // 8. Footnotes: [^id]: definition at bottom, [^id] inline reference
  processed = preprocessFootnotes(processed);

  // 9. Abbreviations: *[ABBR]: Full Text → <abbr> tooltip
  processed = preprocessAbbreviations(processed);

  return processed;
}

// ─── Tab Preprocessor ───────────────────────────────────────────────────────
// Converts === "Tab Title" blocks into plain markdown sections with HTML markers.
// Tab content passes through the main marked pipeline — no separate rendering needed.
function preprocessTabs(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const tabMatch = /^===\s+"(.+?)"\s*$/.exec(lines[i]);
    if (tabMatch) {
      const tabs: { title: string; content: string[] }[] = [];
      while (i < lines.length) {
        const tm = /^===\s+"(.+?)"\s*$/.exec(lines[i]);
        if (!tm) break;
        const title = tm[1];
        const contentLines: string[] = [];
        i++;
        // Skip empty line after tab header
        if (i < lines.length && lines[i].trim() === "") i++;
        // Collect indented content
        while (i < lines.length) {
          if (/^===\s+"/.test(lines[i])) break;
          if (lines[i].startsWith("    ") || lines[i].startsWith("\t")) {
            contentLines.push(lines[i].replace(/^(?:    |\t)/, ""));
          } else if (lines[i].trim() === "") {
            contentLines.push("");
          } else {
            break;
          }
          i++;
        }
        tabs.push({ title, content: contentLines });
      }
      if (tabs.length > 0) {
        const tabId = `tab-${Math.random().toString(36).substr(2, 6)}`;
        // Build nav buttons
        let html = `<div class="md-tabs" data-tab-group="${tabId}">`;
        html += `<div class="md-tabs-nav">`;
        tabs.forEach((tab, idx) => {
          html += `<button class="md-tab-btn${idx === 0 ? ' active' : ''}" data-tab-target="${tabId}-${idx}">${tab.title}</button>`;
        });
        html += `</div>`;
        html += `<div class="md-tabs-content">`;
        html += `</div></div>`;
        out.push(html);
        // Emit each tab's content as normal markdown wrapped in panel divs
        // These will be parsed by marked as regular content
        tabs.forEach((tab, idx) => {
          out.push("");
          out.push(`<div class="md-tab-panel${idx === 0 ? ' active' : ''}" data-tab-panel="${tabId}-${idx}">`);
          out.push("");
          tab.content.forEach(line => out.push(line));
          out.push("");
          out.push('<div class="md-tab-footer-nav">');
          if (idx > 0) {
            out.push(`<button class="md-tab-footer-btn md-tab-prev" data-tab-target="${tabId}-${idx - 1}">← Ortga</button>`);
          } else {
            out.push("<div></div>");
          }
          if (idx < tabs.length - 1) {
            out.push(`<button class="md-tab-footer-btn md-tab-next" data-tab-target="${tabId}-${idx + 1}">Keyingisi →</button>`);
          } else {
            out.push("<div></div>");
          }
          out.push("</div>");
          out.push(`</div>`);
          out.push("");
        });
      }
    } else {
      out.push(lines[i]);
      i++;
    }
  }
  return out.join("\n");
}

// ─── Definition List Preprocessor ───────────────────────────────────────────
function preprocessDefinitionLists(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    // Check for definition list pattern: non-empty line followed by : definition
    if (
      i + 1 < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith(" ") &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("-") &&
      !lines[i].startsWith("*") &&
      /^:\s+/.test(lines[i + 1])
    ) {
      let dlHtml = '<dl class="md-dl">';
      while (i < lines.length) {
        // Term line
        if (
          lines[i].trim() !== "" &&
          !lines[i].startsWith(" ") &&
          !lines[i].startsWith(':') &&
          i + 1 < lines.length &&
          /^:\s+/.test(lines[i + 1])
        ) {
          dlHtml += `<dt>${lines[i].trim()}</dt>`;
          i++;
          // Collect all definitions for this term
          while (i < lines.length && /^:\s+/.test(lines[i])) {
            dlHtml += `<dd>${lines[i].replace(/^:\s+/, "")}</dd>`;
            i++;
          }
          // Skip blank lines between dl entries (but peek ahead — only skip if next is another term)
          let blankCount = 0;
          while (i < lines.length && lines[i].trim() === "") { i++; blankCount++; }
          // If next line is NOT a term+definition pair, put back the blank separator
          if (
            blankCount > 0 &&
            !(i < lines.length && i + 1 < lines.length &&
              lines[i].trim() !== "" && !lines[i].startsWith(" ") &&
              !lines[i].startsWith(':') && /^:\s+/.test(lines[i + 1]))
          ) {
            // Not a continuation — rewind so the blank line separates DL from next block
            break;
          }
        } else {
          break;
        }
      }
      dlHtml += '</dl>';
      out.push(dlHtml);
      // Ensure blank line after DL for proper block separation
      out.push('');
    } else {
      out.push(lines[i]);
      i++;
    }
  }
  return out.join("\n");
}

// ─── Footnote Preprocessor ──────────────────────────────────────────────────
function preprocessFootnotes(src: string): string {
  // Collect footnote definitions: [^id]: content
  const defRegex = /^\[\^([^\]]+)\]:\s*(.+)$/gm;
  const footnotes: Record<string, string> = {};
  let match;
  while ((match = defRegex.exec(src)) !== null) {
    footnotes[match[1]] = match[2];
  }
  if (Object.keys(footnotes).length === 0) return src;

  // Remove definitions from source
  let processed = src.replace(/^\[\^([^\]]+)\]:\s*.+$/gm, "");

  // Replace inline references [^id] with superscript links
  let fnIndex = 0;
  const usedFootnotes: { id: string; text: string; index: number }[] = [];
  processed = processed.replace(/\[\^([^\]]+)\]/g, (_m, id) => {
    if (footnotes[id]) {
      fnIndex++;
      usedFootnotes.push({ id, text: footnotes[id], index: fnIndex });
      return `<sup class="md-footnote-ref"><a href="#fn-${id}" id="fnref-${id}" title="${footnotes[id].replace(/"/g, '&quot;')}">[${fnIndex}]</a></sup>`;
    }
    return `[^${id}]`;
  });

  // Append footnotes section
  if (usedFootnotes.length > 0) {
    processed += '\n\n<section class="md-footnotes"><hr class="md-footnotes-sep" /><ol class="md-footnotes-list">';
    for (const fn of usedFootnotes) {
      processed += `<li id="fn-${fn.id}" class="md-footnote-item"><span class="md-footnote-text">${fn.text}</span> <a href="#fnref-${fn.id}" class="md-footnote-backref" title="Qaytish">↩</a></li>`;
    }
    processed += '</ol></section>';
  }

  return processed;
}

// ─── Abbreviation Preprocessor ──────────────────────────────────────────────
function preprocessAbbreviations(src: string): string {
  // Collect abbreviation definitions: *[ABBR]: Full Text
  const abbrRegex = /^\*\[([^\]]+)\]:\s*(.+)$/gm;
  const abbreviations: { abbr: string; full: string }[] = [];
  let match;
  while ((match = abbrRegex.exec(src)) !== null) {
    abbreviations.push({ abbr: match[1], full: match[2] });
  }
  if (abbreviations.length === 0) return src;

  // Remove abbreviation definitions
  let processed = src.replace(/^\*\[([^\]]+)\]:\s*.+$/gm, "");

  // Protect code blocks and inline code from abbreviation replacement:
  // 1. Extract fenced code blocks (```...```) and inline code (`...`)
  // 2. Replace abbreviations only in prose text
  // 3. Restore code blocks
  const placeholders: string[] = [];
  const placeholderPrefix = '\x00CODEBLOCK_';

  // Protect fenced code blocks (``` or ~~~)
  processed = processed.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1\s*$/gm, (block) => {
    const idx = placeholders.length;
    placeholders.push(block);
    return `${placeholderPrefix}${idx}\x00`;
  });

  // Protect inline code (`...`)
  processed = processed.replace(/`[^`\n]+`/g, (code) => {
    const idx = placeholders.length;
    placeholders.push(code);
    return `${placeholderPrefix}${idx}\x00`;
  });

  // Now replace occurrences with <abbr> tags (only in prose text)
  for (const { abbr, full } of abbreviations) {
    const escaped = abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    processed = processed.replace(
      new RegExp(`\\b(${escaped})\\b`, 'g'),
      `<abbr title="${full.replace(/"/g, '&quot;')}" class="md-abbr">${abbr}</abbr>`
    );
  }

  // Restore code blocks
  for (let i = 0; i < placeholders.length; i++) {
    processed = processed.replace(`${placeholderPrefix}${i}\x00`, placeholders[i]);
  }

  return processed;
}

// ─── Main Renderer ────────────────────────────────────────────────────────────
export type MarkdownVariant = 'article' | 'challenge' | 'lesson';

const MarkdownRenderer = ({
  content,
  className = "",
  variant,
}: {
  content: string;
  className?: string;
  variant?: MarkdownVariant;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("");
  const rootsRef = useRef<{ unmount: () => void }[]>([]);

  // Check if this is Polygon HTML content (prefixed by backend)
  const isPolygonHtml = content?.startsWith('__HTML_CONTENT__');
  const rawPolygonHtml = isPolygonHtml ? content.slice('__HTML_CONTENT__'.length) : null;

  // Pre-process Polygon HTML: render $...$ math with KaTeX BEFORE setting innerHTML
  // This avoids layout shifts from post-render DOM manipulation
  const [polygonHtmlContent, setPolygonHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    if (!isPolygonHtml || !rawPolygonHtml) return;

    const processHtml = async () => {
      const [katex, { default: DOMPurify }] = await Promise.all([
        import('katex').then(m => m.default),
        import('dompurify'),
      ]);

      // Sanitize raw polygon HTML before processing math
      const sanitizedRaw = DOMPurify.sanitize(rawPolygonHtml, {
        ALLOW_DATA_ATTR: false,
        ADD_TAGS: ['math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'munder', 'mover', 'munderover', 'msubsup', 'mtable', 'mtr', 'mtd', 'annotation'],
        ADD_ATTR: ['mathvariant', 'mathsize', 'displaystyle', 'encoding'],
      });

      // Replace math in HTML string. We must skip content inside HTML tags (attributes etc.)
      // Strategy: split on HTML tags, process only text segments
      const processText = (text: string): string => {
        if (!text.includes('$')) return text;
        return text
          .replace(/\$\$([\s\S]+?)\$\$/g, (_m, math) => {
            try { return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false, trust: true }); }
            catch { return _m; }
          })
          .replace(/\$([^$\n]+?)\$/g, (_m, math) => {
            try { return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false, trust: true }); }
            catch { return _m; }
          });
      };

      // Split HTML into tag and text segments, only process text segments
      const processed = sanitizedRaw.replace(
        /(<[^>]*>)|([^<]+)/g,
        (match, tag, text) => {
          if (tag) return tag; // HTML tag — leave untouched
          if (text) return processText(text); // Text node — process math
          return match;
        }
      );

      setPolygonHtmlContent(processed);
    };

    processHtml();
  }, [isPolygonHtml, rawPolygonHtml]);

  useEffect(() => {
    // If this is Polygon HTML, skip the Markdown pipeline entirely
    if (isPolygonHtml) return;

    let isMounted = true;

    const loadAndParse = async () => {
      const [katex, hljs, plantumlEncoder, { default: DOMPurify }] =
        await Promise.all([
          import("katex"),
          import("highlight.js"),
          import("plantuml-encoder"),
          import("dompurify"),
        ]);

      if (!isMounted) return;

      // Shared reference — allows admonition renderer to use the full parser
      let localMarked: Marked;
      // Recursion depth guard for admonition rendering
      let admonitionDepth = 0;

      // ── Block Math: $$...$$ (standalone block) ───────────────────────────
      const mathBlockExtension: any = {
        name: "mathBlock",
        level: "block" as const,
        start(src: string) {
          const idx = src.indexOf("$$");
          return idx !== -1 ? idx : undefined;
        },
        tokenizer(src: string) {
          const match = /^\$\$([\s\S]*?)\$\$/.exec(src);
          if (match) {
            return { type: "mathBlock", raw: match[0], text: match[1].trim() };
          }
        },
        renderer(token: any) {
          try {
            const rendered = katex.default.renderToString(token.text, {
              displayMode: true,
              throwOnError: false,
              trust: true,
            });
            return `<div class="math-display">${rendered}</div>`;
          } catch {
            return `<pre class="math-error">${token.raw}</pre>`;
          }
        },
      };

      // ── Inline Math: $...$ and $$...$$ inside paragraphs ────────────────
      const mathInlineExtension: any = {
        name: "mathInline",
        level: "inline" as const,
        start(src: string) {
          const idx = src.indexOf("$");
          return idx !== -1 ? idx : undefined;
        },
        tokenizer(src: string) {
          // $$...$$ as display math (inline context, e.g. inside a paragraph)
          const displayMatch = /^\$\$((?:[^\$]|\$(?!\$))+?)\$\$/.exec(src);
          if (displayMatch) {
            return {
              type: "mathInline",
              raw: displayMatch[0],
              text: displayMatch[1].trim(),
              displayMode: true,
            };
          }
          // $...$ inline math — requires non-empty content, no bare $
          const inlineMatch =
            /^\$(?!\$)((?:[^\$\n\\]|\\[\s\S])+?)\$/.exec(src);
          if (inlineMatch) {
            return {
              type: "mathInline",
              raw: inlineMatch[0],
              text: inlineMatch[1].trim(),
              displayMode: false,
            };
          }
        },
        renderer(token: any) {
          try {
            return katex.default.renderToString(token.text, {
              displayMode: token.displayMode ?? false,
              throwOnError: false,
              trust: true,
            });
          } catch {
            return token.raw;
          }
        },
      };

      // ── Icon Extension: :icon-name: ──────────────────────────────────────
      const iconExtension: any = {
        name: "icon",
        level: "inline" as const,
        start(src: string) {
          return src.match(/:icon-/)?.index;
        },
        tokenizer(src: string) {
          const match = /^:icon-([a-zA-Z0-9_-]+):/.exec(src);
          if (match) {
            return { type: "icon", raw: match[0], iconName: match[1] };
          }
        },
        renderer(token: any) {
          const iconName = (token.iconName as string).replace(/-/g, "_");
          return `<span class="material-symbols-outlined inline-icon">${iconName}</span>`;
        },
      };

      // ── Badge Extension ({badge:text} or {badge:text:color}) ────────────
      const badgeExtension: any = {
        name: "badge",
        level: "inline" as const,
        start(src: string) { return src.indexOf("{badge:"); },
        tokenizer(src: string) {
          const match = /^\{badge:([^}:]+)(?::([^}]+))?\}/.exec(src);
          if (match) return { type: "badge", raw: match[0], text: match[1], color: match[2] || '' };
        },
        renderer(token: any) {
          const colorMap: Record<string, string> = {
            red: 'md-badge-red', blue: 'md-badge-blue', green: 'md-badge-green',
            yellow: 'md-badge-yellow', purple: 'md-badge-purple', orange: 'md-badge-orange',
            cyan: 'md-badge-cyan', pink: 'md-badge-pink',
          };
          const cls = colorMap[token.color] || 'md-badge-default';
          return `<span class="md-badge ${cls}">${token.text}</span>`;
        }
      };

      // ── Pill Extension ({pill:text} or {pill:text:color}) ──────────────
      const pillExtension: any = {
        name: "pill",
        level: "inline" as const,
        start(src: string) { return src.indexOf("{pill:"); },
        tokenizer(src: string) {
          const match = /^\{pill:([^}:]+)(?::([^}]+))?\}/.exec(src);
          if (match) return { type: "pill", raw: match[0], text: match[1], color: match[2] || '' };
        },
        renderer(token: any) {
          const colorMap: Record<string, string> = {
            red: 'md-pill-red', blue: 'md-pill-blue', green: 'md-pill-green',
            yellow: 'md-pill-yellow', purple: 'md-pill-purple', orange: 'md-pill-orange',
            cyan: 'md-pill-cyan', pink: 'md-pill-pink',
          };
          const cls = colorMap[token.color] || 'md-pill-default';
          return `<span class="md-pill ${cls}">${token.text}</span>`;
        }
      };

      // ── Subscript Extension (~text~) ─────────────────────────────────────
      const subExtension: any = {
        name: "sub",
        level: "inline",
        start(src: string) { return src.indexOf("~"); },
        tokenizer(src: string) {
          const match = /^~([^~\s](?:[^~]*[^~\s])?)~/.exec(src);
          if (match) return { type: "sub", raw: match[0], text: match[1] };
        },
        renderer(token: any) { return `<sub>${token.text}</sub>`; }
      };

      // ── Superscript Extension (^text^) ───────────────────────────────────
      const supExtension: any = {
        name: "sup",
        level: "inline" as const,
        start(src: string) { return src.indexOf("^"); },
        tokenizer(src: string) {
          const match = /^\^([^\^\s](?:[^\^]*[^\^\s])?)\^/.exec(src);
          if (match) return { type: "sup", raw: match[0], text: match[1] };
        },
        renderer(token: any) { return `<sup>${token.text}</sup>`; }
      };

      // ── Highlight/Mark Extension (==text==) ──────────────────────────────
      const markExtension: any = {
        name: "mark",
        level: "inline" as const,
        start(src: string) { return src.indexOf("=="); },
        tokenizer(src: string) {
          const match = /^==([^==\s](?:[^=]*[^==\s])?)==/.exec(src);
          if (match) return { type: "mark", raw: match[0], text: match[1] };
        },
        renderer(token: any) { return `<mark>${token.text}</mark>`; }
      };

      // ── Insert Extension (++text++) ──────────────────────────────────────
      const insExtension: any = {
        name: "ins",
        level: "inline" as const,
        start(src: string) { return src.indexOf("++"); },
        tokenizer(src: string) {
          const match = /^\+\+([^\+\+\s](?:[^\+]*[^\+\+\s])?)\+\+/.exec(src);
          if (match) return { type: "ins", raw: match[0], text: match[1] };
        },
        renderer(token: any) { return `<ins>${token.text}</ins>`; }
      };

      // ── KBD Extension ([[text]]) ─────────────────────────────────────────
      const kbdExtension: any = {
        name: "kbd",
        level: "inline" as const,
        start(src: string) { return src.indexOf("[["); },
        tokenizer(src: string) {
          const match = /^\[\[([^\[\]]+)\]\]/.exec(src);
          if (match) return { type: "kbd", raw: match[0], text: match[1] };
        },
        renderer(token: any) { return `<kbd class="md-kbd">${token.text}</kbd>`; }
      };

      // ── Emoji → Google Material Icon (with Twemoji SVG fallback) ────────
      const TWEMOJI_BASE = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg";
      function emojiToTwemojiUrl(emoji: string): string {
        const codepoints = [...emoji]
          .map((c) => c.codePointAt(0))
          .filter((cp): cp is number => cp !== undefined && cp !== 0xfe0f)
          .map((cp) => cp.toString(16))
          .join("-");
        return `${TWEMOJI_BASE}/${codepoints}.svg`;
      }
      function emojiToRenderedTag(emoji: string, label?: string, title?: string): string {
        // Try Google Material Icon first
        const iconName = emojiToIconMap[emoji];
        if (iconName) {
          const titleAttr = title ? ` title="${title}"` : "";
          return `<span class="emoji-icon"${titleAttr}><span class="material-symbols-outlined">${iconName}</span></span>`;
        }
        // Fallback to Twemoji SVG
        const url = emojiToTwemojiUrl(emoji);
        const alt = label || emoji;
        const titleAttr = title ? ` title="${title}"` : "";
        return `<img class="twemoji" src="${url}" alt="${alt}"${titleAttr} draggable="false" />`;
      }

      // ── Emoji Shortcode Extension (:rocket:, :shield:, etc.) ────────────
      const emojiShortcodeExtension: any = {
        name: "emojiShortcode",
        level: "inline" as const,
        start(src: string) {
          return src.indexOf(":");
        },
        tokenizer(src: string) {
          // Match :shortcode: pattern (but not inside URLs like https://...)
          const match = /^:([a-zA-Z0-9_+-]+):/.exec(src);
          if (match) {
            const code = match[1];
            const emoji = getEmojiByShortcode(code);
            if (emoji) {
              return { type: "emojiShortcode", raw: match[0], emoji, code };
            }
          }
        },
        renderer(token: any) {
          return emojiToRenderedTag(token.emoji, token.code, `:${token.code}:`);
        },
      };

      // ── Unicode Emoji Extension (render emojis as Twemoji SVG icons) ──
      const emojiExtension: any = {
        name: "emoji",
        level: "inline" as const,
        start(src: string) {
          const match = src.match(
            /[\u{1F1E0}-\u{1F1FF}]|\p{Extended_Pictographic}/u
          );
          return match?.index;
        },
        tokenizer(src: string) {
          const match =
            /^(?:[\u{1F1E0}-\u{1F1FF}]{2}|\d\uFE0F\u20E3|[#*]\uFE0F\u20E3|\p{Extended_Pictographic}(?:\uFE0F)?(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u200D(?:\p{Extended_Pictographic}|\p{Emoji_Component})(?:\uFE0F)?(?:[\u{1F3FB}-\u{1F3FF}])?)*)/u.exec(
              src
            );
          if (match) {
            return { type: "emoji", raw: match[0], emoji: match[0] };
          }
        },
        renderer(token: any) {
          return emojiToRenderedTag(token.emoji);
        },
      };

      // ── Admonition Extension (MkDocs: !!! type / ??? type) ───────────────
      const admonitionExtension: any = {
        name: "admonition",
        level: "block" as const,
        start(src: string) {
          return src.match(/^(?:!!!|\?\?\?)/m)?.index;
        },
        tokenizer(src: string) {
          const headerMatch =
            /^(!!!|\?\?\?)\s+([a-zA-Z0-9_-]+)(?: "(.*?)")?\s*\n/.exec(src);
          if (!headerMatch) return;

          const rawHeader = headerMatch[0];
          const marker = headerMatch[1];
          const type = headerMatch[2].toLowerCase();
          const title = headerMatch[3] ?? "";
          const rest = src.substring(rawHeader.length);
          const lines = rest.split("\n");

          // Auto-detect indentation from first indented line (supports 2, 4, 8 spaces or tabs)
          let detectedIndent = "    "; // default 4 spaces
          for (const ln of lines) {
            const m = /^(\s+)/.exec(ln);
            if (m) {
              detectedIndent = m[1];
              break;
            }
          }

          let body = "";
          let rawBody = "";

          for (let i = 0; i < lines.length; i++) {
            const ln = lines[i];
            if (ln.startsWith(detectedIndent)) {
              body += ln.slice(detectedIndent.length) + "\n";
              rawBody += ln + "\n";
            } else if (ln.trim() === "" && i < lines.length - 1) {
              const next = lines[i + 1];
              if (next.startsWith(detectedIndent) || next.trim() === "") {
                body += "\n";
                rawBody += ln + "\n";
              } else break;
            } else break;
          }

          return {
            type: "admonition",
            raw: rawHeader + rawBody,
            admonitionType: type,
            title,
            text: body.trim(),
            foldable: marker === "???",
          };
        },
        renderer(token: any) {
          const icons: Record<string, string> = {
            note: "info",
            info: "info",
            tip: "lightbulb",
            hint: "lightbulb",
            important: "priority_high",
            warning: "warning",
            caution: "warning",
            attention: "warning",
            danger: "dangerous",
            error: "error",
            failure: "cancel",
            fail: "cancel",
            missing: "cancel",
            success: "check_circle",
            check: "check_circle",
            done: "check_circle",
            question: "help",
            help: "help",
            faq: "help",
            quote: "format_quote",
            cite: "format_quote",
            example: "code_blocks",
            bug: "bug_report",
            abstract: "article",
            tldr: "article",
            summary: "article",
            seealso: "link",
            deprecated: "do_not_disturb",
            todo: "task_alt",
          };

          const type: string = token.admonitionType || "note";
          const icon = icons[type] ?? "info";
          const title =
            (token.title as string) ||
            type.charAt(0).toUpperCase() + type.slice(1);

          // Parse admonition body — use recursion depth guard to prevent stack overflow
          let parsedContent = token.text as string;
          if (localMarked && admonitionDepth < 3) {
            admonitionDepth++;
            try {
              parsedContent = localMarked.parse(token.text) as string;
            } catch (e) {
              console.warn('[MarkdownRenderer] Admonition parse error:', e);
              parsedContent = token.text;
            } finally {
              admonitionDepth--;
            }
          }

          if (token.foldable) {
            return `<details class="admonition ${type} group"><summary class="admonition-title cursor-pointer list-none"><span class="material-symbols-outlined">${icon}</span><span class="flex-1">${title}</span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-50 transform transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></summary><div class="admonition-content">${parsedContent}</div></details>`;
          }
          return `<div class="admonition ${type}"><div class="admonition-title"><span class="material-symbols-outlined">${icon}</span>${title}</div><div class="admonition-content">${parsedContent}</div></div>`;
        },
      };

      // ── Custom Code Renderer ─────────────────────────────────────────────
      const htmlEscMap: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;",
      };
      const escHtml = (s: string) =>
        s.replace(/[<>&"']/g, (c: string) => htmlEscMap[c] ?? c);

      // ── Slugify for heading anchors ────────────────────────────────────
      const slugify = (text: string) =>
        text
          .toLowerCase()
          .replace(/<[^>]*>/g, '')
          .replace(/&[^;]+;/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

      // ── Language icons map (Twemoji SVG'ga aylantiriladi — consistent style) ──
      const langIcons: Record<string, string> = {
        python: '🐍', py: '🐍',
        javascript: '📜', js: '📜', typescript: '📘', ts: '📘',
        html: '🌐', css: '🎨', scss: '🎨', sass: '🎨', less: '🎨',
        java: '☕', kotlin: '🟣', swift: '🦅', go: '🐹', golang: '🐹',
        rust: '🦀', c: '⚙️', cpp: '⚙️', 'c++': '⚙️', csharp: '🟢', 'c#': '🟢',
        ruby: '💎', php: '🐘', perl: '🐪', r: '📊',
        bash: '🖥️', sh: '🖥️', zsh: '🖥️', fish: '🐟', shell: '🖥️', powershell: '🖥️',
        sql: '🗄️', mysql: '🐬', postgresql: '🐘', sqlite: '📦',
        docker: '🐳', dockerfile: '🐳', yaml: '📄', yml: '📄', toml: '📄',
        json: '📋', xml: '📄', markdown: '📝', md: '📝',
        nginx: '🌐', apache: '🪶', makefile: '🔨', cmake: '🔨',
        git: '🌿', graphql: '🔮', proto: '📋', terraform: '🌱', tf: '🌱',
        lua: '🌙', vue: '💚', react: '⚛️', jsx: '⚛️', tsx: '⚛️', svelte: '🔥',
      };

      // ── Parse code fence meta: title, line highlights ─────────────────
      function parseCodeMeta(rawLang: string): { lang: string; title: string; highlights: Set<number> } {
        let lang = rawLang.toLowerCase().trim();
        let title = '';
        const highlights = new Set<number>();

        // Extract title="..." or title='...'
        const titleMatch = /title\s*=\s*["']([^"']+)["']/i.exec(lang);
        if (titleMatch) {
          title = titleMatch[1];
          lang = lang.replace(titleMatch[0], '').trim();
        }

        // Extract {1,3-5,8}
        const hlMatch = /\{([\d,\s-]+)\}/i.exec(lang);
        if (hlMatch) {
          const parts = hlMatch[1].split(',');
          for (const part of parts) {
            const range = part.trim().split('-');
            if (range.length === 2) {
              const start = parseInt(range[0], 10);
              const end = parseInt(range[1], 10);
              for (let i = start; i <= end; i++) highlights.add(i);
            } else {
              highlights.add(parseInt(range[0], 10));
            }
          }
          lang = lang.replace(hlMatch[0], '').trim();
        }

        return { lang, title, highlights };
      }

      // ── Recursion-safe parseInline (marked v17 fix) ───────────────────
      // In marked v17, calling localMarked.parseInline() from inside a
      // renderer method (e.g. link, listitem) causes infinite recursion
      // because parseInline re-enters the renderer for nested tokens.
      // This guard breaks the cycle by falling back to raw text at depth > 1.
      let _parseInlineDepth = 0;
      const parseInlineSafe = (text: string): string => {
        if (_parseInlineDepth > 0 || !localMarked) return text;
        _parseInlineDepth++;
        try {
          return localMarked.parseInline(text) as string;
        } catch {
          return text;
        } finally {
          _parseInlineDepth--;
        }
      };

      const usedHeadingIds = new Map<string, number>();

      const customRenderer: Partial<Renderer> = {
        // ── Headings with anchor links ──────────────────────────────────
        heading(token: any) {
          const text = token.text || '';
          const depth = token.depth || 1;
          const parsedText = parseInlineSafe(text);
          let baseId = slugify(text);
          if (!baseId) baseId = `section-${depth}`;
          const count = usedHeadingIds.get(baseId) || 0;
          usedHeadingIds.set(baseId, count + 1);
          const id = count === 0 ? baseId : `${baseId}-${count}`;
          return `<h${depth} id="${id}" class="md-heading-anchor"><a href="#${id}" class="md-anchor" aria-label="Bo'limga link nusxalash" title="Linkni nusxalash"><span class="md-anchor-icon" aria-hidden="true">#</span></a>${parsedText}</h${depth}>`;
        },

        // ── Task list items ──────────────────────────────────────────────
        listitem(token: any) {
          const text = token.text || '';
          // Detect task list item: starts with [ ] or [x]
          const taskMatch = /^\[([ xX])\]\s*([\s\S]*)$/.exec(text);
          if (taskMatch) {
            const checked = taskMatch[1].toLowerCase() === 'x';
            const content = taskMatch[2];
            // Parse inline content through marked
            const parsedContent = parseInlineSafe(content);
            return `<li class="md-task-item ${checked ? 'md-task-checked' : 'md-task-unchecked'}"><span class="md-checkbox ${checked ? 'checked' : ''}"><svg viewBox="0 0 16 16" width="16" height="16"><rect x="0.5" y="0.5" width="15" height="15" rx="3" ry="3" class="md-checkbox-bg"/>${checked ? '<path d="M12 5l-6 6-3-3" class="md-checkbox-tick" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' : ''}</svg></span><span class="md-task-text">${parsedContent}</span></li>`;
          }
          // Regular list item — parse inline content
          const parsedText = parseInlineSafe(text);
          return `<li>${parsedText}</li>`;
        },

        // ── Images → figure + figcaption + lightbox ─────────────────────
        image(token: any) {
          let href = token.href || '';
          const title = token.title || '';
          const alt = token.text || '';
          
          // Prepend MEDIA_URL to relative media paths
          if (href.startsWith('/media/')) {
            href = `${MEDIA_URL}${href.replace('/media', '')}`;
          }

          const titleAttr = title ? ` title="${escHtml(title)}"` : '';
          const caption = alt && alt !== href
            ? `<figcaption class="md-caption">${escHtml(alt)}</figcaption>`
            : '';
          return `<figure class="md-figure md-lightbox-trigger"><img src="${escHtml(href)}" alt="${escHtml(alt)}"${titleAttr} loading="lazy" />${caption}</figure>`;
        },

        // ── Links with external indicator ────────────────────────────────
        link(token: any) {
          let href = token.href || '';
          const title = token.title || '';
          const text = token.text || '';
          const titleAttr = title ? ` title="${escHtml(title)}"` : '';
          const isExternal = /^https?:\/\//.test(href);
          // Parse inline content (bold, code, etc inside links)
          const parsedText = parseInlineSafe(text);
          if (isExternal) {
            return `<a href="${escHtml(href)}"${titleAttr} target="_blank" rel="noopener noreferrer" class="md-external-link">${parsedText}<span class="md-external-icon">↗</span></a>`;
          }
          // Strip .md extension from internal doc links (e.g. 02-ornatish.md → /docs/02-ornatish)
          if (href.endsWith('.md') && !href.startsWith('http')) {
            const base = href.replace(/\.md$/, '');
            href = base.startsWith('/') ? base : `/docs/${base}`;
          }
          return `<a href="${escHtml(href)}"${titleAttr}>${parsedText}</a>`;
        },

        // ── Tables wrapped in scroll container ──────────────────────────
        table(token: any) {
          const headerCells = (token.header || []).map((cell: any) => {
            const content = parseInlineSafe(cell.text || '');
            const align = cell.align ? ` style="text-align:${cell.align}"` : '';
            return `<th${align}>${content}</th>`;
          }).join('');
          const bodyRows = (token.rows || []).map((row: any) => {
            const cells = row.map((cell: any) => {
              const content = parseInlineSafe(cell.text || '');
              const align = cell.align ? ` style="text-align:${cell.align}"` : '';
              return `<td${align}>${content}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
          }).join('');
          return `<div class="md-table-wrapper"><table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
        },

        // ── Code blocks with line numbers ────────────────────────────────
        code(token: any) {
          const code: string = (token.text || "").trim();
          const rawLang = ((token.lang as string) || "").trim();

          // If code is empty, don't render a code block at all
          if (!code) return "";

          // Parse meta from fence
          const { lang: language, title: codeTitle, highlights } = parseCodeMeta(rawLang);

          if (language === "mermaid") {
            return `<div class="web-mermaid-placeholder" data-code="${encodeURIComponent(code)}"></div>`;
          }

          if (language === "plantuml" || language === "puml") {
            try {
              let pumlCode = code;
              if (!pumlCode.startsWith("@start")) {
                pumlCode = `@startuml\n${pumlCode}\n@enduml`;
              }
              const encoded = plantumlEncoder.default.encode(pumlCode);
              const url = `https://www.plantuml.com/plantuml/svg/${encoded}`;
              return `<div class="plantuml-placeholder" data-code="${encodeURIComponent(pumlCode)}" data-url="${encodeURIComponent(url)}"></div>`;
            } catch {
              return `<pre class="p-4 my-6 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm overflow-x-auto"># PlantUML encode xatosi\n${escHtml(code)}</pre>`;
            }
          }

          if (language === "jupyter") {
            return `<div class="jupyter-cell-placeholder" data-code="${encodeURIComponent(code)}"></div>`;
          }

          // ── Diff language: special +/- line highlighting ──────────────
          if (language === "diff") {
            const diffLines = code.split('\n').map((line: string) => {
              const escaped = escHtml(line);
              if (line.startsWith('+') && !line.startsWith('+++')) {
                return `<span class="md-diff-add">${escaped}</span>`;
              } else if (line.startsWith('-') && !line.startsWith('---')) {
                return `<span class="md-diff-del">${escaped}</span>`;
              } else if (line.startsWith('@@')) {
                return `<span class="md-diff-info">${escaped}</span>`;
              }
              return escaped;
            }).join('\n');
            const lineCount = code.split('\n').length;
            const lineNums = Array.from({ length: lineCount }, (_, i) => `<span class="md-line-num">${i + 1}</span>`).join('');
            return `<div class="code-block-wrapper md-diff-block my-8 rounded-2xl overflow-hidden border border-[#1a2332] shadow-2xl group transition-all duration-300 hover:border-[#30363d] bg-[#0d1117]">
  <div class="flex items-center justify-between px-5 py-3 bg-[#0a0f1a] border-b border-[#1a2332]">
    <div class="flex items-center gap-2">
      <div class="flex gap-1.5 mr-2">
        <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
      </div>
      <span class="text-[10px] font-black text-[#a4b1cd] uppercase tracking-[0.2em]">DIFF</span>
    </div>
    <button type="button" class="copy-code-btn text-[10px] font-bold text-[#a4b1cd] hover:text-white transition-all flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-[#30363d]" data-code="${encodeURIComponent(code)}" aria-label="Kodni nusxalash">
      <span class="copy-icon text-sm">⎘</span>
      <span class="copy-text">Nusxa</span>
    </button>
  </div>
  <div class="md-code-body">
    <div class="md-line-numbers" aria-hidden="true">${lineNums}</div>
    <pre class="overflow-x-auto scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent flex-1"><code class="font-mono">${diffLines}</code></pre>
  </div>
</div>`;
          }

          const isKnownLang = language && hljs.default.getLanguage(language);

          const highlighted = isKnownLang
              ? hljs.default.highlight(code, { language }).value
              : hljs.default.highlightAuto(code).value;

          // Stylized panel for text/plaintext blocks
          if (!language || language === 'plaintext' || language === 'text' || language === 'txt') {
            // Detect if content looks like structured data (mappings, tables, lists)
            // vs actual terminal/command output
            const lines = code.split('\n');
            const hasPrompt = lines.some((l: string) => /^[$#>]|^\w+[@:]/.test(l.trim()));
            const hasPipe = lines.some((l: string) => l.includes(' | '));
            const hasDash = lines.filter((l: string) => /^\s*[-—–]/.test(l)).length > lines.length * 0.3;
            const hasArrow = lines.some((l: string) => /[→➜➡⟶=>]/.test(l));
            const hasMapping = lines.some((l: string) => /^\s*\S+\s+[—–-]+\s+\S/.test(l));
            const isTerminalOutput = hasPrompt && !hasMapping;
            
            if (isTerminalOutput) {
              // Terminal output style (original)
              return `<div class="md-text-panel my-8 rounded-2xl overflow-hidden border border-[#1e293b] shadow-xl bg-[#0c1222] group transition-all duration-300 hover:border-[#334155]">
  <div class="flex items-center justify-between px-5 py-2.5 bg-gradient-to-r from-[#0f172a] to-[#0c1222] border-b border-[#1e293b]">
    <div class="flex items-center gap-3">
      <div class="flex gap-1.5">
        <div class="w-2 h-2 rounded-full bg-[#475569]"></div>
        <div class="w-2 h-2 rounded-full bg-[#475569]"></div>
        <div class="w-2 h-2 rounded-full bg-[#475569]"></div>
      </div>
      <div class="h-3 w-px bg-[#1e293b]"></div>
      <span class="text-[10px] font-medium text-[#64748b] tracking-wider uppercase">Output</span>
    </div>
    <button type="button" class="copy-code-btn text-[10px] font-bold text-[#64748b] hover:text-white transition-all flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-[#334155]" data-code="${encodeURIComponent(code)}" aria-label="Kodni nusxalash">
      <span class="copy-icon text-sm">⎘</span>
      <span class="copy-text">Nusxa</span>
    </button>
  </div>
  <div class="md-code-body bg-[#111622]">
    <pre class="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#1e293b] scrollbar-track-transparent p-4"><code class="font-mono text-[#94a3b8] whitespace-pre">${escHtml(code)}</code></pre>
  </div>
</div>`;
            }

            // Data/info panel style — clean, readable, no monospace feel
            // Render each line with smart formatting
            const renderedLines = lines.map((line: string) => {
              const trimmed = line.trim();
              if (!trimmed) return '<div class="md-data-spacer"></div>';
              
              // Detect mapping lines: "KEY  — Description" or "KEY  - Description"
              const mapMatch = /^(\S+(?:\.\d+)?)\s{2,}([—–-])\s+(.+)$/.exec(trimmed);
              if (mapMatch) {
                return `<div class="md-data-row"><span class="md-data-key">${escHtml(mapMatch[1])}</span><span class="md-data-sep">${escHtml(mapMatch[2])}</span><span class="md-data-val">${escHtml(mapMatch[3])}</span></div>`;
              }
              
              // Detect bullet/dash lines
              if (/^[-•·▸▹►]\s/.test(trimmed)) {
                const content = trimmed.replace(/^[-•·▸▹►]\s+/, '');
                return `<div class="md-data-bullet"><span class="md-data-bullet-icon">›</span>${escHtml(content)}</div>`;
              }
              
              // Detect numbered lines: "1. something" or "1) something"
              const numMatch = /^(\d+)[.)]\s+(.+)$/.exec(trimmed);
              if (numMatch) {
                return `<div class="md-data-numbered"><span class="md-data-num">${escHtml(numMatch[1])}</span>${escHtml(numMatch[2])}</div>`;
              }
              
              // Header-like lines (ALL CAPS or short bold-looking)
              if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 60 && /[A-Z]/.test(trimmed)) {
                return `<div class="md-data-heading">${escHtml(trimmed)}</div>`;
              }
              
              // Regular line
              return `<div class="md-data-line">${escHtml(line)}</div>`;
            }).join('');

            return `<div class="md-data-panel my-8 rounded-2xl overflow-hidden border border-[#1e293b]/60 shadow-lg bg-gradient-to-br from-[#0f172a]/80 to-[#0c1524]/80 backdrop-blur-sm group transition-all duration-300 hover:border-[#334155]/80">
  <div class="flex items-center justify-between px-5 py-2.5 border-b border-[#1e293b]/40">
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined text-[14px] text-[#60a5fa]/70">info</span>
      <span class="text-[10px] font-medium text-[#64748b] tracking-wider uppercase">Ma'lumot</span>
    </div>
    <button type="button" class="copy-code-btn text-[10px] font-bold text-[#64748b] hover:text-white transition-all flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-[#334155]" data-code="${encodeURIComponent(code)}" aria-label="Nusxalash">
      <span class="copy-icon text-sm">⎘</span>
      <span class="copy-text">Nusxa</span>
    </button>
  </div>
  <div class="md-data-body px-6 py-4">${renderedLines}</div>
</div>`;
          }

          const safeLang = escHtml(language);
          const lineCount = code.split('\n').length;
          const isCollapsible = lineCount > 15;

          // Build line numbers with highlight support
          const lineNums = Array.from({ length: lineCount }, (_, i) => {
            const lineNo = i + 1;
            const hlClass = highlights.has(lineNo) ? ' md-line-hl' : '';
            return `<span class="md-line-num${hlClass}">${lineNo}</span>`;
          }).join('');

          // Build highlighted code with per-line wrappers for highlighting
          let codeHtml: string;
          if (highlights.size > 0) {
            // Wrap each line in a span for highlight styling
            const lines = highlighted.split('\n');
            codeHtml = lines.map((line, i) => {
              const lineNo = i + 1;
              if (highlights.has(lineNo)) {
                return `<span class="md-code-line-hl">${line}</span>`;
              }
              return line;
            }).join('\n');
          } else {
            codeHtml = highlighted;
          }

          // Language icon — render emoji as Twemoji SVG for consistent style
          const langIcon = langIcons[language] || '';
          const iconHtml = langIcon ? `<span class="md-lang-icon">${emojiToRenderedTag(langIcon, language)}</span>` : '';

          // Title / filename
          const titleHtml = codeTitle
            ? `<span class="md-code-title">${escHtml(codeTitle)}</span>`
            : '';

          // Collapsible wrapper
          const collapseClass = isCollapsible ? ' md-code-collapsible' : '';
          const collapseBtn = isCollapsible
            ? `<button class="md-code-expand-btn" data-lines="${lineCount}">▼ Ko'proq ko'rsatish (${lineCount} qator)</button>`
            : '';

          return `<div class="code-block-wrapper${collapseClass} my-8 rounded-2xl overflow-hidden border border-[#1a2332] shadow-2xl group transition-all duration-300 hover:border-[#30363d] bg-[#0d1117]">
  <div class="md-code-header">
    <div class="flex items-center gap-2 min-w-0">
      <div class="flex gap-1.5 mr-2 shrink-0">
        <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
      </div>
      ${iconHtml}
      <span class="text-[10px] font-black text-[#a4b1cd] uppercase tracking-[0.2em]">${safeLang}</span>
      ${titleHtml}
    </div>
    <button type="button" class="copy-code-btn text-[10px] font-bold text-[#a4b1cd] hover:text-white transition-all flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-[#30363d]" data-code="${encodeURIComponent(code)}" aria-label="Kodni nusxalash">
      <span class="copy-icon text-sm">⎘</span>
      <span class="copy-text">Nusxa</span>
    </button>
  </div>
  <div class="md-code-body">
    <div class="md-line-numbers" aria-hidden="true">${lineNums}</div>
    <pre class="overflow-x-auto scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent flex-1"><code class="hljs language-${safeLang} font-mono">${codeHtml}</code></pre>
  </div>
  ${collapseBtn}
</div>`;
        },
      };

      // Initialize Marked (must come after all extension definitions so closure works)
      localMarked = new Marked();
      localMarked.use({
        extensions: [
          mathBlockExtension,
          mathInlineExtension,
          iconExtension,
          badgeExtension,
          pillExtension,
          emojiShortcodeExtension,
          emojiExtension,
          admonitionExtension,
          subExtension,
          supExtension,
          markExtension,
          insExtension,
          kbdExtension,
        ],
        renderer: customRenderer,
        breaks: true,
        gfm: true,
      });

      let preprocessed = '';
      let rawHtml = '';
      try {
        preprocessed = preprocessMarkdown(content);
        rawHtml = await localMarked.parse(preprocessed);
      } catch (err) {
        console.error('[MarkdownRenderer] Parse error:', err);
        rawHtml = `<div class="text-red-400 p-4 border border-red-500/30 rounded-lg"><strong>Markdown parse xatosi:</strong><pre class="mt-2 text-xs opacity-70 whitespace-pre-wrap">${err instanceof Error ? err.message : String(err)}</pre></div><pre class="text-xs text-gray-400 mt-4 whitespace-pre-wrap">${content.substring(0, 500)}...</pre>`;
      }

      let sanitizedHtml = '';
      try {
        sanitizedHtml = DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: [
          "details",
          "summary",
          // SVG
          "svg",
          "path",
          "circle",
          "ellipse",
          "polygon",
          "polyline",
          "rect",
          "line",
          "g",
          "defs",
          "use",
          "clipPath",
          "mask",
          "marker",
          "linearGradient",
          "radialGradient",
          "stop",
          "text",
          "tspan",
          "textPath",
          "foreignObject",
          // KaTeX a11y
          "annotation",
          "semantics",
          "math",
          // Sub/Sup/Mark/Ins/Kbd
          "sub",
          "sup",
          "mark",
          "ins",
          "kbd",
          "abbr",
          // Figure/Caption
          "figure",
          "figcaption",
          // Footnotes
          "section",
          "ol",
          // Definition Lists
          "dl",
          "dt",
          "dd",
          // Tabs & Video
          "button",
          "iframe",
        ],
        ADD_ATTR: [
          "class",
          "id",
          "title",
          "style",
          "draggable",
          "aria-hidden",
          "aria-label",
          "aria-live",
          "aria-describedby",
          "role",
          "tabindex",
          "loading",
          // placeholder data
          "data-code",
          "data-url",
          // tabs
          "data-tab-group",
          "data-tab-target",
          "data-tab-panel",
          // video
          "data-video-id",
          "data-provider",
          "src",
          "frameborder",
          "allow",
          "allowfullscreen",
          // SVG geometry
          "viewBox",
          "fill",
          "stroke",
          "d",
          "points",
          "cx",
          "cy",
          "r",
          "rx",
          "ry",
          "x",
          "y",
          "x1",
          "y1",
          "x2",
          "y2",
          "width",
          "height",
          "transform",
          "preserveAspectRatio",
          // SVG stroke
          "stroke-linecap",
          "stroke-linejoin",
          "stroke-width",
          "stroke-dasharray",
          "stroke-dashoffset",
          "fill-rule",
          // SVG gradient/clip
          "gradientUnits",
          "gradientTransform",
          "offset",
          "clip-path",
          "clip-rule",
          "mask",
          // SVG markers
          "marker-end",
          "marker-start",
          "marker-mid",
          "refX",
          "refY",
          "markerWidth",
          "markerHeight",
          "orient",
          "xlink:href",
          "href",
          // SVG text
          "font-size",
          "font-family",
          "font-weight",
          "font-style",
          "text-anchor",
          "dominant-baseline",
          "letter-spacing",
          // namespace
          "xmlns",
          "xmlns:xlink",
        ],
        ALLOW_DATA_ATTR: false,
        FORCE_BODY: false,
      });
      } catch (err) {
        console.error('[MarkdownRenderer] Sanitize error:', err);
        sanitizedHtml = "";
      }

      if (isMounted) setHtml(sanitizedHtml);
    };

    loadAndParse();
    return () => {
      isMounted = false;
    };
  }, [content]);

  useEffect(() => {
    if (!containerRef.current || !html) return;
    let isMounted = true;

    // Unmount previous React roots
    const prevRoots = rootsRef.current;
    rootsRef.current = [];
    prevRoots.forEach((root) => {
      try {
        root.unmount();
      } catch {
        // ignore
      }
    });

    // ── Copy button handlers ───────────────────────────────────────────────
    const copyHandlers: { el: Element; fn: EventListener }[] = [];
    containerRef.current.querySelectorAll(".copy-code-btn").forEach((btn) => {
      const handler: EventListener = async () => {
        const code = decodeURIComponent(btn.getAttribute("data-code") ?? "");
        try {
          await navigator.clipboard.writeText(code);
          const textEl = btn.querySelector(".copy-text");
          const iconEl = btn.querySelector(".copy-icon");
          if (textEl) textEl.textContent = "Nusxalandi!";
          if (iconEl) iconEl.textContent = "✓";
          btn.classList.add("text-emerald-400", "border-emerald-500/30");
          setTimeout(() => {
            if (textEl) textEl.textContent = "Nusxa";
            if (iconEl) iconEl.textContent = "⎘";
            btn.classList.remove("text-emerald-400", "border-emerald-500/30");
          }, 2000);
        } catch {
          const textEl = btn.querySelector(".copy-text");
          if (textEl) {
            textEl.textContent = "Xato!";
            setTimeout(() => {
              textEl.textContent = "Nusxa";
            }, 2000);
          }
        }
      };
      btn.addEventListener("click", handler);
      copyHandlers.push({ el: btn, fn: handler });
    });

    // ── Mount React components ─────────────────────────────────────────────
    const newRoots: { unmount: () => void }[] = [];

    // ── Render Mermaid diagrams directly (avoid createRoot module resolution issue) ──
    const mermaidEls = containerRef.current?.querySelectorAll(".web-mermaid-placeholder");
    if (mermaidEls && mermaidEls.length > 0) {
      // Load mermaid from CDN (import("mermaid") fails in Next.js production builds)
      const loadMermaid = (): Promise<any> => {
        if ((window as any).__mermaid) return Promise.resolve((window as any).__mermaid);
        return new Promise((resolve, reject) => {
          const existingScript = document.querySelector('script[src*="mermaid"]');
          if (existingScript) {
            // Script already loading, wait for it
            existingScript.addEventListener("load", () => resolve((window as any).mermaid));
            existingScript.addEventListener("error", reject);
            if ((window as any).mermaid) resolve((window as any).mermaid);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
          script.onload = () => {
            (window as any).__mermaid = (window as any).mermaid;
            resolve((window as any).mermaid);
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      loadMermaid().then((mermaid) => {
        if (!isMounted) return;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            darkMode: true,
            background: "#0d1117",
            primaryColor: "#1e293b",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#60a5fa",
            lineColor: "#93c5fd",
            secondaryColor: "#1e3a8a",
            tertiaryColor: "#1e1e1e",
            textColor: "#ffffff",
            mainBkg: "#0d1117",
            nodeBorder: "#60a5fa",
            clusterBkg: "rgba(30, 58, 138, 0.2)",
            clusterBorder: "#60a5fa",
            defaultLinkColor: "#93c5fd",
            titleColor: "#ffffff",
            edgeLabelBackground: "#1e293b",
            actorBorder: "#60a5fa",
            actorBkg: "#1e3a8a",
            actorTextColor: "#ffffff",
            signalColor: "#ffffff",
            signalTextColor: "#ffffff",
            labelBoxBkgColor: "#1e293b",
            labelBoxBorderColor: "#60a5fa",
            labelTextColor: "#ffffff",
            loopTextColor: "#ffffff",
            noteBorderColor: "#fbbf24",
            noteBkgColor: "#1e293b",
            noteTextColor: "#fbbf24",
          },
          securityLevel: "strict",
          fontFamily: "Inter, sans-serif",
          fontSize: 16,
          flowchart: { htmlLabels: true, curve: "basis", useMaxWidth: true },
        });

        mermaidEls.forEach(async (el) => {
          if (!isMounted) return;
          const code = decodeURIComponent(el.getAttribute("data-code") ?? "");
          if (!code.trim()) return;
          try {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            const { svg } = await mermaid.render(id, code.trim());
            if (!isMounted) return;
            // Render with scroll container + zoom button (DOM-based to avoid trusting svg as HTML string)
            el.replaceChildren();
            const wrapper = document.createElement('div');
            wrapper.className = 'relative group my-8';
            const scrollContainer = document.createElement('div');
            scrollContainer.className = 'w-full h-auto flex justify-center overflow-x-auto mermaid-scroll-container';
            const inlineSvg = document.createElement('div');
            inlineSvg.className = 'mermaid-inline-svg';
            inlineSvg.innerHTML = svg;
            scrollContainer.appendChild(inlineSvg);
            wrapper.appendChild(scrollContainer);

            const zoomBtn = document.createElement('button');
            zoomBtn.type = 'button';
            zoomBtn.className = 'mermaid-zoom-btn absolute top-2 right-2 bg-[#1e3a8a] hover:bg-[#2563eb] text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-xs border border-[#60a5fa]';
            zoomBtn.title = 'Kattalashtirish';
            zoomBtn.setAttribute('aria-label', 'Diagrammani kattalashtirish');
            zoomBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg><span>Kattalashtirish</span>';
            wrapper.appendChild(zoomBtn);
            el.appendChild(wrapper);
            (el as HTMLElement).style.minHeight = 'auto';

            const openZoom = () => {
              let currentZoom = 1, panX = 0, panY = 0, dragging = false, lastX = 0, lastY = 0;
              const modal = document.createElement('div');
              modal.setAttribute('role', 'dialog');
              modal.setAttribute('aria-modal', 'true');
              modal.setAttribute('aria-label', 'Mermaid diagrammasi');
              modal.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.95);backdrop-filter:blur(12px)';

              const panel = document.createElement('div');
              panel.style.cssText = 'position:relative;width:95vw;height:95vh;background:#0d1117;border-radius:1rem;border:1px solid rgba(96,165,250,0.3);display:flex;flex-direction:column;overflow:hidden';
              panel.addEventListener('click', (e) => e.stopPropagation());

              const header = document.createElement('div');
              header.style.cssText = 'padding:12px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);flex-shrink:0';
              const hint = document.createElement('span');
              hint.style.cssText = 'color:rgba(255,255,255,0.6);font-size:14px';
              hint.textContent = 'Sichqonchani suring · Scroll bilan kattalashtiring · ESC yopish';
              const controls = document.createElement('div');
              controls.style.cssText = 'display:flex;align-items:center;gap:8px';
              const zoomGroup = document.createElement('div');
              zoomGroup.style.cssText = 'display:flex;align-items:center;gap:4px;background:rgba(255,255,255,0.05);border-radius:8px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1)';
              const btnOut = document.createElement('button');
              btnOut.type = 'button'; btnOut.textContent = '−'; btnOut.setAttribute('aria-label', 'Kichraytirish');
              btnOut.style.cssText = 'color:rgba(255,255,255,0.7);padding:2px 6px;font-size:14px;font-weight:bold;cursor:pointer;background:none;border:none';
              const valEl = document.createElement('span');
              valEl.style.cssText = 'color:rgba(255,255,255,0.6);font-size:12px;min-width:3rem;text-align:center;font-family:monospace';
              valEl.textContent = '100%';
              const btnIn = document.createElement('button');
              btnIn.type = 'button'; btnIn.textContent = '+'; btnIn.setAttribute('aria-label', 'Kattalashtirish');
              btnIn.style.cssText = 'color:rgba(255,255,255,0.7);padding:2px 6px;font-size:14px;font-weight:bold;cursor:pointer;background:none;border:none';
              zoomGroup.append(btnOut, valEl, btnIn);
              const btnReset = document.createElement('button');
              btnReset.type = 'button'; btnReset.textContent = 'Qaytarish'; btnReset.setAttribute('aria-label', 'Asl holatga qaytarish');
              btnReset.style.cssText = 'color:rgba(255,255,255,0.5);font-size:12px;padding:4px 8px;border-radius:8px;cursor:pointer;background:none;border:1px solid rgba(255,255,255,0.1)';
              const btnClose = document.createElement('button');
              btnClose.type = 'button'; btnClose.textContent = '✕'; btnClose.setAttribute('aria-label', 'Yopish');
              btnClose.style.cssText = 'background:rgba(239,68,68,0.1);color:#ef4444;padding:8px;border-radius:8px;cursor:pointer;border:none;font-size:16px;font-weight:bold';
              controls.append(zoomGroup, btnReset, btnClose);
              header.append(hint, controls);

              const canvas = document.createElement('div');
              canvas.style.cssText = 'flex:1;overflow:hidden;cursor:grab';
              const inner = document.createElement('div');
              inner.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-origin:center center;transition:transform 0.15s ease-out';
              const zoomSvgWrap = document.createElement('div');
              zoomSvgWrap.className = 'mermaid-zoom-svg';
              zoomSvgWrap.innerHTML = svg;
              inner.appendChild(zoomSvgWrap);
              canvas.appendChild(inner);

              panel.append(header, canvas);
              modal.appendChild(panel);
              document.body.appendChild(modal);
              document.body.style.overflow = 'hidden';

              const update = () => { inner.style.transform = `translate(${panX}px,${panY}px) scale(${currentZoom})`; valEl.textContent = `${Math.round(currentZoom * 100)}%`; };
              const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
              const close = () => { modal.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', escHandler); };
              modal.addEventListener('click', close);
              btnClose.addEventListener('click', close);
              btnOut.addEventListener('click', () => { currentZoom = Math.max(0.2, currentZoom - 0.2); update(); });
              btnIn.addEventListener('click', () => { currentZoom = Math.min(5, currentZoom + 0.2); update(); });
              btnReset.addEventListener('click', () => { currentZoom = 1; panX = 0; panY = 0; update(); });
              canvas.addEventListener('wheel', (e) => { e.preventDefault(); currentZoom = Math.min(5, Math.max(0.2, currentZoom + (e.deltaY > 0 ? -0.1 : 0.1))); update(); }, { passive: false });
              canvas.addEventListener('mousedown', (e) => { if (e.button !== 0) return; dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.style.cursor = 'grabbing'; inner.style.transition = 'none'; });
              document.addEventListener('mousemove', (e) => { if (!dragging) return; panX += e.clientX - lastX; panY += e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; update(); });
              document.addEventListener('mouseup', () => { dragging = false; canvas.style.cursor = 'grab'; inner.style.transition = 'transform 0.15s ease-out'; });
              document.addEventListener('keydown', escHandler);
            };
            zoomBtn.addEventListener('click', (e) => { e.stopPropagation(); openZoom(); });
            scrollContainer.addEventListener('click', openZoom);
          } catch (err) {
            console.error("Mermaid render error:", err);
            const errWrapper = document.createElement('div');
            errWrapper.className = 'mermaid-error';
            const errTitle = document.createElement('strong');
            errTitle.textContent = 'Mermaid render xatosi';
            const errMsg = document.createElement('pre');
            errMsg.className = 'mt-2 text-xs opacity-70 whitespace-pre-wrap';
            errMsg.textContent = err instanceof Error ? err.message : String(err);
            const details = document.createElement('details');
            details.className = 'mt-2';
            const summary = document.createElement('summary');
            summary.className = 'cursor-pointer text-xs opacity-50';
            summary.textContent = 'Manba kodi';
            const codeEl = document.createElement('pre');
            codeEl.className = 'mt-1 text-xs opacity-40 text-left whitespace-pre-wrap';
            codeEl.textContent = code;
            details.appendChild(summary);
            details.appendChild(codeEl);
            errWrapper.appendChild(errTitle);
            errWrapper.appendChild(errMsg);
            errWrapper.appendChild(details);
            el.innerHTML = '';
            el.appendChild(errWrapper);
          }
        });
      }).catch((err) => {
        console.error("Failed to load mermaid library:", err);
        mermaidEls.forEach((el) => {
          const errWrapper = document.createElement('div');
          errWrapper.className = 'mermaid-error';
          const errTitle = document.createElement('strong');
          errTitle.textContent = 'Mermaid kutubxonasini yuklashda xato';
          const errMsg = document.createElement('pre');
          errMsg.className = 'mt-2 text-xs opacity-70';
          errMsg.textContent = err?.message || String(err);
          errWrapper.appendChild(errTitle);
          errWrapper.appendChild(errMsg);
          el.innerHTML = '';
          el.appendChild(errWrapper);
        });
      });
    }

    import("react-dom/client").then(({ createRoot }) => {
      if (!isMounted) return;

      // PlantUML diagrams (with loading + error states)
      containerRef.current
        ?.querySelectorAll(".plantuml-placeholder")
        .forEach((el) => {
          const code = decodeURIComponent(el.getAttribute("data-code") ?? "");
          const url = decodeURIComponent(el.getAttribute("data-url") ?? "");
          const root = createRoot(el);
          root.render(<PlantUMLComponent url={url} code={code} />);
          newRoots.push(root);
        });

      // Interactive Jupyter cells
      containerRef.current
        ?.querySelectorAll(".jupyter-cell-placeholder")
        .forEach(async (el) => {
          const code = decodeURIComponent(el.getAttribute("data-code") ?? "");
          const { default: InteractiveJupyterCell } = await import(
            "./InteractiveJupyterCell"
          );
          if (!isMounted) return;
          const root = createRoot(el);
          root.render(<InteractiveJupyterCell initialCode={code} />);
          newRoots.push(root);
        });

      rootsRef.current = newRoots;
    });

    // ── Tab panel reparenting ─────────────────────────────────────────────────
    // Tab panels were emitted as siblings after the md-tabs container.
    // Move them into the md-tabs-content wrapper for proper layout.
    containerRef.current.querySelectorAll(".md-tabs").forEach((tabGroup) => {
      const contentWrapper = tabGroup.querySelector(".md-tabs-content");
      if (!contentWrapper) return;
      const groupId = tabGroup.getAttribute("data-tab-group");
      if (!groupId) return;
      // Find all panels that belong to this group (they are siblings after the container)
      const allPanels = containerRef.current!.querySelectorAll(
        `.md-tab-panel[data-tab-panel^="${groupId}-"]`
      );
      allPanels.forEach((panel) => {
        contentWrapper.appendChild(panel);
      });
    });

    // ── Tab switching handlers ─────────────────────────────────────────────
    const tabHandlers: { el: Element; fn: EventListener }[] = [];
    containerRef.current.querySelectorAll("[data-tab-target]").forEach((btn) => {
      const handler: EventListener = () => {
        const target = btn.getAttribute("data-tab-target");
        const group = btn.closest(".md-tabs");
        if (!group || !target) return;
        const isFooterBtn = btn.classList.contains("md-tab-footer-btn");
        // Deactivate all tabs in this group
        group.querySelectorAll(".md-tab-btn").forEach(b => b.classList.remove("active"));
        group.querySelectorAll(".md-tab-panel").forEach(p => p.classList.remove("active"));
        // Activate clicked tab
        const navBtn = group.querySelector(`.md-tab-btn[data-tab-target="${target}"]`);
        if (navBtn) navBtn.classList.add("active");
        group.querySelector(`[data-tab-panel="${target}"]`)?.classList.add("active");
        // Scroll to top if clicking footer buttons
        if (isFooterBtn) {
          group.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      btn.addEventListener("click", handler);
      tabHandlers.push({ el: btn, fn: handler });
    });

    // ── YouTube video embed handlers ────────────────────────────────────────
    containerRef.current.querySelectorAll(".md-video-embed").forEach((el) => {
      const videoId = el.getAttribute("data-video-id");
      const provider = el.getAttribute("data-provider") || "youtube";
      if (!videoId) return;

      // Validate videoId to prevent injection
      const youtubeIdPattern = /^[\w-]{11}$/;
      const vimeoIdPattern = /^\d{1,12}$/;
      const isValidId =
        (provider === "youtube" && youtubeIdPattern.test(videoId)) ||
        (provider === "vimeo" && vimeoIdPattern.test(videoId));
      if (!isValidId) return;

      const wrapper = document.createElement("div");
      wrapper.className = "md-video-wrapper";
      let src = '';
      if (provider === "youtube") {
        src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
      } else if (provider === "vimeo") {
        src = `https://player.vimeo.com/video/${videoId}?dnt=1`;
      }
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = "Video";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("loading", "lazy");
      wrapper.appendChild(iframe);
      el.replaceWith(wrapper);
    });

    // ── Heading anchor click → copy URL ──────────────────────────────────────
    const anchorHandlers: { el: Element; fn: EventListener }[] = [];
    containerRef.current.querySelectorAll(".md-anchor").forEach((anchor) => {
      const handler: EventListener = (e) => {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href) {
          const url = window.location.origin + window.location.pathname + href;
          navigator.clipboard.writeText(url).then(() => {
            const icon = anchor.querySelector(".md-anchor-icon");
            if (icon) {
              const orig = icon.textContent;
              icon.textContent = "✓";
              icon.classList.add("md-anchor-copied");
              setTimeout(() => {
                icon.textContent = orig;
                icon.classList.remove("md-anchor-copied");
              }, 1500);
            }
          });
        }
      };
      anchor.addEventListener("click", handler);
      anchorHandlers.push({ el: anchor, fn: handler });
    });

    // ── Collapsible code block handlers ────────────────────────────────────
    const expandHandlers: { el: Element; fn: EventListener }[] = [];
    containerRef.current.querySelectorAll(".md-code-expand-btn").forEach((btn) => {
      const handler: EventListener = () => {
        const wrapper = btn.closest(".md-code-collapsible");
        if (!wrapper) return;
        const isExpanded = wrapper.classList.contains("md-code-expanded");
        if (isExpanded) {
          wrapper.classList.remove("md-code-expanded");
          btn.textContent = `▼ Ko'proq ko'rsatish (${btn.getAttribute("data-lines")} qator)`;
        } else {
          wrapper.classList.add("md-code-expanded");
          btn.textContent = `▲ Kamroq ko'rsatish`;
        }
      };
      btn.addEventListener("click", handler);
      expandHandlers.push({ el: btn, fn: handler });
    });

    // ── Image lightbox handlers ──────────────────────────────────────────
    const lightboxHandlers: { el: Element; fn: EventListener }[] = [];
    containerRef.current.querySelectorAll(".md-lightbox-trigger img").forEach((img) => {
      const handler: EventListener = () => {
        const src = img.getAttribute("src");
        const alt = img.getAttribute("alt") || '';
        if (!src) return;
        const overlay = document.createElement("div");
        overlay.className = "md-lightbox-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", alt || "Rasm");

        const content = document.createElement("div");
        content.className = "md-lightbox-content";

        const closeBtn = document.createElement("button");
        closeBtn.className = "md-lightbox-close";
        closeBtn.setAttribute("aria-label", "Yopish");
        closeBtn.textContent = "✕";

        const fullImg = document.createElement("img");
        fullImg.src = src;
        fullImg.alt = alt;

        content.appendChild(closeBtn);
        content.appendChild(fullImg);
        if (alt) {
          const cap = document.createElement("p");
          cap.className = "md-lightbox-caption";
          cap.textContent = alt;
          content.appendChild(cap);
        }
        overlay.appendChild(content);

        const escHandler = (e: KeyboardEvent) => {
          if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", escHandler); }
        };
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) { overlay.remove(); document.removeEventListener("keydown", escHandler); }
        });
        closeBtn.addEventListener("click", () => { overlay.remove(); document.removeEventListener("keydown", escHandler); });
        document.addEventListener("keydown", escHandler);
        document.body.appendChild(overlay);
      };
      img.addEventListener("click", handler);
      (img as HTMLElement).style.cursor = "zoom-in";
      lightboxHandlers.push({ el: img, fn: handler });
    });

    return () => {
      isMounted = false;
      copyHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      tabHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      anchorHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      expandHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      lightboxHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      newRoots.forEach((root) => {
        try {
          root.unmount();
        } catch {
          // ignore
        }
      });
    };
  }, [html]);

  return (
    <>
      {isPolygonHtml ? (
        <div
          ref={containerRef}
          className={`polygon-statement ${className}`}
          style={{
            color: '#e6edf3',
            fontSize: '0.875rem',
            lineHeight: '1.7',
            opacity: polygonHtmlContent ? 1 : 0,
            transition: 'opacity 0.15s ease',
          }}
          dangerouslySetInnerHTML={{ __html: polygonHtmlContent || '' }}
        />
      ) : !html && content ? (
        <div className={`markdown-content${variant ? ` md-${variant}` : ''} max-w-none ${className} md-skeleton-root`} aria-busy="true" aria-label="Kontent yuklanmoqda">
          <div className="md-skeleton md-skeleton-h1" />
          <div className="md-skeleton md-skeleton-p" />
          <div className="md-skeleton md-skeleton-p md-skeleton-p--short" />
          <div className="md-skeleton md-skeleton-code" />
          <div className="md-skeleton md-skeleton-p" />
          <div className="md-skeleton md-skeleton-p md-skeleton-p--medium" />
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`markdown-content${variant ? ` md-${variant}` : ''} prose prose-invert prose-code:before:content-none prose-code:after:content-none max-w-none ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </>
  );
};

export default MarkdownRenderer;
