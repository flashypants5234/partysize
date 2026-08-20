# AI Rules

## Project purpose

This repository is a free, MIT-licensed personal portfolio and CV template. Keep it easy to customize, accessible, and deployable as a standard Next.js application.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 3
- Node.js 18 or newer

Do not replace these core technologies unless the user explicitly asks for a migration.

## Architecture

- Routes and layouts live in `src/app`.
- Reusable UI lives in `src/components`.
- Portfolio content and identity data live in `src/data/config.ts`.
- Prefer changing `src/data/config.ts` for names, biography, skills, experience, education, projects, posts, contact details, and social links.
- Keep page components focused on presentation and reuse the typed data shapes already defined by the project.

## Editing guidelines

- Preserve the multi-page structure: home, about, portfolio, blog, and contact.
- Keep components typed; do not introduce `any`.
- Use semantic HTML and preserve keyboard navigation, visible focus states, and WCAG AA color contrast.
- Keep layouts responsive from small mobile screens through desktop widths.
- Use existing Tailwind utilities and visual patterns before adding new dependencies or custom CSS.
- Do not add a database, authentication, analytics, CMS, or paid service unless the user explicitly requests it.
- Treat the contact form as a scaffold. Never claim messages are delivered until a real provider is configured and tested.
- Keep demo names, work history, testimonials, metrics, and contact details clearly fictional until the user supplies verified replacements.
- Use `next/image` and `next/font` when adding production assets or fonts.

## Validation

Before considering a change complete, run the available project checks and at minimum verify:

```bash
npm install
npm run build
```

Also inspect the affected pages at mobile and desktop widths. Confirm that all internal links, project routes, and form validation still work.
