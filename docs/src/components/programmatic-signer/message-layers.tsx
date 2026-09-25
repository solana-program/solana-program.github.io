import type { ReactNode } from 'react';
import { cardShape, CardStack, cardTones, type CardTone } from './diagram';

// Small pill for a fact about a message, like who signs it.
function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-current/25 px-2 py-0.5 text-xs font-medium opacity-80">
      {children}
    </span>
  );
}

// Card for a message or transaction with its name and pills.
function MessageCard({
  title,
  tone,
  tags,
  children,
}: {
  title: string;
  tone: CardTone;
  tags: string[];
  children: ReactNode;
}) {
  return (
    <div className={`${cardShape} ${cardTones[tone]}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="text-base font-semibold">{title}</span>
        {tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

// Dashed frame for an instruction that wraps the next message.
function InstructionFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-current/30 p-2 sm:p-3">
      <code className="mb-2 block text-xs/5 opacity-80">{label}</code>
      {children}
    </div>
  );
}

export function MessageLayersDiagram() {
  return (
    <figure className="not-prose mx-auto my-8 max-w-2xl">
      <MessageCard
        title="Relay transaction"
        tone="gray"
        tags={['Signed by the relayer', 'Blockhash: recent']}
      >
        <InstructionFrame label="Submit instruction">
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-400 bg-fd-background px-3 py-2 text-sm font-medium text-fd-foreground dark:border-neutral-600">
              <span>Authority signatures</span>
              <span className="text-fd-foreground/80">
                cover <span aria-hidden="true">↓</span>
              </span>
            </div>
            <MessageCard
              title="Authorization message"
              tone="teal"
              tags={['Signed by the authorities']}
            >
              <InstructionFrame label="Execute instruction">
                <MessageCard
                  title="Execution message"
                  tone="amber"
                  tags={['Blockhash: nonce']}
                >
                  <CardStack>
                    <div
                      className={`rounded-xl border px-3 py-2 text-sm ${cardTones.gray}`}
                    >
                      Application instructions
                    </div>
                  </CardStack>
                </MessageCard>
              </InstructionFrame>
            </MessageCard>
          </div>
        </InstructionFrame>
      </MessageCard>
      <figcaption className="mt-4 text-sm/6 text-fd-foreground/80">
        The authority signatures sit beside the authorization message in Submit
        and cover every byte of it, including the execution message.
      </figcaption>
    </figure>
  );
}
