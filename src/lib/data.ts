/**
 * Single source of truth for every word on the site.
 * Everything here is taken from Sivasankar_T_Resume_Updated.pdf.
 * The only exception is PROFILE.github, which the owner supplied separately
 * (the résumé itself carries no GitHub link).
 */

export type Profile = {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  focus: string;
  email: string;
  phone: string;
  phoneHref: string;
  location: string;
  resumeSummary: string;
  extraLine: string;
  github?: string;
  githubLabel?: string;
  linkedin?: string;
  linkedinLabel?: string;
  resume: string;
  quote: string;
  /** Optional transcript of the hero intro video (shown under the hero for accessibility). */
  introTranscript?: string;
};

export const PROFILE: Profile = {
  name: "Sivasankar T",
  firstName: "Sivasankar",
  initials: "ST",
  role: "Data & Research Analyst",
  focus: "Business Intelligence & Workforce Analytics",
  email: "sivasankar.t007@gmail.com",
  phone: "+91 6380312299",
  phoneHref: "tel:+916380312299",
  location: "Chennai, India",
  resumeSummary:
    "Data and Research Analyst with just over three years at Zinnov Management Consulting, working across technology, healthcare, retail, and biotechnology accounts on analytics, secondary research, and BI reporting. Day-to-day work mixes SQL and Python (Pandas, Matplotlib) with Power BI, Tableau, and Advanced Excel — cleaning and validating data, building dashboards, and turning research into decisions for clients including Pfizer, IBM, and Eaton. Rebuilt a recurring-reporting process that cut manual effort by roughly 30%, and workforce insights delivered on a separate engagement helped shorten time-to-fill by 15% on critical roles. More recently, Claude (Anthropic's API, Claude Code, and MCP) has been folded into the workflow to speed up analysis and reporting.",
  extraLine:
    "Mentored a team of 7 analysts, tightening up how the team handles quality checks, data validation, and onboarding.",
  // Supplied by the owner (not in the résumé PDF).
  github: "https://github.com/SIVASANKAR-007",
  githubLabel: "github.com/SIVASANKAR-007",
  linkedin: "https://www.linkedin.com/in/sivasankar-t",
  linkedinLabel: "linkedin.com/in/sivasankar-t",
  resume: "/Sivasankar_T_Resume.pdf",
  // Paraphrase of the résumé's own words: "turning research into decisions".
  quote: "Turning research into decisions.",
  // Paste the exact words spoken in the intro video here to show a transcript under the hero.
  introTranscript: undefined,
};

export type NavItem = { id: string; label: string };
export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

/** Section order → tag numbers ("01 — About"). */
export const SECTION_INDEX: Record<string, string> = {
  about: "01",
  skills: "02",
  work: "03",
  certifications: "04",
  experience: "05",
  achievements: "06",
  contact: "07",
};

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export type SkillFamily =
  | "Programming & Data"
  | "BI & Visualization"
  | "Advanced Excel"
  | "Analytics"
  | "Research"
  | "AI & Automation"
  | "Platforms";

export type Skill = {
  name: string;
  symbol: string;
  family: SkillFamily;
  /** key into TechLogo BRAND or CONCEPT map */
  logo: string;
  /** where the résumé names this skill */
  usedIn: string[];
};

export type SkillGroup = { family: SkillFamily; short: string; skills: Skill[] };

