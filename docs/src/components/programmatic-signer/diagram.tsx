import type { ReactNode } from 'react';

// Plain HTML instead of SVG keeps the text readable at any screen size or zoom level.

export const cardTones = {
  gray: 'border-neutral-400 bg-fd-card text-fd-card-foreground dark:border-neutral-600',
  violet:
    'border-violet-400 bg-violet-50 text-violet-950 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-100',
  teal: 'border-teal-400 bg-teal-50 text-teal-950 dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-100',
  amber:
    'border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100',
} as const;

export type CardTone = keyof typeof cardTones;

// Shape shared by every card.
export const cardShape = 'rounded-xl border p-3 sm:p-4';

export function Card({
  title,
  tone,
  children,
}: {
  title: string;
  tone: CardTone;
  children: ReactNode;
}) {
  return (
    <div className={`${cardShape} ${cardTones[tone]}`}>
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-1 text-base leading-relaxed">{children}</div>
    </div>
  );
}

// Draws offset cards behind a card to show it stands for many calls.
export function CardStack({ children }: { children: ReactNode }) {
  const back =
    'absolute inset-0 rounded-xl border border-neutral-400 bg-fd-card dark:border-neutral-600';
  return (
    <div className="relative mr-3 mb-3">
      <div
        aria-hidden="true"
        className={`${back} translate-x-3 translate-y-3`}
      />
      <div
        aria-hidden="true"
        className={`${back} translate-x-1.5 translate-y-1.5`}
      />
      {/* Solid backing so the offset cards do not show through translucent tones. */}
      <div className="relative rounded-xl bg-fd-background">{children}</div>
    </div>
  );
}

// Labeled arrow between two cards. Wrap instruction names in <code>.
export function FlowArrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-1 text-fd-muted-foreground">
      <div aria-hidden="true" className="h-3 w-px bg-current/50" />
      <div className="rounded border bg-fd-muted px-1.5 py-0.5 text-center text-xs/5 text-fd-foreground/80">
        {children}
      </div>
      <div aria-hidden="true" className="h-3 w-px bg-current/50" />
      <div aria-hidden="true" className="-mt-1 text-sm leading-none">
        ▼
      </div>
    </div>
  );
}
