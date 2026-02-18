# CLAUDE.md — Fiber Guys Website

## Project Overview
Build an **Awwwards-level** marketing website for **Fiber Guys**, a fiber construction company.

**Services offered:**
1. Fiber placement in conduit using jetters (long-run production placement)
2. Fiber splicing (precision splicing with organized trays and closeout-ready documentation)

**Primary business goal:** Generate qualified inbound leads via "Request a Crew" form.
**Secondary goal:** Prove credibility and craftsmanship through an immersive photo gallery.

---

## Design Direction — "Industrial Signal" (Locked)

### Concept
The entire UI is informed by the idea of **signal traveling through infrastructure** — subtle routed fiber-line motifs, mechanical precision in motion, and industrial confidence in typography. This is NOT a SaaS template. It should feel like a high-end creative studio built a site for a construction company.

### Aesthetic: Industrial / Bold (Safety Orange)
- **Base:** Near-black charcoal backgrounds + warm off-white text
- **Accent:** Safety Orange — the ONLY accent color. Used for CTAs, hover states, focus rings, signal-line motifs, and interactive elements
- **Texture:** Subtle film grain overlay (5-8% opacity), soft gradient "auras" at very low opacity
- **Typography:** Big, bold, confident headlines with tight tracking. Body text clean and readable. Captions small, uppercase, spaced — like a spec sheet
- **Layout:** 12-column grid, generous whitespace, sections feel like chapters
- **Motion:** Smooth, precise, mechanical — never bouncy or playful. Think engineered, not fun

### Color Tokens
```
/* Base */
--bg:          #0B0D10
--bg-2:        #10141A
--text:        #F5F1E8
--muted:       #A9B0BA
--line:        rgba(245, 241, 232, 0.12)

/* Accent — Safety Orange */
--orange:      #FF5A1F
--orange-hard: #FF3D00
--orange-soft: rgba(255, 90, 31, 0.18)

/* Logo support tones (auras/backgrounds ONLY, never as UI accent) */
--deep-navy:   #2A3349
--mid-blue:    #4E6393
--steel-blue:  #8FB7D8
```

### Typography
- **Headings:** Choose a bold, engineered display font. Do NOT use Space Grotesk or Inter for headings — find something with more character (e.g., Instrument Sans, Manrope, Outfit, or similar). Must feel industrial and confident.
- **Body:** Clean sans-serif for readability (Plus Jakarta Sans, DM Sans, or similar)
- **Captions/Labels:** Uppercase, wide letter-spacing (0.1–0.12em), small size

