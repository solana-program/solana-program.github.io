import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Welcome to the new home of the Solana Program Library!</h1>
      <h3 className="mb-4 text-2x1">
        The{' '}
        <Link
          href="https://github.com/solana-program"
          className="text-fd-foreground font-semibold underline"
        >
          Solana Program
        </Link> organization
        contains a collection of on-chain programs targeting the{' '}
        <Link
          href="https://www.anza.xyz/blog/the-solana-ebpf-virtual-machine"
          className="text-fd-foreground font-semibold underline"
        >
          Solana Virtual Machine
        </Link>.
      </h3>
      <h3 className="mb-4 text-2x1">
        All programs are currently maintained by{' '}
        <Link
          href="https://www.anza.xyz"
          className="text-fd-foreground font-semibold underline"
        >
          Anza
        </Link>.
      </h3>
      <p className="text-fd-muted-foreground">
        Go to{' '}
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          /docs
        </Link>{' '}
        for up-to-date program-specific documentation.
      </p>
      <p className="text-fd-muted-foreground">
        Old docs still exist at{' '}
        <Link
          href="https://spl.solana.com"
          className="text-fd-foreground font-semibold underline"
        >
          https://spl.solana.com
        </Link>.
      </p>
    </main>
  );
}
