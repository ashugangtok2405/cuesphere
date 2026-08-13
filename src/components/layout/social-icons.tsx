import * as React from "react";
import { cn } from "@/lib/utils";
import { SOCIAL_LINKS } from "@/lib/constants";

const paths: Record<string, string> = {
  facebook:
    "M13.5 21v-7.2h2.4l.4-2.8h-2.8v-1.6c0-.8.2-1.4 1.4-1.4h1.5V5.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v1.9H7.2v2.8H10V21h3.5z",
  twitter:
    "M17.5 3h2.8l-6.1 7 6.9 9.9h-5.4l-4.2-6-4.9 6H3.8l6.5-7.5L3.7 3h5.5l3.8 5.5L17.5 3z",
  youtube:
    "M21.6 7.6a2.7 2.7 0 0 0-1.9-1.9C18 5.2 12 5.2 12 5.2s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.6 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.4 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.4zM10 15V9l5.2 3-5.2 3z",
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.4.5.6.2 1.1.5 1.5 1 .5.4.8.9 1 1.5.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.5 2.4-.2.6-.5 1.1-1 1.5-.4.5-.9.8-1.5 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.4-.5-.6-.2-1.1-.5-1.5-1-.5-.4-.8-.9-1-1.5-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-2 .5-2.4.2-.6.5-1.1 1-1.5.4-.5.9-.8 1.5-1 .5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-1.9.4-.5.2-.8.4-1.2.7-.3.4-.5.7-.7 1.2-.2.3-.3.9-.4 1.9-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 1.9.2.5.4.8.7 1.2.4.3.7.5 1.2.7.3.2.9.3 1.9.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 1.9-.4.5-.2.8-.4 1.2-.7.3-.4.5-.7.7-1.2.2-.3.3-.9.4-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-1.9-.2-.5-.4-.8-.7-1.2a3 3 0 0 0-1.2-.7c-.3-.2-.9-.3-1.9-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm5.7-3.4a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z",
};

export function SocialIcons({
  className,
  links,
}: {
  className?: string;
  links?: Record<string, string>;
}) {
  const entries = links
    ? Object.entries(links)
        .filter(([platform, href]) => href.trim() && paths[platform])
        .map(([platform, href]) => ({ label: platform, href, icon: platform }))
    : [];

  const items = entries.length > 0 ? entries : links ? [] : SOCIAL_LINKS;

  if (items.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d={paths[s.icon]} />
          </svg>
        </a>
      ))}
    </div>
  );
}
