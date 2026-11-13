// Photos for the "memory reel" in the Beyond section.
// To add one: put the file in /public/images and add a line here.
export type Memory = { src: string; caption: string; tag: "badminton" | "academics" };

export const memories: Memory[] = [
  { src: "/images/badminton-1.jpg", caption: "Court day in my Computer Science jersey", tag: "badminton" },
  { src: "/images/badinton-3.jpg", caption: "Mixed Doubles Champion, SportsFest 2018–19 · Girls' Doubles 2nd Runner-Up, Intercampus 2019", tag: "badminton" },
  { src: "/images/acads-2.jpg", caption: "Dean's List certificates of merit, UST CICS", tag: "academics" },
  { src: "/images/badminton-2.jpg", caption: "With the OLFU team after a match", tag: "badminton" },
  { src: "/images/acads-1.jpg", caption: "Years of honor certificates from junior and senior high", tag: "academics" },
];
