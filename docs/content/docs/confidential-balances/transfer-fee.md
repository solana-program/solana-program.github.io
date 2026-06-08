---
title: Confidential Transfer Fees
description: Collect Token-2022 transfer fees on confidential transfers without revealing the fee or transfer amount.
---

The [transfer fee](/docs/token-2022/extensions#transfer-fees) extension lets a
mint charge a fee on every transfer. The fee is withheld on the recipient's
account, harvested to the mint, and later withdrawn by the fee authority.

That flow assumes the transfer amount is public: the program computes the fee
from the cleartext amount. When transfers are [confidential](/docs/confidential-balances),
the amount is encrypted, so the fee has to be handled confidentially too. The
`ConfidentialTransferFeeConfig` extension provides this. It is used alongside the
regular transfer fee extension on mints that also enable confidential transfers.

## What it does

On a confidential transfer, the fee is computed and withheld as an **encrypted
amount**. Withheld fees accumulate confidentially on the accounts that received
transfers, then follow the same harvest-then-withdraw lifecycle as ordinary
transfer fees, except every fee amount stays encrypted along the way.

Like the other confidential extensions, it must be initialized at mint creation
and cannot be added later.

## State

- **Mint** (`ConfidentialTransferFeeConfig`):
  - A withdraw-withheld-authority ElGamal public key. Withheld fees are encrypted
    under this key, so whoever holds the corresponding secret key can decrypt
    withheld fee amounts. Combined with the public fee parameters, this can reveal
    information about transfer amounts, so treat the key accordingly.
  - A `harvest_to_mint_enabled` flag controlling whether accounts may harvest
    their withheld fees to the mint.
  - The encrypted total of fees that have been harvested to the mint and are
    awaiting withdrawal.
- **Token account** (`ConfidentialTransferFeeAmount`): the encrypted fee withheld
  on that account, waiting to be harvested to the mint.

## Lifecycle

The flow mirrors the non-confidential transfer fee flow:

1. **Withhold on transfer**: each confidential transfer encrypts the fee and adds
   it to the destination account's withheld balance.
2. **Harvest to mint**: `HarvestWithheldTokensToMint` is a permissionless
   instruction that moves the encrypted withheld fees from accounts into the
   mint. It succeeds even for frozen accounts. The mint authority can turn this on
   or off for the mint with `EnableHarvestToMint` and `DisableHarvestToMint`.
3. **Withdraw from the mint**: the withdraw-withheld authority moves the harvested
   fees out of the mint with `WithdrawWithheldTokensFromMint`.
4. **Withdraw directly from accounts**: the authority can also pull withheld fees
   straight from accounts with `WithdrawWithheldTokensFromAccounts`, skipping the
   harvest step.

Withdrawals require zero-knowledge proofs, supplied in the same transaction or
pre-verified into proof context state accounts, just like confidential transfers.

> **Front-running note**: withdrawing withheld fees from accounts depends on the
> encrypted withheld amount at the time the proof is generated. If new transfers
> add to an account's withheld fees between proof generation and execution, the
> withdraw can fail. Harvesting to the mint first, then withdrawing from the mint,
> avoids this race.
