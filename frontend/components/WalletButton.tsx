"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/lib/config";

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const onWrongChain = isConnected && chainId !== arcTestnet.id;

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium text-sm transition-colors"
      >
        {isPending ? "Connecting…" : "Connect Wallet"}
      </button>
    );
  }

  if (onWrongChain) {
    return (
      <button
        onClick={() => switchChain({ chainId: arcTestnet.id })}
        className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 font-medium text-sm transition-colors"
      >
        Switch to Arc Testnet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 font-mono">
        {address?.slice(0, 6)}…{address?.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 text-sm transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
}
