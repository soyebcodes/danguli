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
