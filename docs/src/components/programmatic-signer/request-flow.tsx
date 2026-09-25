import type { ReactNode } from 'react';
import { Card, FlowArrow, CardStack } from './diagram';

// Dashed card for the relayer, which is a wallet and not a program.
function WalletCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border-2 border-dashed border-neutral-400 p-3 sm:p-4 dark:border-neutral-500">
      <div className="text-xs/5 font-medium tracking-wide text-fd-foreground/80 uppercase">
        Wallet
      </div>
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-1 text-base leading-relaxed">{children}</div>
    </div>
  );
}

export function RequestFlowDiagram() {
  return (
    <figure className="not-prose mx-auto my-8 max-w-2xl">
      <WalletCard title="Relayer">
        Signs and pays for the relay transaction that carries the authorization.
      </WalletCard>
      <FlowArrow>
        <code>Submit(signatures, authorization message)</code>
      </FlowArrow>
      <Card title="Ed25519 Signer" tone="teal">
        Verifies every signature and gives each authority&apos;s PDA signer
        privilege.
      </Card>
      <FlowArrow>
        CPI <code>Execute(execution message)</code> + PDA signer
      </FlowArrow>
      <Card title="Legacy Message Executor" tone="amber">
        Checks the execution message against the stored nonce, then advances the
        nonce and invokes each instruction in order.
      </Card>
      <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4">
        <div>
          <FlowArrow>
            1. CPI <code>Advance</code>
          </FlowArrow>
          <Card title="Nonce program" tone="violet">
            Advances the nonce so the authorization cannot run twice.
          </Card>
        </div>
        <div>
          <FlowArrow>2. CPI instructions</FlowArrow>
          <CardStack>
            <Card title="Application programs" tone="gray">
              Invoke all instructions via CPI, forwarding signer privilege.
            </Card>
          </CardStack>
        </div>
      </div>
      <figcaption className="mt-4 text-sm/6 text-fd-foreground/80">
        Every change commits together or rolls back together, including the
        nonce advance.
      </figcaption>
    </figure>
  );
}
