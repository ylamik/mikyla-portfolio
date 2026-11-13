// "Beyond the screen" cards. Front = icon + title, back = a line OR a short list.
export type Highlight = { id: "badminton" | "academics"; name: string; line?: string; items?: string[] };

export const highlights: Highlight[] = [
  {
    id: "badminton",
    name: "Badminton",
    items: [
      "Champion, High School Badminton — SportsFest 2018–2019",
      "2nd Runner-Up, Girls Badminton — Intercampus 2019",
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
      "Best in Math & Best in Science, JHS",
      "MTAP math competition participant",
    ],
  },
];
