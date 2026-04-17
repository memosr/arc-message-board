# Arc Message Board

> A decentralized message board on Arc Testnet. Post messages, react with emojis, say GM — all on-chain.

🌐 **Live App:** https://frontend-one-beta-56.vercel.app  
📜 **Contract:** `0x1C458f4abc7f76c7BeB733bB342b9D4b7639f39f`  
🔍 **Explorer:** https://testnet.arcscan.app

---

## Features

- 💬 **Post messages** — stored permanently on-chain (280 char limit)
- 🌅 **Say GM** — daily on-chain GM counter, tracks unique addresses per day
- 👍 ❤️ 🔥 **React to messages** — emoji reactions stored on-chain
- 🔗 **Connect any wallet** — MetaMask, Brave, Rainbow, or any injected wallet

## Tech Stack

- **Smart Contract:** Solidity 0.8.30, Foundry
- **Frontend:** Next.js, wagmi, viem, Tailwind CSS
- **Network:** Arc Testnet (chainId: 5042002, gas token: USDC)
- **Deployed:** Vercel

## Contract Functions

- `postMessage(string content)` — post a new message
- `getMessages()` — read all messages
- `sayGM()` — record today's GM (one per address per day)
- `getDailyGMCount()` — get today's unique GM count
- `addReaction(uint256 messageId, string emoji)` — react to a message
- `getReactions(uint256 messageId)` — get all reactions for a message

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

Built with ❤️ on [Arc Testnet](https://arc.network)
