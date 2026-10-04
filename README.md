# Sivasankar T — Talking-Video Portfolio

A calm, one-page portfolio. A looping self-introduction video plays in the hero, and the sections below it are built only from the résumé. The palette is paper, ink and grays, with one serif italic word per heading and its own small animation in every section.

**Stack:** Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · Lenis (smooth scroll, the only animation dependency). Fonts are self-hosted with `next/font/local`. No GSAP, no three.js, no runtime CDNs.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm start          # preview the production build (serves ./out)
```

Node 18.18+ (Node 22 recommended).

## Sections

| # | Section | Component | Interaction |
|---|---------|-----------|-------------|
| — | Navigation | `components/Navigation.tsx` | Initials mark goes solid ink after 40 px and spins on hover · frosted glass pill once you scroll · sliding active indicator (IntersectionObserver `-45% 0px -50% 0px`) · 2 px scroll-progress bar · mobile overlay with a clip-path reveal, Esc to close and scroll lock |
| — | Hero | `components/hero/Hero.tsx` | Video with `mix-blend-mode: multiply` over a ghost first name · tries to play with sound, falls back to muted, and unlocks sound on the first gesture · pauses below 35 % visibility · ▶ / ❚❚ sound button with a ping ring while sound is blocked |
| 01 | About | `sections/About.tsx`, `ui/IdCard.tsx` | ID card on a lanyard: damped pendulum driven by pointer velocity, idle sway, 3D flip (hover / tap / Enter / Space) |
| 02 | Skills | `sections/Skills.tsx`, `ui/TechLogo.tsx` | Periodic table (8 columns, 4 on mobile) with a diagonal wave entrance, family filter chips, and a sticky inspector with a 150 px logo |
| 03 | Work | `sections/Work.tsx`, `ui/MiniUI.tsx` | Expanding accordion (flex 8 vs. slim spines). The grayscale mini-UI wipes in with clip-path and is labelled "Illustrative UI" |
| 04 | Certifications | `sections/Certifications.tsx` | Sticky heading · ink flood from left to right on hover / focus |
| 05 | Experience | `sections/Experience.tsx` | Education and work on one timeline. The spine draws with scroll progress and each stop lights up as the spine reaches it |
| 06 | Achievements | `sections/Achievements.tsx` | Pinned horizontal gallery (sticky, height = 100svh + travel). Numbers count up with easeOutQuart; the centred card lifts |
| 07 | Contact + footer | `sections/Contact.tsx` | Letters hop under the cursor · Copy chip with `aria-live` · spinning "say hello" badge |

All text lives in **`src/lib/data.ts`**. Components only read from it.

## Content rules

- Every word, number and date comes from `Sivasankar_T_Resume_Updated.pdf`. Nothing is invented: no testimonials, no screenshots, no metrics that aren't in the résumé.
- The résumé has **no GitHub link**. `PROFILE.github` (github.com/SIVASANKAR-007) was supplied by the owner and is marked as such in `data.ts`. Delete it to hide every GitHub button.
- Projects have no repository links, so no "View on GitHub" buttons appear. Add `github: "https://…"` to a project in `data.ts` and the button shows up.
- `PROFILE.introTranscript` is empty. Paste the exact words spoken in the intro video and a "Read the intro transcript" disclosure appears under the hero.
- The ID card shows Dept. / Based / Since, all taken from the résumé, instead of an invented ID number.

## Rebuilding the hero video

`scripts/build-hero-assets.py` needs ffmpeg/ffprobe, Python 3.9+, numpy and Pillow (fontTools is optional; it's only used for the OG text font).

```bash
pip install numpy pillow
python scripts/build-hero-assets.py --video path/to/intro.mp4 --photo path/to/portrait.png
# optional: --crop 576:720:342:0  --loop 10  --fade 0.5  --width 768
```

What it does:

1. **Detects the person.** It takes the union bounding box of non-backdrop pixels across 12 frames, then makes a crop centred on the person at 768:960. For this video that is `crop=576:720:342:0`. You can override it with `--crop`.
2. **Scales** the crop to 768×960 and **whitens** the backdrop with `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98`, so it disappears under `multiply`.
3. **Makes a seamless loop.** It plays `clip[X..L]` and cross-fades (ffmpeg `xfade`) into `clip[0..X]` over the last X = 0.5 s. The output starts and ends on the same frame. The audio gets the same treatment in numpy with an equal-power, sample-accurate cross-fade (no `acrossfade`), so there is no click. Nothing is retimed, so lip-sync holds.
4. **Exports** `public/hero/hero.mp4` (H.264 yuv420p CRF 24 `-preset slow`, AAC 96k, `+faststart`), `hero.webm` (VP9 CRF 36, Opus 80k) and `poster.webp` (the first frame, which is also the LCP image).
5. **Stills:** `public/portrait-bust.webp` (480×600 head-to-shirt crop, taken from `--photo` or else the sharpest video frame) and `public/og.jpg` (1200×630).

## Deploying to GitHub Pages

`next.config.ts` uses `output: "export"`, and `.github/workflows/deploy.yml` builds and publishes `out/`.

1. Push this folder to `SIVASANKAR-007/sivaTheAnalyst1.github.io`. It replaces the old HTML5 UP site, so keep a branch or a backup of the old files if you want them.
2. In the repo, open **Settings → Pages → Source** and choose **GitHub Actions**.
3. The workflow sets `NEXT_PUBLIC_BASE_PATH` for you. The repo isn't named `sivasankar-007.github.io`, so the site will be served at `https://sivasankar-007.github.io/sivaTheAnalyst1.github.io/`.

