---
title: Confidential Mint and Burn
description: Keep a Token-2022 mint's supply confidential by minting and burning directly against confidential balances.
---

The base [confidential balances](/docs/confidential-balances) feature keeps
individual account balances and transfer amounts private, but the mint's total
supply is still public: tokens enter the confidential system through a public
`deposit` and leave through a public `withdraw`, both of which move a cleartext
amount between the public and confidential balances.

For some issuers that is not enough. A stablecoin or tokenized asset issuer may
want the amount they mint and burn, and therefore the total supply in
circulation, to stay private as well. The `ConfidentialMintBurn` extension makes
this possible.

## What it does

When a mint enables the confidential mint/burn extension, the authority mints new
tokens directly into a recipient's confidential balance and burns tokens directly
from a confidential balance. The amounts are encrypted, and the mint tracks an
**encrypted total supply** rather than a public one.

Because issuance and redemption now happen entirely inside the confidential
system, the public conversion path is disabled: `deposit` and `withdraw`
instructions are rejected on a mint that has this extension. Tokens only ever
exist confidentially, so there is no cleartext supply to observe.

Like the other confidential extensions, it must be initialized at mint creation
and cannot be added later.

## Mint state

The extension stores the supply confidentially on the mint:

- **Confidential supply**: the encrypted total supply, encrypted under the mint's
  supply ElGamal public key.
- **Decryptable supply**: an authenticated symmetric (AES) ciphertext of the
  supply, so the authority can read the current supply efficiently without
  solving a discrete log.
- **Supply ElGamal public key**: the key the confidential supply is encrypted
  under.
- **Pending burn**: burned amounts that have not yet been aggregated into the
  confidential supply (see [applying pending burns](#applying-pending-burns)).

## Operations

All amount-carrying operations require zero-knowledge proofs, supplied either in
the same transaction or pre-verified into proof context state accounts, exactly
as with confidential transfers.

### Minting

The mint authority mints an encrypted amount into a recipient's confidential
pending balance. The recipient applies their pending balance to make the funds
available, just like receiving a confidential transfer. The minted amount is
homomorphically added to the encrypted supply.

### Burning

A holder burns an encrypted amount from their confidential available balance. The
burned amount accumulates in the mint's **pending burn** field rather than being
subtracted from the supply immediately.

### Applying pending burns

Burns are aggregated into the confidential supply in a separate step. The
`ApplyPendingBurn` instruction folds the accumulated pending burn into the
confidential supply, mirroring the pending/available model used for account
balances. This keeps burning cheap and lets the supply be reconciled
periodically.

### Rotating the supply key

The supply encryption key can be rotated with `RotateSupplyElGamalPubkey`, which
re-encrypts the confidential supply under a new ElGamal key and proves, with a
ciphertext-ciphertext equality proof, that the encrypted value did not change.
The pending burn must be zero before rotating.

### Updating the decryptable supply

`UpdateDecryptableSupply` refreshes the AES ciphertext of the supply, for example
after the authority changes the symmetric key used to read it.

## Closing the mint

A mint with this extension can only be closed once its confidential supply is the
zero ciphertext. If the supply encrypts zero but is not an identically-zero
ciphertext, rotate the supply key first to normalize it, then close the mint.

## Relationship to permissioned burn

The [permissioned burn](/docs/token-2022/extensions#permissioned-burn) extension
also has a confidential burn path. When both extensions are present, a
confidential burn must additionally be co-signed by the mint's configured
permissioned burn authority.
