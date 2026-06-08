---
title: Project Status
---

All clusters have the latest Token-2022 program deployed, including confidential
transfer functionality.

Confidential transfers depend on the [ZK ElGamal Proof
Program](https://docs.anza.xyz/runtime/zk-elgamal-proof), which performs the
on-chain verification of the zero-knowledge proofs used by the confidential
extensions. Using confidential tokens requires a cluster running a version of
the runtime with that program enabled.

## Upgradability

To facilitate deploying updates and security fixes, the program deployment remains
upgradable. Once audits are complete and the program has been stable for six months,
the deployment will be marked final and no further upgrades will be possible.

## Future work

### Wallets

To start, wallets need to properly handle the Token-2022 program and its accounts,
by fetching Token-2022 accounts and sending instructions to the proper program.

To use confidential tokens, wallets additionally need to create zero-knowledge
proofs, which entails a new transaction flow. See the [Confidential Balances
guide](/docs/confidential-balances) for the full flow.
