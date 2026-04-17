import { defineChain } from "viem";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";

export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
  },
  testnet: true,
});

export const MESSAGE_BOARD_ADDRESS =
  "0x1C458f4abc7f76c7BeB733bB342b9D4b7639f39f" as const;

export const MESSAGE_BOARD_ABI = [
  {
    type: "function",
    name: "postMessage",
    inputs: [{ name: "content", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getMessages",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct MessageBoard.Message[]",
        components: [
          { name: "author", type: "address", internalType: "address" },
          { name: "content", type: "string", internalType: "string" },
          { name: "timestamp", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMessageCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "sayGM",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getDailyGMCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addReaction",
    inputs: [
      { name: "messageId", type: "uint256", internalType: "uint256" },
      { name: "emoji", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getReactions",
    inputs: [{ name: "messageId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct MessageBoard.ReactionData[]",
        components: [
          { name: "emoji", type: "string", internalType: "string" },
          { name: "count", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "MessagePosted",
    inputs: [
      { name: "author", type: "address", indexed: true, internalType: "address" },
      { name: "content", type: "string", indexed: false, internalType: "string" },
      { name: "timestamp", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GMSaid",
    inputs: [
      { name: "who", type: "address", indexed: true, internalType: "address" },
      { name: "timestamp", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ReactionAdded",
    inputs: [
      { name: "messageId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "reactor", type: "address", indexed: true, internalType: "address" },
      { name: "emoji", type: "string", indexed: false, internalType: "string" },
    ],
    anonymous: false,
  },
] as const;

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  connectors: [injected()],
  transports: {
    [arcTestnet.id]: http(),
  },
});
