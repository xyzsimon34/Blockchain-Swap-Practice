"use client";

import { useState } from "react";
import { TokenChart } from "@/components/TokenChart/Chart";
import { ChartErrorBoundary } from "@/components/TokenChart/ErrorBoundary";
import Image from "next/image";

interface ChainConfig {
  id: number;
  name: string;
  icon: string;
  tokens: {
    address: string;
    symbol: string;
    name: string;
  }[];
}

const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: 1,
    name: "Ethereum",
    icon: "/tokens/eth.svg",
    tokens: [
      {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        symbol: "ETH",
        name: "Ethereum",
      },
    ],
  },
  {
    id: 0,
    name: "Bitcoin",
    icon: "/tokens/bitcoin.svg",
    tokens: [
      {
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        symbol: "BTC",
        name: "Bitcoin",
      },
    ],
  },
  {
    id: 56,
    name: "BSC",
    icon: "/tokens/bnb.svg",
    tokens: [
      {
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        symbol: "WBNB",
        name: "Wrapped BNB",
      },
    ],
  },
  {
    id: 137,
    name: "Polygon",
    icon: "/tokens/matic.svg", // 更新圖標路徑
    tokens: [
      {
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        symbol: "WMATIC",
        name: "Wrapped MATIC",
      },
    ],
  },
];

export default function SwapPage() {
  const [selectedChain, setSelectedChain] = useState<ChainConfig>(
    SUPPORTED_CHAINS[0]
  );
  const [selectedToken, setSelectedToken] = useState(
    SUPPORTED_CHAINS[0].tokens[0]
  );

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <nav className="border-b border-gray-800 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">DEX</h1>
          <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
            連接錢包
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 鏈和代幣選擇器 */}
        <div className="mb-6 flex gap-4">
          {/* 鏈選擇器 */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">選擇網絡</label>
            <div className="relative">
              <select
                value={selectedChain.id}
                onChange={(e) => {
                  const chain = SUPPORTED_CHAINS.find(
                    (c) => c.id === Number(e.target.value)
                  );
                  if (chain) {
                    setSelectedChain(chain);
                    setSelectedToken(chain.tokens[0]);
                  }
                }}
                className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SUPPORTED_CHAINS.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
              {/* 顯示選中的鏈圖標 */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Image
                  src={selectedChain.icon}
                  alt={selectedChain.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>

          {/* 代幣選擇器 */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">選擇代幣</label>
            <div className="relative">
              <select
                value={selectedToken.address}
                onChange={(e) => {
                  const token = selectedChain.tokens.find(
                    (t) => t.address === e.target.value
                  );
                  if (token) {
                    setSelectedToken(token);
                  }
                }}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedChain.tokens.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 圖表區域 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <ChartErrorBoundary>
            <TokenChart
              tokenAddress={selectedToken.address}
              chainId={selectedChain.id}
            />
          </ChartErrorBoundary>
        </div>

        {/* 代幣信息卡片 */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src={selectedChain.icon}
              alt={selectedChain.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold">{selectedToken.symbol}</h3>
              <p className="text-gray-400">{selectedToken.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">網絡</p>
              <p className="font-medium">{selectedChain.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">合約地址</p>
              <p className="font-mono text-sm truncate">
                {selectedToken.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