const P1 = "Role Mapping Center of Excellence";
const P2 = "Job Role Mapping to Draup Platform Taxonomy";
const P3 = "Skills Classification";
const P4 = "Skills Gap Analysis";
const P5 = "GenAI Tool & Skills Recommendation";
const P6 = "Skills Architecture & Job Leveling – Aker Solutions";
const RA = "Research Analyst, Zinnov";
const ARE = "Associate Research Executive, Zinnov";
const SUM = "Day-to-day analytics work";

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Programming & Data",
    short: "Data",
    skills: [
      { name: "Python", symbol: "Py", family: "Programming & Data", logo: "python", usedIn: [SUM] },
      { name: "Pandas", symbol: "Pd", family: "Programming & Data", logo: "pandas", usedIn: [SUM] },
      { name: "Matplotlib", symbol: "Mp", family: "Programming & Data", logo: "matplotlib", usedIn: [SUM] },
      { name: "SQL", symbol: "Sq", family: "Programming & Data", logo: "sql", usedIn: [SUM] },
      { name: "Web Scraping", symbol: "Ws", family: "Programming & Data", logo: "scrape", usedIn: [] },
    ],
  },
  {
    family: "BI & Visualization",
    short: "BI",
    skills: [
      { name: "Power BI", symbol: "Pb", family: "BI & Visualization", logo: "bars", usedIn: [RA, SUM] },
      { name: "Tableau", symbol: "Tb", family: "BI & Visualization", logo: "cross", usedIn: [SUM] },
      { name: "Google Analytics", symbol: "Ga", family: "BI & Visualization", logo: "googleanalytics", usedIn: [RA] },
      { name: "Dashboards", symbol: "Db", family: "BI & Visualization", logo: "dashboard", usedIn: [RA, ARE] },
    ],
  },
  {
    family: "Advanced Excel",
    short: "Excel",
    skills: [
      { name: "Advanced Excel", symbol: "Ex", family: "Advanced Excel", logo: "sheet", usedIn: [P1, P2, P3, P4, P6] },
      { name: "Pivot Tables", symbol: "Pt", family: "Advanced Excel", logo: "pivot", usedIn: [] },
      { name: "Lookups", symbol: "Lk", family: "Advanced Excel", logo: "lookup", usedIn: [] },
      { name: "KPI Trackers", symbol: "Kp", family: "Advanced Excel", logo: "kpi", usedIn: [ARE] },
      { name: "Automation", symbol: "Au", family: "Advanced Excel", logo: "automation", usedIn: [RA] },
    ],
  },
  {
    family: "Analytics",
    short: "Analytics",
    skills: [
      { name: "EDA", symbol: "Ed", family: "Analytics", logo: "scatter", usedIn: [] },
      { name: "Statistical Analysis", symbol: "St", family: "Analytics", logo: "bell", usedIn: [] },
      { name: "Trend Analysis", symbol: "Tr", family: "Analytics", logo: "trend", usedIn: [RA] },
      { name: "Predictive Analytics", symbol: "Pa", family: "Analytics", logo: "forecast", usedIn: [P1, RA] },
      { name: "Data Validation", symbol: "Dv", family: "Analytics", logo: "check", usedIn: [P2, P6, RA] },
    ],
  },
  {
    family: "Research",
    short: "Research",
    skills: [
      { name: "Secondary Research", symbol: "Sr", family: "Research", logo: "book", usedIn: [P1, P3, ARE] },
      { name: "Market Research", symbol: "Mr", family: "Research", logo: "globe", usedIn: [ARE] },
      { name: "Competitive Analysis", symbol: "Ca", family: "Research", logo: "versus", usedIn: [ARE] },
      { name: "Benchmarking", symbol: "Bm", family: "Research", logo: "benchmark", usedIn: [P3, P4] },
    ],
  },
  {
    family: "AI & Automation",
    short: "AI",
    skills: [
      { name: "Claude API", symbol: "Ca", family: "AI & Automation", logo: "anthropic", usedIn: [RA, P5] },
      { name: "Claude Code", symbol: "Cc", family: "AI & Automation", logo: "claude", usedIn: [RA] },
      { name: "MCP", symbol: "Mc", family: "AI & Automation", logo: "modelcontextprotocol", usedIn: [RA] },
      { name: "ChatGPT", symbol: "Gp", family: "AI & Automation", logo: "chat", usedIn: [P5] },
      { name: "Prompt Engineering", symbol: "Pe", family: "AI & Automation", logo: "prompt", usedIn: [P5] },
    ],
  },
  {
    family: "Platforms",
    short: "Platforms",
    skills: [
      { name: "Draup Platform", symbol: "Dp", family: "Platforms", logo: "taxonomy", usedIn: [P1, P2, P6] },
      { name: "Salesforce Admin", symbol: "Sf", family: "Platforms", logo: "salesforce", usedIn: [] },
      { name: "Microsoft 365", symbol: "Ms", family: "Platforms", logo: "grid", usedIn: [] },
      { name: "GitHub", symbol: "Gh", family: "Platforms", logo: "github", usedIn: [] },
      { name: "VS Code", symbol: "Vs", family: "Platforms", logo: "vscode", usedIn: [] },
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);

/* ------------------------------------------------------------------ */
/* Experience & education                                              */
/* ------------------------------------------------------------------ */

export type TimelineStop = {
  kind: "education" | "work";
  year: string;
  title: string;
  place: string;
  detail: string;
  sortKey: number;
};

export const EDUCATION: TimelineStop[] = [
  {
    kind: "education",
    year: "2017 – 2020",
    title: "B.Com",
    place: "Thiruvalluvar University College of Arts & Science",
    detail: "Undergraduate degree in Commerce.",
    sortKey: 2017,
  },
  {
    kind: "education",
    year: "2021 – 2023",
    title: "MBA (Finance)",
    place: "Annamalai University",
    detail: "Postgraduate degree with a Finance specialisation.",
    sortKey: 2021,
  },
];

export const EXPERIENCE: (TimelineStop & { points: string[]; location: string })[] = [
  {
    kind: "work",
    year: "Feb 2023 – Dec 2023",
    title: "Associate Research Executive",
    place: "Zinnov Management Consulting",
    location: "Chennai, India",
    detail:
      "Wrote 50+ market intelligence and competitive briefs across healthcare, retail, and tech, mostly built from structured secondary research.",
    points: [
      "Pulled research from multiple sources into insight decks that gave stakeholders a clearer read on industry trends and where competitors stood.",
      "Proposed changes to internal dashboards and KPI structures that made client reporting easier to act on.",
      "Handled the administrative side too — SOWs, requirements docs, and coordinating deliverables with clients.",
    ],
    sortKey: 2023.1,
  },
  {
    kind: "work",
    year: "Jan 2024 – Present",
    title: "Research Analyst, Data & Business Analytics",
    place: "Zinnov Management Consulting",
    location: "Chennai, India",
    detail:
      "Rebuilt the recurring Power BI and Google Analytics reporting process into automated dashboards, cutting manual effort by roughly 30%.",
    points: [
      "Dug into large datasets across tech, retail, healthcare, and biotech accounts to pull out market and workforce trends that fed directly into client strategy conversations.",
      "Used trend and predictive analysis on workforce data to flag emerging job functions early and size up capability gaps before they became a bigger problem for clients.",
      "Brought Claude (Anthropic API, Claude Code, MCP) into the analytics workflow — it's shaved real time off data prep and forecasting.",
      "Mentored a team of 7 analysts, tightening up how the team handles quality checks, data validation, and onboarding.",
    ],
    sortKey: 2024,
  },
];

export const TIMELINE: TimelineStop[] = [...EDUCATION, ...EXPERIENCE].sort((a, b) => a.sortKey - b.sortKey);

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectUI = "orgmap" | "taxonomy" | "buckets" | "gap" | "genai" | "levels";

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: { name: string; logo: string }[];
  github?: string;
  ui: ProjectUI;
};

