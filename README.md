# Mikyla Caras — Portfolio

A storybook-themed personal portfolio: pastel, a little magical, and still professional.
Built with **Next.js**, **React**, **TypeScript** and **Tailwind CSS**.

**Live site:** _add your Vercel link here_

## Features

- **Animated intro** — butterflies swarm in, a wishing-star arc draws itself and the name writes itself in; **Enter** opens the site with a growing circle
- **Navbar** with a shimmering border, a hanging star charm and a highlight bubble that follows the section you're reading
- **About** — click the rose to make it bloom and open the "about me" window
- **Projects** — a little street of windows whose shutters swing open; each project has a story page and a zoomable screenshot gallery
- **Skills** — a clicky pastel keyboard that also works with your real keyboard (the space bar is a surprise)
- **Beyond the screen** — flip cards plus a "memory reel" of polaroids on a fairy-light string
- **Contact** — an envelope that opens into a letter with contact links
- Cursor sparkles, wandering butterflies, scroll progress bar and sound effects with a mute toggle
- Fully responsive, and respects the "reduce motion" accessibility setting

## Tech stack

| | |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript, React |
| Styling | Tailwind CSS + custom CSS animations |
| Fonts | Shrikhand, Great Vibes, Fredoka, DM Sans (via `next/font`) |
| Images | `next/image` |
| Sound | Web Audio API |
| Hosting | Vercel |

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project structure

```
app/            layout, page, global styles (portfolio.css), favicon
components/
  intro/        opening screen
  layout/       navbar, footer
  sections/     hero, about, work, skills, beyond, leadership, contact
  ui/           reusable pieces (rose, project window, gallery, keys, flip cards…)
  effects/      butterflies, cursor trail, scroll reveal
data/components/  all the text: profile, projects, skills, highlights, gallery
lib/            butterfly engine, sounds, helpers
hooks/          small React hooks
public/         images, CV
```

## Editing content

All the words and links live in `data/components/`:

- `profile.ts` — name, intro, about text, contact links, leadership, certifications
- `project.ts` — projects, their screenshots and links
- `skills.ts` — the keyboard keys and their messages
- `sports.ts` — the "beyond the screen" cards
- `gallery.ts` — photos in the memory reel

## Contact

- Email: carasmikyla02@gmail.com
- LinkedIn: https://linkedin.com/in/mikyla-caras-2750b937b
- GitHub: https://github.com/ylamik

---

Designed & built by Mikyla Caras · 2026
