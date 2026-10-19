'use client';

import { useEffect, useState } from 'react';
import { Card, FlowArrow } from '@/components/programmatic-signer/diagram';
import {
  base58Decode,
  base58Encode,
  decodeAddress,
  findProgramAddress,
} from '@/lib/pda';

const ATA_PROGRAM_ID = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
const TOKEN_PROGRAMS = [
  { name: 'Token', id: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
  { name: 'Token-2022', id: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCAT8FT1rW' },
] as const;

type Derivation =
  | { key: string; address: string; bump: number }
  | { key: string; failed: true };

const pill =
  'rounded-full border border-current/25 px-2 py-0.5 text-xs font-medium opacity-80 hover:opacity-100 aria-pressed:border-current/60 aria-pressed:bg-current/10 aria-pressed:opacity-100';

function AddressInput({
  label,
  value,
  invalid,
  onChange,
}: {
  label: string;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <>
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value.trim())}
        spellCheck={false}
        autoComplete="off"
        aria-invalid={invalid}
        className="w-full min-w-0 grow basis-64 rounded-md border border-current/25 bg-transparent px-1 py-1 font-mono text-xs aria-invalid:border-red-500 sm:px-2 sm:text-sm"
      />
      {invalid && (
        <div
          role="alert"
          className="basis-full text-sm text-red-700 dark:text-red-400"
        >
          Invalid address
        </div>
      )}
    </>
  );
}

export function AtaDerivationDiagram() {
  const [wallet, setWallet] = useState(
    'By3VL9vKM3zdycTuLTATo9bNGmRHp57GQPVjVhb1mHqT',
  );
  const [tokenProgram, setTokenProgram] = useState<string>(
    TOKEN_PROGRAMS[0].id,
  );
  const [mint, setMint] = useState(
    'EPjFWJd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  );
  const [derivation, setDerivation] = useState<Derivation>();
  const [keygenFailed, setKeygenFailed] = useState(false);

  useEffect(() => {
    const walletBytes = decodeAddress(wallet);
    const mintBytes = decodeAddress(mint);
    if (!walletBytes || !mintBytes) return;
    const key = `${wallet} ${tokenProgram} ${mint}`;
    let current = true;
    findProgramAddress(
      [walletBytes, base58Decode(tokenProgram), mintBytes],
      base58Decode(ATA_PROGRAM_ID),
    ).then(
      ({ address, bump }) => {
        if (current)
          setDerivation({ key, address: base58Encode(address), bump });
      },
      () => {
        if (current) setDerivation({ key, failed: true });
      },
    );
    return () => {
      current = false;
    };
  }, [wallet, tokenProgram, mint]);

  async function randomWallet() {
    try {
      // Non-extractable so the private key can never be read; public keys are always exportable.
      const { publicKey } = await crypto.subtle.generateKey(
        { name: 'Ed25519' },
        false,
        ['sign', 'verify'],
      );
      const raw = await crypto.subtle.exportKey('raw', publicKey);
      setWallet(base58Encode(new Uint8Array(raw)));
    } catch {
      setKeygenFailed(true);
    }
  }

  const walletInvalid = decodeAddress(wallet) === null;
  const mintInvalid = decodeAddress(mint) === null;
  const pending = derivation?.key !== `${wallet} ${tokenProgram} ${mint}`;
  let resultText = 'Deriving…';
  if (walletInvalid || mintInvalid)
    resultText = 'Enter a valid owner and mint address.';
  else if (derivation && 'failed' in derivation)
    resultText = 'Could not derive the address.';
  else if (derivation) resultText = derivation.address;
  const bump =
    !walletInvalid && !mintInvalid && derivation && 'bump' in derivation
      ? derivation.bump
      : undefined;

  return (
    <figure className="not-prose mx-auto my-8 max-w-2xl">
      <div className="grid gap-3">
        <div className="rounded-xl border-2 border-dashed border-neutral-400 p-3 sm:p-4 dark:border-neutral-500">
          <div className="text-xs/5 font-medium tracking-wide text-fd-foreground/80 uppercase">
            Wallet
          </div>
          <div className="text-base font-semibold">Owner</div>
          <div className="mt-1 text-base leading-relaxed">
            The wallet that will own the token account.
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <AddressInput
              label="Owner wallet address"
              value={wallet}
              invalid={walletInvalid}
              onChange={setWallet}
            />
            {keygenFailed ? (
              <span className="text-sm text-fd-foreground/80">
                This browser cannot generate a random Ed25519 wallet.
              </span>
            ) : (
              <button type="button" onClick={randomWallet} className={pill}>
                Random wallet
              </button>
            )}
          </div>
        </div>
        <Card title="Token program" tone="teal">
          The program that will hold the account, Token or Token-2022.
          <div
            role="group"
            aria-label="Token program"
            className="mt-2 flex gap-2"
          >
            {TOKEN_PROGRAMS.map(({ name, id }) => (
              <button
                key={id}
                type="button"
                aria-pressed={id === tokenProgram}
                onClick={() => setTokenProgram(id)}
                className={pill}
              >
                {name}
              </button>
            ))}
          </div>
          <code className="mt-2 block font-mono text-xs break-all sm:text-sm">
            {tokenProgram}
          </code>
        </Card>
        <Card title="Mint" tone="gray">
          The token the account will hold.
          <div className="mt-2 flex flex-wrap gap-2">
            <AddressInput
              label="Mint address"
              value={mint}
              invalid={mintInvalid}
              onChange={setMint}
            />
          </div>
        </Card>
      </div>
      <FlowArrow>
        <code className="[overflow-wrap:anywhere]">
          find_program_address([wallet, token_program, mint], {ATA_PROGRAM_ID})
        </code>
      </FlowArrow>
      <Card title="Associated token account" tone="violet">
        <div aria-live="polite" aria-busy={pending}>
          <div
            className={`font-mono text-xs break-all sm:text-sm ${pending ? 'opacity-60' : ''}`}
          >
            {resultText}
          </div>
          {bump !== undefined && <div className="mt-1">Bump: {bump}</div>}
        </div>
      </Card>
      <figcaption className="mt-4 text-sm/6 text-fd-foreground/80">
        Switch between Token and Token-2022: the same wallet and mint give a
        different associated token account, because the token program is one of
        the seeds. Everything runs in your browser, and Random wallet keeps only
        a new public key.
      </figcaption>
    </figure>
  );
}
