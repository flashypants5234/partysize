/**
 * ============================================================
 *  PERSONAL CV — SINGLE CONFIG FILE
 *  Edit ONLY this file to customise every page of the site.
 * ============================================================
 */

// ─── Identity ────────────────────────────────────────────────
export const SITE = {
  name: "Mae Lin",
  title: "Product Designer & Front-End Engineer",
  tagline: "I design & build delightful products.",
  bio: "A product designer and front-end engineer with 8 years of experience turning fuzzy ideas into polished, shippable interfaces. I care about craft, clarity, and the details users feel but never notice.",
  bioExtended: `I've led design systems at fast-growing startups, shipped consumer apps used by millions, and mentored junior designers into confident product thinkers. My favorite problems are the messy, ambiguous ones where good design quietly makes everything click.

When I'm not pushing pixels, you'll find me bouldering, brewing pour-over coffee, or sketching type in the margins of a notebook.`,
  /** true = show "Available for select freelance projects" badge */
  available: true,
  /** Change to your real domain before deploying */
  url: "https://maelin.example.com",
  /** Path to CV PDF inside /public — e.g. "/mae-lin-cv.pdf" */
  cvPdf: "/mae-lin-cv.pdf",
  email: "hello@maelin.example.com",
  location: "San Francisco, CA",
};

// ─── Demo ribbon ─────────────────────────────────────────────
/** Shown on the hosted preview only. Set show:false for your own site. */
export const TEMPLATE_BANNER = {
  show: true,
  repoUrl: "https://github.com/cekuu35/free-nextjs-cv-template",
  bundleLabel: "23 premium business templates — $79",
  bundleUrl:
    "https://cengokurtoglu.gumroad.com/l/vuhstz?wanted=true&utm_source=demo&utm_medium=banner&utm_campaign=free_cv_template",
};

// ─── Navigation ──────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

