# Amader Rickshaw Mama (আমাদের রিকশা মামা)
> **The Ultimate Bangladeshi Rickshaw Refusal & Fare Haggling Simulator** 🛺💨

---

## 1. Executive Summary & Concept

**Amader Rickshaw Mama** is an interactive, physics-driven, micro web application designed as a satirical, fun experience tailored for the Bangladeshi audience. It simulates the daily cultural experience of attempting to hire a rickshaw in Dhaka or Chittagong, negotiating absurd fares, hearing hilarious excuses, and dealing with sudden refusals.

### Goals & Constraints
* **Primary Goal:** Pure entertainment, cultural humor, viral shareability, and a showcase of high-performance frontend web animations (60 FPS spring physics, particle systems, and sound synthesis).
* **Cost Requirement:** 100% Free infrastructure ($0 operational cost). Zero server-side database dependencies.
* **Target Audience:** Bangladeshi netizens, local tech communities, and indie hacker portfolio showcases.

---

## 2. Technical Stack & Free Infrastructure Blueprint

To deliver smooth 60 FPS animations and instant sound triggers without spending money on hosting or databases, the entire stack relies on modern client-side engines and edge delivery:

| Infrastructure Layer | Selected Tool / Library | Technical Justification | Cost |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js 15+ (App Router)** | Client-side React 19 architecture, static export compatibility, fast route handling. | Free (Vercel) |
| **Animation Core** | **Framer Motion + Canvas API** | UI spring physics, layout animations, custom particle systems (dust clouds, rain). | Free (Open Source) |
| **Physics & Sprites** | **Matter.js / Rive Web** | 2D rigid-body collision physics for the Pothole Balance mini-game. | Free (Open Source) |
| **Sound Engine** | **Howler.js / Web Audio API** | Zero-latency audio playback, positional audio (bell rings, motor sounds, voice clips). | Free (Open Source) |
| **Styling & Theme** | **Tailwind CSS + Lucide Icons** | High-contrast Bangladeshi Rickshaw Art aesthetic (hot pinks, vivid yellows, floral borders). | Free (Open Source) |
| **Analytics & Shares** | **HTML Canvas API (html2canvas)** | Instant generation of downloadable meme cards ("I got rejected 50 times in Dhanmondi!"). | Free (Open Source) |
| **Deployment** | **Vercel Edge Platform** | Immutable static deployments with worldwide CDN caching. | Free Tier |

---

## 3. System Architecture & Component Workflow

```
+-----------------------------------------------------------------------+
|                            USER INTERFACE                             |
|                                                                       |
|  +--------------------+   +-------------------+   +----------------+  |
|  | Location Selector  |   | Fare Haggler      |   | Rickshaw Canvas|  |
|  | (Origin/Destination) | | (Interactive Slider)| | (Framer/Matter)|  |
|  +---------+----------+   +---------+---------+   +-------+--------+  |
+------------|------------------------|---------------------|-----------+
             |                        |                     |
             v                        v                     v
+-----------------------------------------------------------------------+
|                    CLIENT-SIDE APPLICATION ENGINE                     |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |                      State Manager (Zustand)                  |   |
|   |   (Tracks current offer, refusal streak, local stats, sounds)  |   |
|   +-------------------------------+-------------------------------+   |
|                                   |                                   |
|        +--------------------------+--------------------------+        |
|        |                                                     |        |
|        v                                                     v        |
|  +---------------------------+                 +--------------------+ |
|  |   Refusal Engine          |                 | Sound Controller   | |
|  |   (Probabilistic Algorithm|                 | (Howler.js Web    | |
|  |   + Local Excuses DB)     |                 |  Audio Context)    | |
|  +-------------+-------------+                 +---------+----------+ |
|                |                                         |            |
+----------------|-----------------------------------------|------------+
                 |                                         |
                 v                                         v
+-----------------------------------------------------------------------+
|                         ANIMATION & EFFECT OUTPUT                     |
|                                                                       |
|   +------------------------+              +-----------------------+   |
|   | Sprite Escape Sequence |              | Particle Explosion    |   |
|   | (Framer Motion / Rive) |              | (Dust Cloud Canvas)   |   |
|   +------------------------+              +-----------------------+   |
+-----------------------------------------------------------------------+
```

---

## 4. Rickshaw Physics & Animation Technical Guide

### A. The Rejection Escape Sequence
When the user taps **"মামু যাইবেন?"** (Mama, will you go?), the refusal engine executes the following animation pipeline:

