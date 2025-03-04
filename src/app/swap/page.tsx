"use client";

import { TokenChart } from "@/components/TokenChart/Chart";

export default function SwapPage() {
  // 使用有效的測試地址和鏈 ID
  const testTokenAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"; // 例如：WBTC
  const testChainId = 1; // Ethereum Mainnet

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="container max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">代幣交換</h1>

        <div className="mb-6">
          <TokenChart tokenAddress={testTokenAddress} chainId={testChainId} />
        </div>
      </div>
    </main>
  );
}