export const PROJECTS: Project[] = [
  {
    id: "role-mapping-coe",
    index: "01",
    title: "Role Mapping Center of Excellence",
    kicker: "Fortune 500 Clients (Pfizer, IBM, Eaton)",
    description:
      "Built out a role mapping framework spanning 150+ job functions, connecting legacy org structures to the technical roles clients were actually hiring for. Used predictive market analytics to catch skill volatility trends early; the resulting hiring-strategy shifts cut time-to-fill for critical engineering and R&D roles by 15%.",
    features: [
      "150+ job functions mapped",
      "Legacy org → technical roles",
      "Skill volatility trends caught early",
      "15% shorter time-to-fill",
    ],
    tech: [
      { name: "Advanced Excel", logo: "sheet" },
      { name: "Draup Platform", logo: "taxonomy" },
      { name: "Predictive Analytics", logo: "forecast" },
      { name: "Secondary Research", logo: "book" },
    ],
    ui: "orgmap",
  },
  {
    id: "nab-taxonomy",
    index: "02",
    title: "Job Role Mapping to Draup Platform Taxonomy",
    kicker: "Banking Client (NAB)",
    description:
      "Mapped and validated 150+ client job roles against the platform's role taxonomy, tightening up how workforce data aligned across the board. Put together a repeatable mapping framework that standardized reporting and fed into headcount and hiring decisions.",
    features: [
      "150+ job roles validated",
      "Repeatable mapping framework",
      "Standardized reporting",
      "Fed headcount & hiring decisions",
    ],
    tech: [
      { name: "Draup Platform", logo: "taxonomy" },
      { name: "Advanced Excel", logo: "sheet" },
      { name: "Data Validation", logo: "check" },
      { name: "Taxonomy Design", logo: "tree" },
    ],
    ui: "taxonomy",
  },
  {
    id: "skills-classification",
    index: "03",
    title: "Skills Classification",
    kicker: "Emerging, Core & Traditional Skills",
    description:
      "Sorted 500+ skills across client job roles into Emerging, Core, and Traditional buckets, building a taxonomy that actually reflected where the industry was heading. Gave L&D and HR teams a way to prioritize upskilling spend based on evidence instead of guesswork.",
    features: [
      "500+ skills classified",
      "Emerging · Core · Traditional",
      "Evidence-based upskilling",
      "Built for L&D and HR teams",
    ],
    tech: [
      { name: "Advanced Excel", logo: "sheet" },
      { name: "Skills Taxonomy", logo: "tree" },
      { name: "Secondary Research", logo: "book" },
      { name: "Benchmarking", logo: "benchmark" },
    ],
    ui: "buckets",
  },
  {
    id: "skills-gap",
    index: "04",
    title: "Skills Gap Analysis",
    kicker: "Leading Roles vs. Ahead-of-Transition Roles",
    description:
      "Built benchmarking models comparing role families to pinpoint exactly where capability gaps were widest. The resulting gap analysis fed into talent strategy and succession planning conversations.",
    features: [
      "Role-family benchmarking models",
      "Widest capability gaps pinpointed",
      "Talent strategy input",
      "Succession planning input",
    ],
    tech: [
      { name: "Advanced Excel", logo: "sheet" },
      { name: "Comparative Benchmarking", logo: "benchmark" },
      { name: "Data Analysis", logo: "scatter" },
    ],
    ui: "gap",
  },
  {
    id: "genai-recommendation",
    index: "05",
    title: "GenAI Tool & Skills Recommendation",
    kicker: "Based on Role Workloads",
    description:
      "Broke down workload and task composition across job roles to spot where GenAI adoption would actually move the needle. Delivered a readiness assessment that quantified potential automation gains and fed into the client's AI transformation roadmap.",
    features: [
      "Workload & task breakdown",
      "GenAI adoption hotspots",
      "Readiness assessment",
      "AI transformation roadmap input",
    ],
    tech: [
      { name: "Claude AI", logo: "claude" },
      { name: "ChatGPT", logo: "chat" },
      { name: "Prompt Engineering", logo: "prompt" },
      { name: "Workload Analysis", logo: "kpi" },
    ],
    ui: "genai",
  },
  {
    id: "aker-skills-architecture",
    index: "06",
    title: "Skills Architecture & Job Leveling",
    kicker: "Aker Solutions",
    description:
      "Designed a discipline-wise skills and job architecture framework, mapping engineering roles across band levels (E–K) to core, emerging and digital skills using the Draup Skills Library. Defined band-level job descriptions and competency requirements to standardize job leveling.",

    features: [
      "Discipline-wise job architecture",
      "Band levels E–K",
      "Core, emerging & digital skills",
      "Validated workbooks for HR & L&D",
    ],
    tech: [
      { name: "Advanced Excel", logo: "sheet" },
      { name: "Draup Platform", logo: "taxonomy" },
      { name: "Skills Taxonomy", logo: "tree" },
      { name: "Competency Mapping", logo: "pivot" },
    ],
    ui: "levels",
  },
];

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

