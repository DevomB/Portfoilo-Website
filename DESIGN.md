---
name: Devom Brahmbhatt Portfolio
description: Backend engineer portfolio. Dual-audience design â€” readable by anyone, appreciated by developers.
colors:
  astroblack: "#000000"
  royal-purple: "#7c00ff"
  joker-green: "#09ff00"
  royal-purple-lift: "#a35cff"
  surface: "#f3ead2"
  surface-elevated: "#fdf9ea"
  border-warm: "#e5d9b8"
  ink: "#1c1916"
  ink-muted: "#78705f"
  code-bg: "#e9f0f5"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(3rem, 5.5vw + 1rem, 6rem)"
    fontWeight: 900
    lineHeight: 0.93
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 1.2rem + 1.6vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(0.9375rem, 0.88rem + 0.25vw, 1rem)"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(0.9375rem, 0.88rem + 0.25vw, 1rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "clamp(0.6875rem, 0.65rem + 0.15vw, 0.75rem)"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  button: "0.375rem"
  card: "0.75rem"
  pill: "999px"
spacing:
  section-y: "clamp(2.5rem, 4vw + 1.5rem, 5rem)"
  shell-inline: "clamp(1rem, 3vw + 0.5rem, 2rem)"
  item-y: "1.75rem"
  max-width: "76rem"
components:
  button-primary:
    backgroundColor: "{colors.royal-purple}"
    textColor: "{colors.surface-elevated}"
    rounded: "{rounded.button}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.royal-purple-lift}"
    textColor: "{colors.surface-elevated}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.button}"
    padding: "0.5rem 1rem"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.royal-purple}"
---

# Design System: Devom Brahmbhatt Portfolio

## 1. Overview

**Creative North Star: "The Transparent Stack"**

The design operates on two simultaneous layers. At the surface, it is immediately comprehensible to anyone: clean structure, clear type hierarchy, direct copy â€” nothing gatekept by technical fluency. One level down, developers find the substrate: SQL ghost text at 4.5% opacity, a server startup log that types itself in, monospace section labels styled as code comments, numbered row indices. Neither layer gets in the way of the other.

The visual language is drawn from precision documents rather than marketing surfaces. Structured rows over card grids. Dividing lines over background fills. Type weight and scale over decorative color. The palette is a committed two-color system â€” Field Cream as the permanent canvas, System Teal as the sole structural ink.

This site does not announce itself. It demonstrates by existing.

**Key Characteristics:**
- Dual-audience: readable without technical context, rewarding with it
- Flat surfaces at rest â€” depth comes from tonal shift and border color, never shadows
- System Teal marks structure and meaning, not decoration
- Geist Mono for machine-facing content; Bricolage Grotesque for human-facing content
- Precise and reticent interactions: almost nothing happens until you act

## 2. Colors: The Two-Color System

A committed palette. Field Cream is the canvas. System Teal is the structural ink. No third hue is introduced.

### Primary
- **Royal Purple** (`#7c00ff`): The structural accent. Source of truth: `--brand-purple` in `src/app/globals.css`. All colors derive from the three `--brand-*` tokens there — edit colors in that one block only. Used on: the hero H1, section `// labels`, link hover states, interactive focus indicators, the accent dot in the nav logo. Appears where meaning is being anchored, not where decoration is added.
- **System Teal Dim** (`#1c4d68`): The depth variant. Hover state for System Teal buttons and text links that shift on interaction.
- **System Teal Pale** (`#c4d8e8`): The tint surface. Used sparingly as a background wash on the server log panel border and select accent-adjacent elements.

### Neutral
- **Astroblack** (`#000000`): The page canvas. All content renders on this surface.
- **Joker Green** (`#09ff00`): The signal voice — section `// labels`, status dots, log module names, the nav live-dot.
- **Surface** (`#0b0810`): Near-black with a purple cast. Used for the server log panel background and as a secondary surface.
- **Surface Elevated** (`#120c1c`): The lightest neutral layer, used for elevated or focused surfaces.
- **Border Warm** (`#e5d9b8`): All horizontal dividers between section rows and any border treatment. Warm-tinted, never harsh.
- **Ink** (`#1c1916`): Near-black, warm-tinted (not pure black). Primary text: names, titles, headings.
- **Ink Muted** (`#78705f`): Warm gray. Secondary text: bio copy, metadata, location, dates, taglines.
- **Code Background** (`#e9f0f5`): Very pale blue-gray. Used behind terminal and code content.

### Named Rules
**The Two-Color Rule.** The palette is System Teal and Field Cream. No other hue is introduced at any point. When tonal variation is needed, step along the existing hues toward white or black. A third color is not a refinement â€” it is a violation.