### Logo Rules
- The Fiber Guys logo has a cable/loop mark with navy/blue tones — do NOT recolor it to orange
- Use white version of full logo on dark nav/footer backgrounds
- Use mark-only for mobile nav, favicon, and loading states
- Brand assets live in `/public/brand/` — if files don't exist yet, wire paths to placeholder filenames so swapping is trivial later

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15+ (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion (motion) |
| Images | next/image with blur placeholders |
| Fonts | next/font/google |
| Icons | lucide-react (optional, keep minimal) |
| Content | JSON files in `/content/` (no CMS) |

### Architecture Notes
- Use `template.tsx` in the app directory for page transition animations (re-mounts on navigation, unlike layout.tsx)
- All animation components must be Client Components (`"use client"`)
- Server Components by default for all pages — only add `"use client"` where interactivity is needed
- Route Handlers for the form API endpoint (`/api/lead/route.ts`)
- Use `next/image` with explicit width/height or fill + aspect-ratio containers to prevent CLS
- Lazy load gallery images below the fold
- Respect `prefers-reduced-motion` everywhere — wrap motion in a hook that checks this

---

## Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Story + proof + gallery preview + conversion |
| `/services` | Services | Detailed service descriptions |
| `/gallery` | Gallery | Immersive photo gallery (the "wow" factor) |
| `/request` | Request a Crew | Lead generation form |
| `/about` | About | Company story, crew, process |
| `/contact` | Contact | Simple contact info + service area |
| `/thank-you` | Thank You | Post-submission confirmation |

---

## Home Page Sections (in order)

1. **Cinematic Hero** — Full-bleed video loop (or gradient fallback), H1 "Jet. Splice. Deliver.", primary CTA "Request a Crew", secondary "View Gallery". Signature: animated signal-line that draws across on load.
2. **Proof Strip** — 3-4 credibility bullets (e.g., "Production-focused", "Clean documentation", "Field-ready crews")
3. **Services** — 2 large premium cards (Jetting + Splicing) with brief descriptions and "Learn More" links
4. **Process** — 5 steps: Scope → Mobilize → Place/Splice → Test → Closeout (simple, credible, conversion-friendly)
5. **Gallery Teaser** — Best 8-12 shots in a mini grid with "View Full Gallery" CTA
6. **Big CTA Block** — "Send prints. Get a schedule." with Request a Crew button

---

## Gallery Requirements (Non-Negotiable)

The gallery must feel like an **experience**, not a photo dump. This is the Awwwards differentiator.

### Layout
- Responsive masonry grid (CSS columns or a lightweight masonry approach — avoid heavy libraries)
- Filter chips above grid: Jetting / Splicing / Crew / Equipment / Closeout
- Smooth filter transitions (AnimatePresence for items entering/leaving)

### Hover States
- Caption (title + location) fades in on hover
- Background dims slightly
- Subtle scale or lift

### Lightbox
- Opens from thumbnail with smooth shared-element-like transition (use Framer Motion `layoutId`)
- Keyboard navigation: ← → arrows, Esc to close
- Swipe support on mobile (touch gesture detection)
- Caption panel in lightbox: title, category, location, 1-line description
- Smooth open/close transitions — no jarring cuts

### Custom Cursor (Gallery Only)
- Inside the gallery section, replace default cursor with a custom "DRAG" indicator
- Optional: subtle cursor trail effect restricted to gallery bounds
- Outside gallery, cursor returns to normal
- Must gracefully degrade (no cursor changes on touch devices)

### Performance
- All images use `next/image` with responsive `sizes`
- Blur placeholder (blurDataURL) for each image
- Lazy load everything below initial viewport
- Gallery content sourced from `/content/gallery.json`

---

## Request a Crew Form (Non-Negotiable)

### Fields
| Section | Field | Type | Required |
|---------|-------|------|----------|
| Contact | Company name | text | yes |
| Contact | Contact name | text | yes |
| Contact | Email | email | yes |
| Contact | Phone | tel | yes |
| Job | City / State | text | yes |
| Job | Service needed | select: Jetting / Splicing / Both | yes |
| Job | Target start date | date | no |
| Job | Estimated footage | text | no |
| Job | Notes / constraints | textarea | no |
| Uploads | Prints / scope files | file (multi, drag/drop) | no |
| Spam | Honeypot | hidden text field | — |

### UX
- Premium, sectioned layout — not a boring stacked form
- Drag/drop file upload area with file name previews
- Client-side validation with clear, inline error messages
- Loading state on submit button
- Success → redirect to `/thank-you`

### Backend (`/api/lead/route.ts`)
- Accept multipart form data
- Validate required fields server-side
- Honeypot check (reject if filled)
- Rate limiting stub (in-memory for dev, clearly abstracted for production swap)
- Return success/error JSON
- Architecture should make it easy to later plug in: email (SendGrid/Resend), file storage (S3/R2), database (Supabase/Postgres)
- For now, log submissions to console + return success

---

## Motion System

### Principles
- Motion should feel **mechanical and precise** — ease curves should be smooth but not springy
- Use `ease: [0.25, 0.1, 0.25, 1]` or similar custom cubic-bezier as default
- Every animation must respect `prefers-reduced-motion` (create a `useReducedMotion` wrapper)

### Required Animations
- **Scroll reveals:** Staggered fade-up on sections as they enter viewport (`whileInView`)
- **Page transitions:** Use `template.tsx` with a signal-line sweep motif (thin orange line crosses screen during transition)
- **Magnetic buttons:** Primary CTAs have subtle "magnetic pull" on mouse hover (cursor attraction effect)
- **Hero signal line:** On initial load, an animated SVG "fiber path" draws across the hero
- **Gallery:** Smooth filter transitions, lightbox open/close, hover states
- **Nav indicator:** Active link has a sliding underline that moves between items

### Performance
- Never animate layout properties (width, height) — use transforms and opacity
- Use `will-change` sparingly and only on elements that are about to animate
- Keep animations under 500ms for micro-interactions, 600-800ms for page transitions

---

## Performance & Accessibility Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |

### Accessibility Checklist
- All images have meaningful alt text
- Gallery lightbox is keyboard navigable and focus-trapped
- Form inputs have associated labels
- Focus rings visible on all interactive elements (styled with orange accent)
- Color contrast meets WCAG AA minimum
- `prefers-reduced-motion` disables all non-essential animation
- Semantic HTML throughout (nav, main, section, article, etc.)
- Proper heading hierarchy (single h1 per page)

---

## SEO

Each page needs:
- Unique `<title>` and `<meta name="description">`
- Open Graph tags (title, description, image)
- Structured data where appropriate (Organization, LocalBusiness)
- Canonical URLs
- Sitemap generation

Wire all metadata using Next.js `generateMetadata` or static `metadata` exports.

---

## Content

### Copy Tone
Minimal, confident, field-credible. No cheesy marketing language. Write like a foreman who also happens to have good taste.

### Hero Headlines (pick best fit)
- "Jet. Splice. Deliver."
- "Fiber placed fast. Spliced clean."
- "From conduit to clean light."

### Service Descriptions
- **Fiber Jetting:** "High-output placement built for long runs and consistent results."
- **Fiber Splicing:** "Clean trays, clear labeling, and documentation that's ready for closeout."

### Gallery Content
Create `/content/gallery.json` with ~25 entries, each containing:
```json
{
  "id": "string",
  "title": "string",
  "category": "jetting | splicing | crew | equipment | closeout",
  "location": "City, ST",
  "description": "One sentence describing the shot",
  "src": "/images/gallery/filename.jpg",
  "blurDataURL": "placeholder or empty string"
}
```

Use realistic titles and descriptions. Images will be placeholder paths — Daniel will swap in real photos later.

---

## File Structure (Expected)

```
fiber-guys/
├── CLAUDE.md
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, nav, footer)
│   ├── template.tsx            # Page transition wrapper
│   ├── page.tsx                # Home
│   ├── services/page.tsx
│   ├── gallery/page.tsx
│   ├── request/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── thank-you/page.tsx
│   ├── api/
│   │   └── lead/route.ts      # Form submission handler
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   └── PageTransition.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── ProofStrip.tsx
│   │   ├── ServicesPreview.tsx
│   │   ├── Process.tsx
│   │   ├── GalleryTeaser.tsx
│   │   └── CTABlock.tsx
│   ├── gallery/
│   │   ├── MasonryGrid.tsx
│   │   ├── FilterChips.tsx
│   │   ├── Lightbox.tsx
│   │   └── GalleryCursor.tsx
│   ├── forms/
│   │   ├── RequestForm.tsx
│   │   ├── FileUpload.tsx
│   │   └── ContactForm.tsx
│   └── ui/
│       ├── MagneticButton.tsx
│       ├── ScrollReveal.tsx
│       ├── SignalLine.tsx
│       └── GrainOverlay.tsx
├── hooks/
│   ├── useReducedMotion.ts
│   ├── useMagneticHover.ts
│   └── useGalleryCursor.ts
├── content/
│   ├── gallery.json
│   └── services.json
├── public/
│   ├── brand/                  # Logo assets, favicon, OG image
│   ├── images/
│   │   └── gallery/            # Gallery photos (placeholder paths)
│   └── video/
│       └── hero-loop.mp4       # Hero video (placeholder)
├── lib/
│   └── utils.ts                # Shared utilities
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Quality Gates (Check Before Completing)

Before considering the build complete, verify:

- [ ] `npm run build` passes with zero errors
- [ ] TypeScript strict mode — no type errors
- [ ] All 7 pages render correctly
- [ ] Nav works on all pages, mobile responsive
- [ ] Gallery: masonry renders, filters work, lightbox opens/closes with keyboard + swipe
- [ ] Gallery: custom cursor appears only inside gallery bounds
- [ ] Request form: validation works, honeypot present, API route responds
- [ ] Hero: signal-line animation plays on load
- [ ] Scroll reveals work on home page sections
- [ ] `prefers-reduced-motion` disables animations
- [ ] No Lighthouse accessibility violations
- [ ] All images have alt text and defined dimensions
- [ ] OG meta tags present on every page
- [ ] Mobile responsive across all pages (test 375px, 768px, 1024px, 1440px)
- [ ] No "lorem ipsum" anywhere — all copy is realistic

---

## What NOT to Do

- Do not use Inter, Roboto, or Arial for any typography
- Do not use purple gradients or generic SaaS color schemes
- Do not make the gallery a basic CSS grid with no interactions
- Do not skip the custom gallery cursor
- Do not use bounce or spring easing for motion (keep it mechanical/smooth)
- Do not add unnecessary dependencies — keep the bundle lean
- Do not forget `"use client"` on components using Framer Motion hooks
- Do not use Pages Router patterns — this is App Router only