1. **The Shake (Head/Handlebars):** Framer Motion applies a spring-damped oscillation to the Rickshaw Mama's head sprite ($x: [-8, 8, -6, 6, 0]$, duration: 0.4s).
2. **The Speech Bubble Entry:** Pop-up dialog bounces onto the screen using an elastic curve (`type: "spring", stiffness: 400, damping: 15`).
3. **The Pedal Acceleration:** The back wheel sprite rotates rapidly ($\text{rotation}: 0 \rightarrow 1440^\circ$) while the frame compresses slightly down to simulate pedaling weight.
4. **Dust Cloud Particle Generation:** A HTML5 2D Canvas renders 30 particle clouds behind the rear wheels using radial gradient circles that fade (`opacity: 1 -> 0`) while expanding (`radius: 5px -> 35px`).
5. **Screen Exit:** The entire rickshaw container accelerates off the right screen boundary (`x: "120vw"`, `ease: "anticipate"`).

### B. The Pothole Balance Mini-Game (Matter.js Integration)
When an offer is accepted (1 out of 50 chance or when fare is $> \text{৳৪০০}$):
* A 2D rigid-body wheel pair is simulated inside Matter.js.
* Player taps `Left` / `Right` arrow buttons to shift weight balance.
* Road terrain generates randomized bump obstacles ("Dhaka Potholes").
* Angular velocity higher than $45^\circ$ triggers a rickshaw flip frame + crash sound effect.

---

## 5. Module Requirements & Feature Checklist

### Module A: The Haggling Interface
* Multi-select dropdown for popular routes (e.g., *Farmgate $\rightarrow$ Dhanmondi 27*, *GEC $\rightarrow$ 2 No. Gate*, *Mirpur 10 $\rightarrow$ Gulshan 2*).
* Interactive Price Slider ($\text{৳১০}$ to $\text{৳১০০০}$) with real-time feedback icons:
  * $\text{৳১০} - \text{৳৩০}$: 😠 Furious face
  * $\text{৳৪০} - \text{৳১০০}$: 😒 Unimpressed face
  * $\text{৳৫০০}+$: 🤑 Eyes turn to dollar signs

### Module B: The Excuses & Sound Database
* **Local Storage Integration:** Stores total refrains faced, total fake money requested, and unlockable badges ("Master Pedestrian", "Gulshan Traffic Victim").
* **Built-in Sound Hooks:**
  * Classic brass rickshaw bell (*Tuk-tuk-tuk!*)
  * Exhaust revs / Dust whistle
  * Bengali voice clips (synthesized or recorded comic lines)

### Module C: Rickshaw Art & Meme Canvas Exporter
* Custom UI theme mimicking traditional painted tin-plate Rickshaw art (bright red, emerald green, floral motives).
* "Share Refusal Card" button that generates a downloadable PNG meme card detailing the trip refusal to share on Facebook / Twitter.

---

## 6. Project Setup & AGENTS.md File

Create this exact `AGENTS.md` file in the root of your project directory for coding agents (Cursor, Claude Code, Windsurf, etc.):

```markdown
# AGENTS.md

Rules for any AI coding agent working on Amader Rickshaw Mama.
Read this file fully before introducing changes.

## 1. What This Project Is
Amader Rickshaw Mama is a client-side, zero-backend, Bangladeshi rickshaw refusal simulator. 
It relies heavily on Framer Motion animations, Web Audio SFX (Howler.js), and Tailwind CSS.

## 2. Tech Stack & Tools
- Next.js 15 App Router (TypeScript strict mode)
- Styling: Tailwind CSS + Lucide Icons
- Animation: Framer Motion + Canvas API
- Sound: Howler.js
- State Management: Zustand (persisted via localStorage)
- Deployment: Vercel (Static export compliant)

No backend server, no database, no Supabase/Aiven, no API costs.

## 3. Development Commands
- `pnpm dev` - Launch development environment
- `pnpm typecheck` - Run strict TypeScript validation
- `pnpm lint` - ESLint check
- `pnpm build` - Verify static build output

Before concluding any task, `pnpm typecheck && pnpm lint` MUST pass cleanly.

## 4. Architecture Standards
- Modular monolith design inside `src/`:
  - `src/components/rickshaw/` - Canvas, sprites, and animation logic.
  - `src/components/ui/` - Buttons, sliders, sound controls.
  - `src/data/` - Static excuses, routes, and audio configurations.
  - `src/hooks/` - Sound hook adapters, Zustand state hook.
- All sound plays must pass through `src/hooks/useSoundFX.ts`. Never instantiate Audio elements directly inside components.
- Keep sprites lightweight (SVG or webp preferred).

## 5. Coding Standards
- Strict TypeScript: No `any` types permitted.
- Performance Rule: Ensure all Framer Motion components use hardware-accelerated properties (`transform`, `opacity`, `scale`). Avoid animating `left`, `top`, or `margin`.
- Responsive Design: Must render cleanly on mobile viewport sizes (375px width and above).
- Error Handling: Fallback gracefully if Web Audio context is blocked by browser autoplay policies.

## 6. Definition of Done
1. Feature matches requested animation/ui interaction.
2. Zero TypeScript errors and zero lint warnings.
3. Animations run at 60 FPS without layout thrashing.
4. Mobile touch events tested and verified.
```