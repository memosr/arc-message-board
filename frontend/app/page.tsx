"use client";

import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { MessageList } from "@/components/MessageList";
import { PostMessage } from "@/components/PostMessage";

export default function Home() {
  const [refetchSignal, setRefetchSignal] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Arc Message Board</h1>
            <p className="text-xs text-gray-500">Arc Testnet · on-chain</p>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Post form */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            New Message
          </h2>
          <PostMessage onPosted={() => setRefetchSignal((s) => s + 1)} />
        </section>

        {/* Message feed */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Messages
          </h2>
          <MessageList refetchSignal={refetchSignal} />
        </section>
      </main>
    </div>
  );
}