// ─── Social ──────────────────────────────────────────────────
export const SOCIAL_LINKS = [
  { label: "GitHub",   href: "https://github.com/maelin" },
  { label: "Dribbble", href: "https://dribbble.com/maelin" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/maelin" },
  { label: "Read.cv",  href: "https://read.cv/maelin" },
] as const;

// ─── Skills (About page) ─────────────────────────────────────
export const SKILL_GROUPS = [
  {
    heading: "Product Design",
    tags: ["Figma", "Design Systems", "Prototyping", "UX Research", "Wireframing"],
  },
  {
    heading: "Engineering",
    tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"],
  },
  {
    heading: "Craft",
    tags: ["Motion Design", "Typography", "Accessibility", "Brand Identity"],
  },
] as const;

// ─── Experience (About / Resume page) ────────────────────────
export const EXPERIENCE = [
  {
    period: "2022 — Present",
    role: "Lead Product Designer",
    company: "Lumen",
    companyUrl: "https://lumen.example.com",
    description:
      "Own the end-to-end design of a B2B analytics platform. Built the design system from scratch, cutting design-to-ship time by 40%.",
  },
  {
    period: "2019 — 2022",
    role: "Senior Product Designer",
    company: "Driftwood",
    companyUrl: "https://driftwood.example.com",
    description:
      "Shipped the flagship mobile app to 3M+ users. Led research, IA, and a full redesign that lifted retention 18%.",
  },
  {
    period: "2017 — 2019",
    role: "Product Designer",
    company: "Northwind Studio",
    companyUrl: "https://northwind.example.com",
    description:
      "Designed and front-end-built marketing sites and product UIs for a portfolio of early-stage clients.",
  },
  {
    period: "2016 — 2017",
    role: "Design Intern",
    company: "Beacon Labs",
    companyUrl: "https://beaconlabs.example.com",
    description:
      "Cut my teeth on real product work — wireframes, usability tests, and my first shipped feature.",
  },
] as const;

// ─── Education (About / Resume page) ─────────────────────────
export const EDUCATION = [
  {
    period: "2012 — 2016",
    degree: "B.F.A. Interaction Design",
    school: "California College of the Arts",
    note: "Graduated with distinction. Senior thesis: Designing for Peripheral Attention.",
  },
  {
    period: "2020",
    degree: "Human-Computer Interaction (online)",
    school: "Stanford University",
    note: "Coursera certificate — Methods, tools, and frameworks for user-centred design.",
  },
] as const;

// ─── Certifications (About page — optional) ──────────────────
export const CERTIFICATIONS = [
  { year: "2023", name: "Certified UX Professional (CUXP)", issuer: "Nielsen Norman Group" },
  { year: "2021", name: "AWS Cloud Practitioner", issuer: "Amazon Web Services" },
] as const;

// ─── Portfolio Projects ───────────────────────────────────────
export const PROJECTS = [
  {
    slug: "lumen-analytics",
    title: "Lumen Analytics",
    tagline: "Real-time B2B dashboard redesign + design system.",
    description:
      "Led the end-to-end redesign of Lumen's core analytics product — from discovery workshops and competitive teardowns to a production design system used by 12 engineers. The new system cut design-to-ship time by 40% and reduced UI inconsistencies by 80%.",
    challenge:
      "The legacy dashboard had grown organically over 4 years, leaving a tangled mix of styles, incomplete component patterns, and zero documentation. Engineers avoided touching old screens out of fear.",
    solution:
      "Ran a 3-week audit to catalogue every component, colour token, and spacing rule. Built a Figma library and matching React component library in parallel, then migrated screens one cluster at a time while keeping the product shipping.",
    outcome:
      "40% faster design-to-ship · 80% fewer UI consistency bugs · Design system adopted by the full engineering org · Selected as a Figma Community resource.",
    tags: ["Figma", "Design Systems", "React", "TypeScript"],
    gradient: "from-violet-200 to-pink-200",
    year: "2023",
    role: "Lead Designer",
    liveUrl: "",
    featured: true,
  },
  {
    slug: "driftwood-mobile",
    title: "Driftwood Mobile",
    tagline: "Consumer app redesign — +18% 30-day retention.",
    description:
      "Full product redesign of Driftwood's iOS and Android app: new IA, onboarding, and core loop. Shipped to 3M+ users with zero downtime via a phased rollout.",
    challenge:
      "Retention was falling as the app grew feature-bloated. Users completed onboarding but churned within the first week — the core loop had no clear value moment.",
    solution:
      "Ran diary studies with 20 churned users to find the missing 'aha' moment, then redesigned onboarding to deliver value in under 90 seconds. Simplified the nav from 7 tabs to 3, and introduced a daily prompt mechanic.",
    outcome:
      "18% lift in 30-day retention · 34% improvement in onboarding completion · #2 in App Store (Lifestyle) for four consecutive weeks.",
    tags: ["iOS", "Android", "Figma", "User Research"],
    gradient: "from-amber-200 to-rose-200",
    year: "2022",
    role: "Senior Designer",
    liveUrl: "",
    featured: true,
  },
  {
    slug: "atlas-design-kit",
    title: "Atlas Design Kit",
    tagline: "Open-source component library — 4k+ GitHub stars.",
    description:
      "A free, production-ready Figma + React component kit covering 60+ components, dark mode, and a token-based theming system.",
    challenge:
      "Most open-source design kits are either comprehensive-but-ugly or beautiful-but-incomplete. I wanted a kit I'd actually use on client work.",
    solution:
      "Built every component in Figma first, validated it in code, then wrote the documentation. Took 6 months of evenings. Published on GitHub and posted on Twitter.",
    outcome:
      "4,200+ GitHub stars · Featured in CSS-Tricks and Sidebar.io · Used by 300+ teams (based on private repo forks).",
    tags: ["Open Source", "React", "Figma", "Design Systems"],
    gradient: "from-sky-200 to-violet-200",
    year: "2021",
    role: "Creator",
    liveUrl: "https://github.com/maelin/atlas",
    featured: true,
  },
  {
    slug: "beacon-brand",
    title: "Beacon Brand",
    tagline: "Identity & marketing site for a developer-tools startup.",
    description:
      "Full brand identity and Next.js marketing site for Beacon Labs — from naming workshop to Vercel deploy in 6 weeks.",
    challenge:
      "Beacon was pivoting from agency services to a SaaS product and needed a brand that felt credible to enterprise buyers without losing the warmth of a small team.",
    solution:
      "Workshop-led naming exercise, logo in two rounds, type and colour system, illustration style, and a 7-page Next.js site with animated demos of the product.",
    outcome:
      "Launched on Product Hunt (#3 of the day) · 1,200 sign-ups in the first week · Brand extended to swag, pitch deck, and social.",
    tags: ["Branding", "Next.js", "Motion", "Copywriting"],
    gradient: "from-emerald-200 to-sky-200",
    year: "2019",
    role: "Lead Designer & Developer",
    liveUrl: "",
    featured: false,
  },
] as const;

// ─── Blog Posts ───────────────────────────────────────────────
export const BLOG_POSTS = [
  {
    slug: "how-i-run-design-reviews",
    title: "How I Run Design Reviews That Actually Improve Work",
    excerpt:
      "Most design reviews devolve into opinion wars. Here's the lightweight ritual I use to make critique fast, fair, and focused on user outcomes.",
    date: "2024-03-12",
    readingTime: "6 min read",
    tags: ["Process", "Design"],
    content: `
Design reviews can be brutal. Without structure, they become a room full of opinions dressed up as expertise. Here's what I've learned running reviews at two high-growth startups.

## The problem with most reviews

The default format — "show your work, take feedback" — creates three failure modes:

1. **HiPPO effect**: the highest-paid person's opinion wins by default
2. **Vague feedback**: "I don't like the font" with no criteria attached
3. **Solution-first feedback**: reviewers redesign on the spot rather than naming the problem

## The ritual that fixed it

I borrowed from Amazon's silent reading rule and lightened it. Here's the 30-minute format I now use for every significant design milestone:

**5 min — context** (designer only)
State the problem, constraints, and what specific input you need. "I want feedback on the onboarding flow's value clarity — not the visual style."

**8 min — silent review**
Everyone reads the brief and examines the work independently. No talking. Notes go on sticky notes (Figjam or physical).

**15 min — structured critique**
Go around the room. Each reviewer reads one note at a time, starting with: *"I noticed…"* or *"I wondered…"*. No rebuttals allowed during this phase.

**2 min — designer's call**
Designer synthesises, asks one clarifying question, and declares the next action.

## Why it works

The silent phase kills the first-mover bias. The sentence starters replace "I think" with observation and curiosity. The designer's closing call keeps ownership where it belongs.

I've run this format with teams of 3 and 20. It scales. Try it on your next review.
    `.trim(),
  },
  {
    slug: "typography-system-tokens",
    title: "Building a Typography System With Design Tokens",
    excerpt:
      "Font size alone isn't a type system. A walk through the token structure I use to make typography consistent across platforms.",
    date: "2024-01-28",
    readingTime: "8 min read",
    tags: ["Design Systems", "Typography"],
    content: `
Typography is the hardest part of a design system to get right — and the first thing users notice when it's wrong.

## What a type system actually is

A type system isn't a list of font sizes. It's a set of semantic decisions: what is a heading, what is body copy, what is a caption — and how do those things scale across breakpoints and platforms.

Good type tokens separate three concerns:

1. **Primitive tokens**: raw values (font-size-16, font-weight-600)
2. **Semantic tokens**: meaning-bearing aliases (text-body, text-heading-lg)
3. **Component tokens**: scoped to a component (button-label-size)

## The token hierarchy I use

\`\`\`
// Primitive
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;
--font-size-4xl: 2.25rem;

// Semantic
--text-body: var(--font-size-base);
--text-body-sm: var(--font-size-sm);
--text-heading-sm: var(--font-size-xl);
--text-heading-md: var(--font-size-2xl);
--text-heading-lg: var(--font-size-3xl);
--text-display: var(--font-size-4xl);
\`\`\`

## The key rule: no primitive tokens in components

Components should only ever reference semantic tokens. This way you can update the scale — or swap the entire type system — by editing a single layer.

Pair this with a line-height and letter-spacing token for each semantic tier, and you have a system that's genuinely portable across web, React Native, and Figma variables.
    `.trim(),
  },
  {
    slug: "shipping-side-projects",
    title: "The Only System That Gets Me to Ship Side Projects",
    excerpt:
      "I've abandoned more side projects than I can count. This is the anti-process that finally works for me.",
    date: "2023-11-05",
    readingTime: "5 min read",
    tags: ["Process", "Productivity"],
    content: `
Here's the truth about side projects: they die in the gap between "almost done" and "good enough to share."

After abandoning a dozen projects, I found one rule that changed everything.

## The rule

**Ship on day one of feeling the urge to polish.**

Polishing feels productive but it's actually avoidance. The moment you think "I'll ship it when the X is a bit better" — that's the moment to stop and ship it as-is.

## The system

**Week 1: proof only**
Make the smallest possible thing that proves the core idea works. No landing page, no README, no logo. Just the thing.

**Week 2: one user**
Show it to one person. Not to collect feedback — to make it real. The act of sharing changes your relationship to the project.

**Week 3: public**
Post it somewhere. Anywhere. A tweet, a forum post, a Discord message. The goal is to create a timestamp that says "this exists."

## What happens next

Either people respond (keep going) or they don't (archive with no shame — you learned something). What never happens: the project dies in your laptop.

The system only works if you internalise the last step as non-optional. Shipping is not the reward for finishing. Shipping is the work.
    `.trim(),
  },
] as const;
