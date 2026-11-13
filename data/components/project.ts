// Your projects. Add a new one by copying a block.
export type ProjectId = "pp" | "ve" | "nv" | "ag";

export type Project = {
  id: ProjectId;
  file: string; // fake file name shown in the window title bar
  name: string;
  date: string;
  role: string;
  tags: string[];
  bullets: string[];
  links: { label: string; href: string }[];
  status?: string; // shown instead of a live-site button (e.g. "coming soon")
  logo?: string; // small logo shown inside the window once it opens
  logoBg?: string; // background of the little logo box (dark for light logos)
  shots: { src: string; label: string }[]; // screenshots for the story page
  shotsNote?: string; // small note shown with the screenshots
  fit: "cover" | "contain"; // cover = fill the frame, contain = show the whole screenshot
  // window look
  sky: string;
  shutters: [string, string, string];
};

export const projects: Project[] = [
  {
    id: "pp",
    file: "petalpace.app",
    name: "Petalpace",
    date: "Nov 2026",
    role: "Team of 2 · Design, full-stack, QA",
    tags: ["React", "TypeScript", "Node.js", "SQLite", "nginx", "Vultr", "Figma"],
    bullets: [
      "Designed in Figma, then built and deployed a planner with accounts, email verification, deadlines, file attachments, a calendar and a progress heatmap.",
      "Built shared tasks with delegated items, statuses and four access levels enforced on the server, plus real-time sync and email reminders.",
      "Tested responsiveness across phones, tablets and desktop and tracked bugs in GitHub Issues.",
      "Deployed on a Vultr Ubuntu VPS with nginx, HTTPS, daily backups and key-only SSH, using a free DuckDNS domain, and covered by 100+ server-side automated tests (Node test runner).",
    ],
    links: [{ label: "Live site", href: "https://petalpace.duckdns.org" }],
    logo: "/images/petalpace-logo.png",
    shots: [{ src: "/images/petalpace-overview.png", label: "Landing page" }],
    fit: "cover",
    sky: "linear-gradient(180deg,#F9B8DA,#E6A9E6 45%,#C99BF5)",
    shutters: ["#BB6BDC", "#9E52C8", "#C987E6"],
  },
  {
    id: "ve",
    file: "veritas.py",
    name: "VERITAS",
    date: "2026 – now",
    role: "Undergraduate thesis",
    tags: ["Python", "PyTorch", "Next.js", "Figma"],
    bullets: [
      "Researching a multi-task model (EfficientNet-B7 with multi-stream features and ASPP segmentation) that detects manipulated faces and highlights the tampered regions.",
      "Ran and compared ablation experiments on the OpenForensics dataset in Kaggle notebooks.",
      "Designed the web app in Figma: upload an image, then see a verdict and a tamper mask for each face.",
    ],
    links: [],
    status: "Thesis in progress — live site coming soon",
    logo: "/images/veritas-icon.png",
    logoBg: "#111111",
    shots: [
      { src: "/images/veritas-overview.png", label: "Overview" },
      { src: "/images/veritas-analyze.png", label: "Analyze an image" },
      { src: "/images/veritas-image-processing.png", label: "Image processing" },
      { src: "/images/veritas-results.png", label: "Detection results" },
      { src: "/images/veritas-report.png", label: "Report" },
    ],
    fit: "cover",
    sky: "linear-gradient(180deg,#24135E,#5B3FA8 55%,#A988E6)",
    shutters: ["#8F7BE0", "#7462C9", "#AFA0EE"],
  },
  {
    id: "nv",
    file: "novateur_tickets.tsx",
    name: "Novateur IT Ticketing",
    date: "Sep 2025 – Mar 2026",
    role: "UI/UX Designer & Frontend Developer · real client",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
    bullets: [
      "Designed the UI/UX in Figma and built a responsive ticketing interface focused on easy navigation for 100+ employees.",
      "Contributed to backend development and QA testing before client handover.",
    ],
    links: [],
    status: "Private client system — not publicly hosted",
    shots: [
      { src: "/images/novateur-manage-tickets.png", label: "Manage Tickets" },
      { src: "/images/novateur-view-ticket.png", label: "Ticket details & assignment" },
      { src: "/images/novateur-notifications.png", label: "Notifications" },
      { src: "/images/novateur-user-accounts.png", label: "Manage User Accounts" },
      { src: "/images/novateur-add-user.png", label: "Add a new user" },
      { src: "/images/novateur-edit-user.png", label: "Edit user details" },
      { src: "/images/novateur-audit-logs-general.png", label: "Audit Logs — all activity" },
      { src: "/images/novateur-audit-logs.png", label: "Audit Logs — one user" },
      { src: "/images/novateur-settings.png", label: "Settings — profile" },
    ],
    shotsNote: "These are my Figma designs for the IT Department dashboard only. Some screens were refined further in the final system.",
    fit: "contain",
    sky: "linear-gradient(180deg,#8FCDEF,#C9E7F8 50%,#F1E6FC)",
    shutters: ["#6FB6E0", "#5498C6", "#9CCDEB"],
  },
  {
    id: "ag",
    file: "agila_studios.html",
    name: "Agila Studios Redesign",
    date: "Sep 2026",
    role: "Team of 3",
    tags: ["Next.js", "TypeScript", "Vercel", "Figma"],
    bullets: [
      "Designed the About page in Figma and built the landing page with reusable section components.",
      "Worked through feature branches and pull requests.",
      "Ran QA on responsiveness across screen sizes, then documented and fixed the issues through GitHub.",
    ],
    links: [{ label: "Live site", href: "https://agila-studios.ejecka06.workers.dev" }],
    shots: [{ src: "/images/agila-overview.png", label: "Landing page" }],
    fit: "cover",
    sky: "linear-gradient(180deg,#FFC2A3,#F9AFC8 50%,#D6A6EE)",
    shutters: ["#F08FB8", "#D873A0", "#F6B0CE"],
  },
];
