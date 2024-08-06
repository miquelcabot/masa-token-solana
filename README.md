# 🌽 Masa Token smart contract for Solana

The Omnichain Fungible Token (OFT) Standard allows fungible tokens to be transferred across multiple blockchains without asset wrapping or middlechains.

This standard works by burning tokens on the source chain whenever an omnichain transfer is initiated, sending a message via the protocol, and delivering a function call to the destination contract to mint the same number of tokens burned. This creates a unified supply across all networks LayerZero supports that the OFT is deployed on.

[Reference LayerZero OFT example](https://github.com/LayerZero-Labs/example-oft)

## Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [Rust](https://www.rust-lang.org/tools/install)
* [Yarn](https://yarnpkg.com/getting-started/install)
* [Solana CLI](https://docs.solanalabs.com/cli/install)
* [Anchor](https://www.anchor-lang.com/docs/installation)

## Prepare ProgramId

create programId keypair files if not existed

```
solana-keygen new -o target/deploy/endpoint-keypair.json
solana-keygen new -o target/deploy/masatoken-keypair.json

anchor keys sync
```

## Build & Test

```bash
yarn && yarn build && yarn test
```

## Deploy

1. with anchor

   ```bash
   anchor build -v
   solana program deploy --program-id target/deploy/masatoken-keypair.json target/verifiable/masatoken.so -u mainnet-beta
   ```

   or

2. with solana-verify
   ```bash
   solana-verify build
   solana program deploy --program-id target/deploy/masatoken-keypair.json target/deploy/masatoken.so -u mainnet-beta
   ```

please visit [Solana Verify CLI](https://github.com/Ellipsis-Labs/solana-verifiable-build) and [Deploy a Solana Program with the CLI](https://docs.solanalabs.com/cli/examples/deploy-a-program) for more detail.

## Generation of a new release

From a clean `main` branch you can run the release task bumping the version accordingly based on semantic versioning:

```bash
yarn release
```

The task does the following:

* Bumps the project version in `package.json`
* Creates a Git tag
* Commits and pushes everything
* Creates a GitHub release with commit messages as description
* Git tag push will trigger a GitHub Action workflow to do a `npm` release

For the GitHub releases steps a GitHub personal access token, exported as `GITHUB_TOKEN` is required. You can add this
environment variable to the `.env` file. [Setup](https://github.com/release-it/release-it#github-releases)

#### Notice

If you encounter issues during compilation and testing, it might be due to the versions of Solana and Anchor. You can switch to Solana version `1.17.31` and Anchor version `0.29.0`, as these are the versions we have tested and verified to be working.