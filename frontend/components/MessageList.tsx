"use client";

import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { MESSAGE_BOARD_ADDRESS, MESSAGE_BOARD_ABI } from "@/lib/config";
import { MessageReactions } from "@/components/MessageReactions";

type Message = {
  author: `0x${string}`;
  content: string;
  timestamp: bigint;
};

function formatAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) * 1000).toLocaleString();
}

export function MessageList({ refetchSignal }: { refetchSignal: number }) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: MESSAGE_BOARD_ADDRESS,
    abi: MESSAGE_BOARD_ABI,
    functionName: "getMessages",
  });

  useEffect(() => {
    if (refetchSignal > 0) refetch();
  }, [refetchSignal, refetch]);

  const messages = (data as Message[] | undefined) ?? [];
  // Pair each message with its original index (= on-chain messageId) then reverse
  const sorted = messages
    .map((msg, i) => ({ msg, id: BigInt(i) }))
    .reverse();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-sm">
        Failed to load messages: {error.message}
      </p>
    );
  }

  if (sorted.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        No messages yet. Be the first to post!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map(({ msg, id }) => (
        <div
          key={id.toString()}
          className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <p className="text-gray-100 leading-relaxed">{msg.content}</p>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
            <span className="font-mono bg-gray-800 px-2 py-0.5 rounded">
              {formatAddress(msg.author)}
            </span>
            <span>{formatDate(msg.timestamp)}</span>
          </div>
          <MessageReactions messageId={id} />
        </div>
      ))}
    </div>
  );
}
