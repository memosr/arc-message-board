import { defineChain } from "viem";
import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";

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
  "0xfBCA0c086851c6f43Dfda5FF5159082985D765f9" as const;

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
    type: "event",
    name: "MessagePosted",
    inputs: [
      { name: "author", type: "address", indexed: true, internalType: "address" },
      { name: "content", type: "string", indexed: false, internalType: "string" },
      { name: "timestamp", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
] as const;

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  connectors: [metaMask()],
  transports: {
    [arcTestnet.id]: http(),
  },
});
