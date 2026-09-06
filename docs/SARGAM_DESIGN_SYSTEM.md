# SARGAM Design System: Deep Obsidian Velvet & Radiant Amber

## 1. Visual Philosophy
The Sargam design language evokes the warmth and nostalgia of a vintage vinyl listening salon:
- **Atmosphere:** Deep midnight/obsidian surfaces with gentle amber and saffron highlights.
- **Surfaces:** Soft glassmorphism (`backdrop-blur-md`, `bg-card/40`) with hairline 10% translucent borders.
- **Typography:** Serif typography selectively for editorial headings, brand markers, and era banners; modern geometric sans-serif (Figtree) for high-density song rows.

---

## 2. Color Palette (OKLCH Color Space)

| Token | OKLCH Coordinates | Hex Approximation | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(0.14 0.016 260)` | `#0f121a` | Deep obsidian velvet ground |
| `--sidebar` | `oklch(0.10 0.014 260)` | `#0b0d13` | Receding navigation rail |
| `--card` | `oklch(0.185 0.018 260)`| `#151824` | Elevated panels and cards |
| `--primary` | `oklch(0.82 0.16 75)` | `#f59e0b` | Radiant luminous amber (CTAs, play actions) |
| `--heart` | `oklch(0.72 0.20 18)` | `#e11d48` | Restrained crimson rose for favorites |
| `--foreground`| `oklch(0.96 0.008 260)`| `#f8fafc` | Luminous high-contrast text (>16:1 contrast) |
| `--muted-foreground` | `oklch(0.72 0.015 260)`| `#94a3b8` | Secondary metadata and singer credits |
| `--border` | `oklch(1 0 0 / 10%)` | `rgba(255,255,255,0.10)` | Hairline boundaries |

---

## 3. Height-Aware Responsive Breakpoints
Standard width-only queries break on horizontally rotated smartphones (e.g. 844px wide by 390px tall), which masquerade as desktop/tablet windows while lacking vertical headroom.
Sargam enforces height constraints on major breakpoints:
- `sm:`: `width >= 40rem and height >= 30rem`
- `md:`: `width >= 48rem and height >= 30rem`
- `lg:`: `width >= 64rem and height >= 30rem`
