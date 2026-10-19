const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function base58Encode(bytes: Uint8Array): string {
  let n = 0n;
  for (const byte of bytes) n = n * 256n + BigInt(byte);
  let text = '';
  while (n > 0n) {
    text = ALPHABET[Number(n % 58n)] + text;
    n /= 58n;
  }
  for (const byte of bytes) {
    if (byte !== 0) break;
    text = '1' + text;
  }
  return text;
}

export function base58Decode(text: string): Uint8Array {
  let n = 0n;
  for (const char of text) {
    const digit = ALPHABET.indexOf(char);
    if (digit < 0) throw new Error(`Invalid base58 character: ${char}`);
    n = n * 58n + BigInt(digit);
  }
  const bytes: number[] = [];
  while (n > 0n) {
    bytes.unshift(Number(n % 256n));
    n /= 256n;
  }
  for (const char of text) {
    if (char !== '1') break;
    bytes.unshift(0);
  }
  return Uint8Array.from(bytes);
}

export function decodeAddress(text: string): Uint8Array | null {
  // 32 bytes never need more than 44 characters; this also keeps BigInt
  // decoding of huge pastes from freezing the page.
  if (text.length > 44) return null;
  try {
    const bytes = base58Decode(text);
    return bytes.length === 32 ? bytes : null;
  } catch {
    return null;
  }
}

const P = 2n ** 255n - 19n;

function mod(a: bigint): bigint {
  const r = a % P;
  return r < 0n ? r + P : r;
}

function modPow(base: bigint, exponent: bigint): bigint {
  let result = 1n;
  base = mod(base);
  while (exponent > 0n) {
    if (exponent & 1n) result = (result * base) % P;
    base = (base * base) % P;
    exponent >>= 1n;
  }
  return result;
}

// Edwards curve constant d = -121665 / 121666 of Ed25519 (RFC 8032).
const D = mod(-121665n * modPow(121666n, P - 2n));

// On curve iff x² = (y² - 1) / (d·y² + 1) has a square root mod p, which by
// Euler's criterion means x²^((p - 1) / 2) is 0 or 1.
export function isOnCurve(bytes: Uint8Array): boolean {
  let y = 0n;
  for (let i = 31; i >= 0; i--) y = (y << 8n) | BigInt(bytes[i]);
  // The top bit holds the sign of x, not part of y.
  y &= (1n << 255n) - 1n;
  const y2 = mod(y * y);
  const x2 = mod((y2 - 1n) * modPow(D * y2 + 1n, P - 2n));
  return modPow(x2, (P - 1n) / 2n) <= 1n;
}

const PDA_MARKER = new TextEncoder().encode('ProgramDerivedAddress');

// Same search as find_program_address: the first bump from 255 down whose
// hash is off the curve, so no private key can exist for the address.
export async function findProgramAddress(
  seeds: Uint8Array[],
  programId: Uint8Array,
): Promise<{ address: Uint8Array; bump: number }> {
  for (let bump = 255; bump >= 0; bump--) {
    const input = Uint8Array.from(
      [...seeds, [bump], programId, PDA_MARKER].flatMap((part) => [...part]),
    );
    const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', input));
    if (!isOnCurve(hash)) return { address: hash, bump };
  }
  throw new Error('No bump seed gives an off-curve address');
}
