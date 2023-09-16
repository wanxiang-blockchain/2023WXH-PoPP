
## Setup

note that your `.env` file must have the RPC URL of the network you want to use, and an optional `MNEMONIC` and `BLOCK_EXPLORER_KEY`, defined like so, assuming you choose to use Mumbai network:

```bash
npm install
npm run compile
npx hardhat run scripts/deploy20230916-depoly.ts --network hardhat
```