export type Certification = { title: string; issuer: string; url?: string };

export const CERTIFICATIONS: Certification[] = [
  { title: "Python for Data Analytics", issuer: "Simplilearn" },
  { title: "SQL for Data Analytics", issuer: "Simplilearn" },
  { title: "Data Visualisation with Power BI", issuer: "Great Learning" },
  { title: "Python Data Handling Bootcamp", issuer: "Alex The Analyst" },
  { title: "Business Analysis Basics", issuer: "Simplilearn" },
  { title: "Claude Code in Action", issuer: "Anthropic" },
  { title: "Claude with Anthropic API", issuer: "Anthropic" },
  { title: "Introduction to Skills Agent", issuer: "Anthropic" },
  { title: "Introduction to Model Context Protocol (MCP)", issuer: "Anthropic" },
];

/* ------------------------------------------------------------------ */
/* Achievements — only figures stated in the résumé                     */
/* ------------------------------------------------------------------ */

export type Achievement = {
  label: string;
  caption: string;
  detail: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    label: "Go That Extra Mile Award",
    caption: "Zinnov Management Consulting",
    detail: "Recognized for exceptional contribution supporting a 15% increase in client satisfaction scores.",
    value: 15,
    suffix: "%",
    icon: "award",
  },
  {
    label: "Manual effort cut",
    caption: "Automated Power BI & GA reporting",
    detail: "Recurring reporting rebuilt into automated dashboards — roughly 30% less manual effort.",
    value: 30,
    prefix: "~",
    suffix: "%",
    icon: "automation",
  },
  {
    label: "Shorter time-to-fill",
    caption: "Role Mapping Center of Excellence",
    detail: "For critical engineering and R&D roles, after hiring-strategy shifts.",
    value: 15,
    suffix: "%",
    icon: "clock",
  },
  {
    label: "Job functions mapped",
    caption: "Fortune 500 clients · Pfizer, IBM, Eaton",
    detail: "Legacy org structures connected to the technical roles clients were hiring for.",
    value: 150,
    suffix: "+",
    icon: "taxonomy",
  },
  {
    label: "Skills classified",
    caption: "Emerging · Core · Traditional",
    detail: "A taxonomy that reflected where the industry was heading.",
    value: 500,
    suffix: "+",
    icon: "tree",
  },
  {
    label: "Market intelligence briefs",
    caption: "Healthcare, retail & tech",
    detail: "Mostly built from structured secondary research.",
    value: 50,
    suffix: "+",
    icon: "book",
  },
  {
    label: "Analysts mentored",
    caption: "Quality checks · validation · onboarding",
    detail: "Tightened up how the team handles quality checks, data validation, and onboarding.",
    value: 7,
    icon: "people",
  },
  {
    label: "Years at Zinnov",
    caption: "Feb 2023 – Present",
    detail: "Across technology, healthcare, retail, and biotechnology accounts.",
    value: 3,
    suffix: "+",
    icon: "calendar",
  },
];

/* ------------------------------------------------------------------ */
/* ID card content (all from the résumé)                               */
/* ------------------------------------------------------------------ */

export const ID_CARD = {
  band: "ANALYST ID",
  rows: [
    { k: "Dept.", v: "Data & Business Analytics" },
    { k: "Based", v: "Chennai, India" },
    { k: "Since", v: "2023" },
  ],
  back: [
    "Data & Research Analyst",
    "MBA (Finance) · Annamalai University",
    "Just over three years at Zinnov",
    "Role Mapping CoE · Aker Skills Architecture",
    "Go That Extra Mile Award",
  ],
};
