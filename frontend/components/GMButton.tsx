"use client";

import { useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MESSAGE_BOARD_ADDRESS, MESSAGE_BOARD_ABI, arcTestnet } from "@/lib/config";

export function GMButton() {
  const { isConnected, chainId } = useAccount();
  const isReady = isConnected && chainId === arcTestnet.id;

  const { data: gmCount, refetch } = useReadContract({
    address: MESSAGE_BOARD_ADDRESS,
    abi: MESSAGE_BOARD_ABI,
    functionName: "getDailyGMCount",
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  function handleGM() {
    if (!isReady || isPending || isConfirming) return;
    writeContract({
      address: MESSAGE_BOARD_ADDRESS,
      abi: MESSAGE_BOARD_ABI,
      functionName: "sayGM",
    });
  }

  const count = gmCount !== undefined ? Number(gmCount) : null;

  return (
    <div className="flex items-center gap-2">
      {count !== null && (
        <span className="text-xs text-gray-500">
          {count} GM{count !== 1 ? "s" : ""} today
        </span>
      )}
      <button
        onClick={handleGM}
        disabled={!isReady || isPending || isConfirming}
        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-medium text-sm transition-colors"
      >
        {isPending ? "Confirm…" : isConfirming ? "…" : "GM 🌅"}
      </button>
    </div>
  );
}