For a local build with a sub-path: `NEXT_PUBLIC_BASE_PATH=/repo-name npm run build`.

## Project structure

```
src/app/            layout.tsx (metadata, OG, fonts, themeColor #f4f2ee) · page.tsx · globals.css · icon.svg
src/components/     App.tsx · Navigation.tsx · hero/Hero.tsx · sections/*.tsx · ui/*.tsx
src/lib/            data.ts · hooks.ts (useInView, useScrollProgress, prefersReducedMotion) · scroll.tsx (Lenis + scrollToTarget) · asset.ts
src/fonts/          Inter Tight (variable) · Instrument Serif (regular + italic) · JetBrains Mono (variable) — woff2, latin subset
public/hero/        hero.mp4 · hero.webm · poster.webp
public/logos/       devicon/ + simple-icons/ SVGs with their LICENSE files
public/             portrait-bust.webp · og.jpg · Sivasankar_T_Resume.pdf
scripts/            build-hero-assets.py · og-fonts/
```

## Quality checks (last run)

- `npm run build`, `next lint` and `tsc --noEmit` all pass with no errors or warnings. First-load JS is **133 kB**.
- Playwright at 1440×900 and 390×844: `scrollWidth === innerWidth` and no console errors.
- Behaviour checks:
  - Autoplay falls back to muted, and the first gesture unlocks sound.
  - The ▶ / ❚❚ button toggles sound.
  - The video pauses when you scroll away and resumes when you come back.
  - The ID card flips with Enter and with a tap.
  - The mobile menu opens, locks scroll and closes on Esc.
- Lighthouse, served with gzip:
  - Mobile: Performance 94–96, Accessibility 100, Best Practices 100, SEO 100.
  - Desktop: Performance 100.
- `prefers-reduced-motion` turns off Lenis, the decorative animations, the pendulum and video autoplay. The video still plays from the button.

## Credits & licences

- **devicon** (MIT): Python, pandas, Matplotlib, GitHub, VS Code, Salesforce. See `public/logos/devicon/LICENSE`.
- **simple-icons** (CC0 1.0): Claude, Anthropic, Model Context Protocol, Google Analytics. See `public/logos/simple-icons/LICENSE.md` and `DISCLAIMER.md`. Brand marks remain the property of their owners and are used here only to name the tools.
- Power BI, Tableau, Excel, ChatGPT, Microsoft 365, SQL and the Draup Platform have no openly licensed marks in these sets, so they use custom line icons. The inspector labels them "Line icon · no official mark used".
- Fonts, all under the SIL Open Font License 1.1, installed via @fontsource: Inter Tight (Tobias Whetton), Instrument Serif (Instrument), JetBrains Mono (JetBrains).
