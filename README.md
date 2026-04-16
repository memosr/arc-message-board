# Arc Message Board

> A decentralized message board built on Arc Testnet. Anyone can post a message — permanently stored on-chain.

🌐 **Live App:** https://frontend-one-beta-56.vercel.app  
📜 **Contract:** `0xfBCA0c086851c6f43Dfda5FF5159082985D765f9`  
🔍 **Explorer:** https://testnet.arcscan.app

---

## What it does

- Connect any browser wallet (MetaMask, Brave, Rainbow...)
- Post messages to Arc Testnet — stored permanently on-chain
- Read all messages with author address and timestamp
- 280 character limit per message

## Tech Stack

- **Smart Contract:** Solidity 0.8.30, Foundry
- **Frontend:** Next.js, wagmi, viem, Tailwind CSS
- **Network:** Arc Testnet (chainId: 5042002, gas token: USDC)
- **Deployed:** Vercel

## Contract

Deployed on Arc Testnet:
- **Address:** `0xfBCA0c086851c6f43Dfda5FF5159082985D765f9`
- **Functions:** `postMessage()`, `getMessages()`, `getMessageCount()`

## Run Locally

```bash
git clone https://github.com/memosr/arc-message-board
cd arc-message-board/frontend
npm install
npm run dev
```

## Deploy Contract

```bash
forge create src/MessageBoard.sol:MessageBoard \
  --rpc-url $ARC_TESTNET_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

---

Built with ❤️ on [Arc Testnet](https://arc.network)## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
