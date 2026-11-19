import { Card, FlowArrow, CardStack } from './diagram';

export function NonceAdvanceDiagram() {
  return (
    <figure className="not-prose mx-auto my-8 max-w-2xl">
      <Card title="Message Executor" tone="amber">
        Checks the execution message&apos;s blockhash against the stored nonce.
        Calls <code>Advance</code> and signs as its transition signer PDA.
      </Card>
      <FlowArrow>
        CPI <code>Advance(current nonce, commitment)</code>
      </FlowArrow>
      <Card title="Nonce program" tone="violet">
        <code>Advance</code> checks the nonce and stores the next one. The next
        nonce is derived from the current nonce, the transition signer&#39;s address
        and a SHA-256 hash of the execution message.
      </Card>
      <FlowArrow>then, in order</FlowArrow>
      <CardStack>
        <Card title="Application instructions" tone="gray">
          Run with the privileges the execution message requests.
        </Card>
      </CardStack>
      <figcaption className="mt-4 text-sm/6 text-fd-foreground/80">
        If any application instruction fails, the nonce advance rolls back with
        it.
      </figcaption>
    </figure>
  );
}
