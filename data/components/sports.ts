// "Beyond the screen" cards. Front = icon + title, back = a line OR a short list.
export type Highlight = { id: "badminton" | "academics"; name: string; line?: string; items?: string[] };

export const highlights: Highlight[] = [
  {
    id: "badminton",
    name: "Badminton",
    items: [
      "Champion, Mixed Doubles — UST CS Week 2025",
      "Champion, Mixed Doubles — HS SportsFest 2018–2019",
      "2nd Runner-Up, Girls' Doubles — Intercampus 2019",
      "Still my favorite way to recharge",
    ],
  },
  {
    id: "academics",
    name: "Academic Achiever",
    items: [
      "Dean's Lister, UST — 4 semesters (1st to 3rd year)",
      "With Highest Honors, Senior High School",
      "Honor student all through Junior High",
      "Best in Math, JHS",
      "MTAP math competition participant",
    ],
  },
];
