import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Solana Program (Library)</h1>
      <h3 className="mb-4 text-2x1">
        The <a href="https://github.com/solana-program">Solana Program</a> organization
        contains a collection of on-chain programs targeting the <a href="https://www.anza.xyz/blog/the-solana-ebpf-virtual-machine">Solana Virtual Machine</a>.
      </h3>
      <h3 className="mb-4 text-2x1">
        These programs are tested against the <a href="https://github.com/anza-xyz/agave/">Agave</a> implementation of the SVM and deployed to Solana mainnet-beta.
      </h3>
      <h3 className="mb-4 text-2x1">
        All programs are currently maintained by <a href="https://www.anza.xyz">Anza</a>.
      </h3>
      <p className="text-fd-muted-foreground">
        You can open{' '}
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          /docs
        </Link>{' '}
        to see program-specific documentation.
      </p>
    </main>
  );
}
