import { TEMPLATE_BANNER } from '@/data/config';

/**
 * Demo-only ribbon shown on the hosted preview of this template.
 * Set TEMPLATE_BANNER.show to false in src/data/config.ts when you
 * deploy this as your own site.
 */
export default function TemplateBanner() {
  if (!TEMPLATE_BANNER.show) return null;

  return (
    <div className="accent-bg text-white text-sm">
      <div className="max-w-5xl mx-auto px-6 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-1 text-center">
        <span className="font-medium">
          You&apos;re viewing a free, MIT-licensed Next.js template.
        </span>
        <span className="flex items-center gap-x-5">
          <a
            href={TEMPLATE_BANNER.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:no-underline whitespace-nowrap"
          >
            Get the code
          </a>
          <a
            href={TEMPLATE_BANNER.bundleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:no-underline whitespace-nowrap"
          >
            {TEMPLATE_BANNER.bundleLabel}
          </a>
        </span>
      </div>
    </div>
  );
}
