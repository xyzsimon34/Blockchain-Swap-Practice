"use client";

import { useState } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { erc20ABI } from "wagmi";
import { parseUnits } from "viem";
import { toast } from "react-toastify";

interface TokenTransferProps {
  tokenAddress: string;
  decimals?: number;
}

export function TokenTransfer({
  tokenAddress,
  decimals = 18,
}: TokenTransferProps) {
  const [recipient, setRecipient] = useState("");

  const [amount, setAmount] = useState("");

  const { write: transfer, data: transferData } = useContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: erc20ABI,
    functionName: "transfer",
  });

  const { isLoading: isTransferPending } = useWaitForTransaction({
    hash: transferData?.hash,
    onSuccess() {
      toast.success("轉帳成功！");
      setRecipient("");
      setAmount("");
    },
    onError() {
      toast.error("轉帳失敗");
    },
  });

  const handleTransfer = async () => {
    try {
      if (!recipient || !amount) {
        toast.error("請填寫完整資訊");
        return;
      }

      const parsedAmount = parseUnits(amount, decimals);

      transfer({
        args: [recipient, parsedAmount],
      });
    } catch (error) {
      toast.error("轉帳失敗");
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Token Transfer</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Transfer Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0.0"
          />
        </div>
        <button
          onClick={handleTransfer}
          disabled={isTransferPending}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isTransferPending ? "Processing..." : "Transfer"}
        </button>
      </div>
    </div>
  );
}