**The Structural Ink Rule.** System Teal marks structure and state, never decoration. If System Teal appears on a non-interactive element that isn't a section label or heading, it should not be there.

## 3. Typography

**Display / Body Font:** Bricolage Grotesque (geometric grotesque with slightly irregular proportions; loaded self-hosted via `next/font/google`)
**Label / Mono Font:** Geist Mono (clean, modern monospace; loaded self-hosted via `next/font/google`)

The pairing has deliberate role division: Bricolage Grotesque handles everything human-facing â€” headings, body copy, names, CTAs; Geist Mono handles everything machine-facing â€” section labels, dates, stack items, code, terminal text, index numbers. The typeface switch is the signal. When you see Geist Mono, you are reading data.

### Hierarchy
- **Display** (900 weight, `clamp(3rem, 5.5vw + 1rem, 6rem)`, leading 0.93, tracking -0.03em): Hero H1 only. "Backend Software Engineer." Rendered in System Teal. The single largest element on any page.
- **Headline** (700, `clamp(1.625rem, 1.2rem + 1.6vw, 1.875rem)`, tracking -0.02em): Section content headings where present. Color: Ink.
- **Title** (600, `clamp(0.9375rem, 0.88rem + 0.25vw, 1rem)`, leading 1.4): Job titles, school names, contact category labels, project names within list rows. Color: Ink.
- **Body** (400, `clamp(0.9375rem, 0.88rem + 0.25vw, 1rem)`, leading 1.65): Bio paragraphs, project descriptions, bullet text. Color: Ink Muted. Max line length: 65ch.
- **Label / Mono** (Geist Mono, 400, `clamp(0.6875rem, 0.65rem + 0.15vw, 0.75rem)`, tracking +0.08em): Section identifiers (`// experience`), span dates, stack lists, terminal output, row index numbers, metadata. Color: System Teal for active labels; Ink Muted for data.

### Named Rules
**The Two-Typeface Rule.** No third typeface is introduced under any circumstance. Bricolage Grotesque for human content; Geist Mono for machine content. The distinction is the voice of the site.

**The Mono = Data Rule.** If an element represents data â€” a date, a stack item, a code snippet, a terminal line, a row index, a section identifier â€” it uses Geist Mono. If it represents natural language â€” a name, a job title, a bio sentence â€” it uses Bricolage Grotesque.

## 4. Elevation

This system is flat by default. Depth is conveyed through tonal variation between Field Cream surfaces and Border Warm dividers â€” not through shadows.

Two shadow tokens exist in the Tailwind config (`card` and `card-hover`) from a previous card-based layout, but no current component uses them in the main interface. New surfaces must not reach for box-shadow in a resting state.

Hover interaction on linked rows uses `opacity: 0.7` â€” a signal of interactivity without lifting the surface. The interaction is reticent: the element doesn't come toward you, it acknowledges you.

### Named Rules
**The Flat-by-Default Rule.** Surfaces are flat at rest. Depth is expressed through border color (`#e5d9b8`) and background tonal shift (Field Cream to Warm Surface to Surface Elevated), never through shadows. If a box-shadow is appearing in a non-hover context, the component is wrong.

**The Opacity Rule.** On hover, linked rows drop to `opacity: 0.7`. No scale transform, no lift, no background fill. The signal is reticence, not excitement.

## 5. Components

### Buttons
Two variants. Both are small, unobtrusive, and reticent.

- **Shape:** Gently curved (0.375rem / 6px radius)
- **Primary:** System Teal (`#276787`) background, Surface Elevated (`#fdf9ea`) text, `0.5rem 1rem` padding, `0.875rem` font size, 600 weight. Hover: background shifts to System Teal Dim (`#1c4d68`). No shadow, no scale.
- **Ghost:** Transparent background, Border Warm (`#e5d9b8`) border, Ink Muted (`#78705f`) text. Hover: text color shifts to System Teal, border shifts to System Teal Pale. No fill.
- Icons inside buttons only when directional (an arrow indicating navigation). Identification icons (GitHub mark) are acceptable. Decorative icons are not.

### Section List Items
The primary content container across all sections. A row pattern with a top divider, a mono index gutter, and content block.

- **Divider:** `1px solid #e5d9b8` (Border Warm), full width
- **Index gutter:** Geist Mono, `0.65rem`, Ink Muted at 50% opacity, `2ch` minimum width, flush left, vertically aligned to the top of the content
- **Vertical padding:** `1.75rem` top and bottom (py-7)
- **Hover (linked rows):** `opacity: 0.7` on the whole row. No background, no lift, no color change on the title.
- **Badge (optional):** Geist Mono, `0.65rem`, System Teal, flush right, for "live demo â†—" or "site â†—"

