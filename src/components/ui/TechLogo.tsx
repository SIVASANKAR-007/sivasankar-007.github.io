import { asset } from "@/lib/asset";

/**
 * Real brand logos (official colours) — copied from devicon (MIT) and simple-icons (CC0)
 * into /public/logos. `tint` is used for the soft glow behind the logo.
 */
export const BRAND: Record<string, { src: string; tint: string; title: string }> = {
  python: { src: "/logos/devicon/python-original.svg", tint: "#3776AB", title: "Python" },
  pandas: { src: "/logos/devicon/pandas-original.svg", tint: "#150458", title: "pandas" },
  matplotlib: { src: "/logos/devicon/matplotlib-original.svg", tint: "#11557C", title: "Matplotlib" },
  github: { src: "/logos/devicon/github-original.svg", tint: "#181717", title: "GitHub" },
  vscode: { src: "/logos/devicon/vscode-original.svg", tint: "#007ACC", title: "Visual Studio Code" },
  salesforce: { src: "/logos/devicon/salesforce-original.svg", tint: "#00A1E0", title: "Salesforce" },
  claude: { src: "/logos/simple-icons/claude.svg", tint: "#D97757", title: "Claude" },
  anthropic: { src: "/logos/simple-icons/anthropic.svg", tint: "#191919", title: "Anthropic" },
  modelcontextprotocol: { src: "/logos/simple-icons/modelcontextprotocol.svg", tint: "#000000", title: "Model Context Protocol" },
  googleanalytics: { src: "/logos/simple-icons/googleanalytics.svg", tint: "#E37400", title: "Google Analytics" },
};

/** Thin line icons for concepts (and tools whose marks aren't openly licensed). */
export const CONCEPT: Record<string, React.ReactNode> = {
  sql: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  scrape: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 8h18M7 12h6M7 15h4M15.5 13.5l3 3M17 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </>
  ),
  bars: <path d="M5 20V12M10 20V6M15 20V9M20 20V4M3 20.5h18" />,
  cross: <path d="M12 3v7M8.5 6.5h7M12 14v7M8.5 17.5h7M5.5 9v6M2.5 12h6M18.5 9v6M15.5 12h6" />,
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="10" rx="1.5" />
      <rect x="13" y="3" width="8" height="6" rx="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" />
      <rect x="3" y="15" width="8" height="6" rx="1.5" />
    </>
  ),
  sheet: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </>
  ),
  pivot: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 8h18M8 3v18M12 12h5v5M17 12l-5 5" />
    </>
  ),
  lookup: (
    <>
      <path d="M3 5h10M3 10h7M3 15h5" />
      <circle cx="15.5" cy="14.5" r="4" />
      <path d="M18.5 17.5 21 20" />
    </>
  ),
  kpi: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5M7 17h.01M17 17h.01M12 9v.01" />
    </>
  ),
  automation: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  scatter: (
    <>
      <path d="M3 3v18h18" />
      <circle cx="8" cy="15" r="1.2" />
      <circle cx="11" cy="11" r="1.2" />
      <circle cx="15" cy="13" r="1.2" />
      <circle cx="17" cy="7" r="1.2" />
      <circle cx="13" cy="6" r="1.2" />
    </>
  ),
  bell: <path d="M2 19h20M3 19c3 0 4-13 9-13s6 13 9 13M12 6v13" />,
  trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  forecast: (
    <>
      <path d="M3 17l5-5 4 3 4-5" />
      <path d="M16 10l5-4" strokeDasharray="2 2" />
      <path d="M3 21h18" />
    </>
  ),
  check: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 12.5l3 3 5-6" />
    </>
  ),
  book: <path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5ZM4 20a2 2 0 0 0 2 2h13v-4M8 7h7M8 10h5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.5 5.6 3.5 9s-1 6.4-3.5 9c-2.5-2.6-3.5-5.6-3.5-9s1-6.4 3.5-9Z" />
    </>
  ),
  versus: (
    <>
      <rect x="3" y="6" width="7" height="12" rx="1.5" />
      <rect x="14" y="3" width="7" height="15" rx="1.5" />
      <path d="M3 21h18" />
    </>
  ),
  benchmark: <path d="M4 20V10M9 20V4M14 20v-7M19 20v-4M2 8h20" strokeDasharray="0" />,
  chat: (
    <>
      <path d="M4 5h16v11H9l-5 4V5Z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  prompt: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 10l3 2-3 2M12 15h5" />
    </>
  ),
  taxonomy: (
    <>
      <rect x="9" y="2.5" width="6" height="4.5" rx="1" />
      <rect x="2.5" y="16" width="6" height="4.5" rx="1" />
      <rect x="9" y="16" width="6" height="4.5" rx="1" />
      <rect x="15.5" y="16" width="6" height="4.5" rx="1" />
      <path d="M12 7v9M5.5 16v-4h13v4" />
    </>
  ),
  tree: (
    <>
      <circle cx="5" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="12" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M5 7v10M5 12h12M7 19h10" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 13.8 7 22l5-3 5 3-1.5-8.2M12 6.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3.9-1.8Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.6 3.3-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.8.7 3 2.4 3.5 5.2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2" />
    </>
  ),
};

export const isBrand = (key: string) => key in BRAND;

type Props = { name: string; logo: string; size?: number; className?: string; decorative?: boolean };

export default function TechLogo({ name, logo, size = 24, className = "", decorative = false }: Props) {
  const b = BRAND[logo];
  if (b) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(b.src)}
        width={size}
        height={size}
        alt={decorative ? "" : `${name} logo`}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  const c = CONCEPT[logo] ?? CONCEPT.grid;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : `${name} icon`}
    >
      {c}
    </svg>
  );
}
