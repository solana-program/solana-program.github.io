import { Card, FlowArrow, CardStack } from './diagram';

export function NonceAdvanceDiagram() {
  return (
    <figure className="not-prose mx-auto my-8 max-w-2xl">
      <Card title="Execution message" tone="amber">
        Its blockhash field holds the current nonce.
      </Card>
      <FlowArrow>Executor checks it against the stored nonce</FlowArrow>
      <Card title="SPL Nonce" tone="violet">
        <code>Advance</code> checks the nonce and stores the next one. The next
        nonce is derived from the current nonce and a SHA-256 hash of the
        execution message.
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
