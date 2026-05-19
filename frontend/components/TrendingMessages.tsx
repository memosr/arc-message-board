"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { MESSAGE_BOARD_ADDRESS, MESSAGE_BOARD_ABI } from "@/lib/config";

type Message = {
  author: `0x${string}`;
  content: string;
  timestamp: bigint;
};

type ReactionData = { emoji: string; count: bigint };

const RANK_BADGES = ["🥇", "🥈", "🥉"];

function formatAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function TrendingMessages() {
  const { data: messagesData, isLoading: messagesLoading } = useReadContract({
    address: MESSAGE_BOARD_ADDRESS,
    abi: MESSAGE_BOARD_ABI,
    functionName: "getMessages",
  });

  const messages = (messagesData as Message[] | undefined) ?? [];

  const { data: reactionsData, isLoading: reactionsLoading } = useReadContracts({
    contracts: messages.map((_, i) => ({
      address: MESSAGE_BOARD_ADDRESS,
      abi: MESSAGE_BOARD_ABI,
      functionName: "getReactions" as const,
      args: [BigInt(i)] as [bigint],
    })),
    query: { enabled: messages.length > 0 },
  });

  const isLoading = messagesLoading || (messages.length > 0 && reactionsLoading);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-orange-100 dark:bg-orange-900/20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const ranked = messages
    .map((msg, i) => {
      const reactions = (reactionsData?.[i]?.result as ReactionData[] | undefined) ?? [];
      const totalReactions = reactions.reduce((sum, r) => sum + Number(r.count), 0);
      return { msg, id: BigInt(i), totalReactions };
    })
    .filter((item) => item.totalReactions > 0)
    .sort((a, b) => b.totalReactions - a.totalReactions)
    .slice(0, 3);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800/50 p-4">
      <h2 className="text-sm font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-3">
        🔥 Trending Messages
      </h2>

      {ranked.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-500 text-sm text-center py-4">
          No trending messages yet — be the first to react! 🚀
        </p>
      ) : (
        <div className="space-y-2">
          {ranked.map(({ msg, id, totalReactions }, rank) => (
            <div
              key={id.toString()}
              className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/50 border border-orange-100 dark:border-orange-900/50"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 leading-none mt-0.5">
                  {RANK_BADGES[rank]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed line-clamp-2">
                    {msg.content}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-mono text-xs bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">
                      {formatAddress(msg.author)}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 dark:text-orange-400">
                      🔥 {totalReactions}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
