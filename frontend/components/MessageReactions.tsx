"use client";

import { useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MESSAGE_BOARD_ADDRESS, MESSAGE_BOARD_ABI, arcTestnet } from "@/lib/config";

const EMOJIS = ["👍", "❤️", "🔥"] as const;

type ReactionData = { emoji: string; count: bigint };

export function MessageReactions({ messageId }: { messageId: bigint }) {
  const { isConnected, chainId } = useAccount();
  const isReady = isConnected && chainId === arcTestnet.id;

  const { data, refetch } = useReadContract({
    address: MESSAGE_BOARD_ADDRESS,
    abi: MESSAGE_BOARD_ABI,
    functionName: "getReactions",
    args: [messageId],
  });

  const { writeContract, data: hash, isPending, variables } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  const pendingEmoji = isPending || isConfirming
    ? (variables?.args?.[1] as string | undefined)
    : undefined;

  const reactions = (data as ReactionData[] | undefined) ?? [];

  function countFor(emoji: string) {
    const r = reactions.find((r) => r.emoji === emoji);
    return r ? Number(r.count) : 0;
  }

  function handleReact(emoji: string) {
    if (!isReady || isPending || isConfirming) return;
    writeContract({
      address: MESSAGE_BOARD_ADDRESS,
      abi: MESSAGE_BOARD_ABI,
      functionName: "addReaction",
      args: [messageId, emoji],
    });
  }

  return (
    <div className="flex gap-2 mt-3">
      {EMOJIS.map((emoji) => {
        const count = countFor(emoji);
        const loading = pendingEmoji === emoji;
        return (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            disabled={!isReady || isPending || isConfirming}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors border ${
              count > 0
                ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                : "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            } hover:border-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>{emoji}</span>
            {loading ? (
              <span className="opacity-60">…</span>
            ) : count > 0 ? (
              <span>{count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