### Navbar
Fixed position. Two states: transparent at the page top, frosted on scroll.

- **Transparent state:** No background, no border
- **Scrolled state:** `rgba(#faf5e6, 0.9)` background with `backdrop-filter: blur(16px)`. Border bottom: `1px solid rgba(39, 103, 135, 0.25)` (System Teal at 25%)
- **Logo:** Geist Mono, medium weight, `devomb.com`. The `.` separator is System Teal. Hover: full logo shifts to System Teal.
- **Nav links:** Bricolage Grotesque, `0.875rem`, Ink Muted. Hover: `background: #f3ead2` (Warm Surface), `color: #1c1916` (Ink). Rounded `0.375rem`.
- **Mobile:** Hamburger toggle opens a drawer from the navbar â€” same Astroblack background, same link treatment.

### Server Log (Signature Component)
The terminal panel in the hero's right column on large screens. A fake server startup log that animates line-by-line on page load. The developer-layer easter egg that is immediately legible even to non-developers.

- **Container:** `border: 1px solid rgba(39, 103, 135, 0.25)`, `background: #f3ead2` (Warm Surface), `border-radius: 0.75rem`
- **Window chrome:** Three colored dots (red-400 at 60%, yellow-400 at 60%, System Teal at 50%). File label `server.log` in Geist Mono at tiny size, muted. Bottom border: `1px solid rgba(39, 103, 135, 0.2)`.
- **Log lines:** Geist Mono, `0.75rem`, Ink Muted. Final "ready âœ“" line: System Teal.
- **Animation:** Lines appear sequentially on a staggered timer, simulating actual server startup. Cursor blink after all lines appear.

### SQL Ghost Text (Signature Texture)
Full SQL statements (`SELECT`, `EXPLAIN ANALYZE`, `CREATE INDEX`, `INSERT INTO`) rendered in the hero background at 4.5% opacity in System Teal. Rotated slightly. They are legible on close inspection, invisible at a glance.

- **Font:** Geist Mono, `0.55rem`
- **Color:** System Teal at `opacity: 0.045`
- **Positioning:** Absolute, edges of the hero viewport, slight rotation (Â±1.5deg). `user-select: none`, `pointer-events: none`.
- **Content:** Real, valid SQL that relates to the portfolio's content (projects, sessions, events). Not fake or decorative lorem-ipsum SQL.

## 6. Do's and Don'ts

### Do:
- **Do** use System Teal structurally: section labels, the hero H1, link hover states, the nav logo dot. Its rarity in the resting state makes its presence mean something.
- **Do** let whitespace carry the design. The flat layout depends on generous vertical rhythm doing the work that shadows and cards would otherwise do.
- **Do** use Geist Mono for all data-facing content: dates, stack lists, index numbers, section labels, terminal lines, code. The typeface switch is the signal.
- **Do** put content in rows with dividers, not in cards. The section list item pattern is the system's primary container.
- **Do** keep hover states reticent: opacity drop to 0.7 for linked rows, color shift for text links. The interface does not come toward the user.
- **Do** let the SQL ghost text and server log be the developer-layer easter eggs. They are intentionally subtle â€” 4.5% opacity on the ghost text is not a bug.
- **Do** maintain the two-typeface rule across every new component: Bricolage for human content, Geist Mono for machine content.

### Don't:
- **Don't** hardcode hex values in components. Every color derives from the three `--brand-*` tokens in `src/app/globals.css`; use `var(--color-*)` or the Tailwind names (`bg`, `surface`, `accent`, `secondary`, `danger`, …).
- **Don't** add animations that run without user interaction: scroll-jacking, looping entrance choreography, things moving continuously. Motion is reserved for page-load (once, on the loading screen) and state response (hover, focus).
- **Don't** build any section as an identical card grid with icons: icon + heading + text repeated in a grid is explicitly prohibited. Use the section list item pattern.
- **Don't** use a side-stripe border (`border-left` or `border-right` greater than 1px) as a colored accent on list items or cards.
- **Don't** use gradient text (`background-clip: text` combined with a gradient). Color emphasis is achieved through a single solid hue, never a gradient.
- **Don't** introduce a third typeface. Bricolage Grotesque and Geist Mono are the complete typographic palette.
- **Don't** introduce a third color. The palette is System Teal and Field Cream. No secondary accent, no illustrative color, no additional hue.
- **Don't** use shadows in the resting state. Flat by default.
- **Don't** build a section with both a `// label` and a bold h2 repeating the same concept. One heading per section. The duplication was an explicit design problem that has been corrected.
- **Don't** use SaaS landing-page patterns: hero metrics, feature grids, testimonial carousels, gradient blobs. From PRODUCT.md: "generic SaaS landing page" is an explicit anti-reference.
