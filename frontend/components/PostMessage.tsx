"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MESSAGE_BOARD_ADDRESS, MESSAGE_BOARD_ABI, arcTestnet } from "@/lib/config";

const MAX_LENGTH = 280;

export function PostMessage({ onPosted }: { onPosted: () => void }) {
  const { isConnected, chainId } = useAccount();
  const [content, setContent] = useState("");

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const isReady = isConnected && chainId === arcTestnet.id;
  const remaining = MAX_LENGTH - content.length;
  const canSubmit = isReady && content.trim().length > 0 && remaining >= 0 && !isPending && !isConfirming;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    writeContract({
      address: MESSAGE_BOARD_ADDRESS,
      abi: MESSAGE_BOARD_ABI,
      functionName: "postMessage",
      args: [content.trim()],
    });
  }

  // clear + notify parent once confirmed
  if (isSuccess && content !== "") {
    setContent("");
    onPosted();
  }

  const error = writeError;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReady ? "Write a message…" : "Connect wallet to post"}
          disabled={!isReady || isPending || isConfirming}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-100 placeholder-gray-600 resize-none disabled:opacity-50 transition-colors"
        />
        <span
          className={`absolute bottom-3 right-3 text-xs ${
            remaining < 20 ? (remaining < 0 ? "text-red-400" : "text-amber-400") : "text-gray-600"
          }`}
        >
          {remaining}
        </span>
      </div>

      {error && (
        <p className="text-red-400 text-sm">
          {(error as Error).message?.slice(0, 120)}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-colors"
      >
        {isPending
          ? "Confirm in MetaMask…"
          : isConfirming
          ? "Confirming…"
          : "Post Message"}
      </button>
    </form>
  );
}
