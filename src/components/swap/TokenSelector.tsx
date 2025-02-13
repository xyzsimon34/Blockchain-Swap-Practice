// src/components/swap/TokenSelector.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EChainType } from "@/constant/enum/chain.types";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Token } from "@/types/swap.types";
import Image from "next/image";
import { getTokenIcon } from "@/constant/tokenIcons";

interface TokenSelectorProps {
  label?: string;
  value: Token | null;
  onChange: (token: Token) => void;
  chainType: EChainType;
  className?: string;
  disabled?: boolean;
}

// 模擬代幣列表
const mockTokens: Record<EChainType, Token[]> = {
  [EChainType.ETHEREUM]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      chainId: EChainType.ETHEREUM, // 添加 chainId
    },
    {
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      chainId: EChainType.ETHEREUM,
    },
  ],
  [EChainType.BINANCE]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "BNB",
      name: "Binance Coin",
      decimals: 18,
      chainId: EChainType.BINANCE,
    },
    {
      address: "0x55d398326f99059ff775485246999027b3197955",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 18,
      chainId: EChainType.BINANCE,
    },
  ],
  [EChainType.POLYGON]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "MATIC",
      name: "Polygon",
      decimals: 18,
      chainId: EChainType.POLYGON,
    },
    {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      chainId: EChainType.POLYGON,
    },
  ],
  [EChainType.TRON]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "TRX",
      name: "TRON",
      decimals: 6,
      chainId: EChainType.TRON,
    },
    {
      address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      chainId: EChainType.TRON,
    },
  ],
  [EChainType.POLYGON_ZKEVM]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      chainId: EChainType.POLYGON_ZKEVM,
    },
    {
      address: "0x1E4a5963aBFD975d8c9021ce480b42188849D41d",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      chainId: EChainType.POLYGON_ZKEVM,
    },
  ],
};

export default function TokenSelector({
  value,
  onChange,
  chainType,
  className = "",
  disabled = false,
}: TokenSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // 過濾代幣列表
  const filteredTokens = mockTokens[chainType]?.filter((token) => {
    const query = searchQuery.toLowerCase();
    return (
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  });

  const handleImageError = (symbol: string) => {
    setImageError((prev) => ({ ...prev, [symbol]: true }));
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 bg-gray-700/50 
                   hover:bg-gray-700 rounded-xl transition-colors
                   ${
                     disabled
                       ? "cursor-not-allowed opacity-60"
                       : "hover:bg-gray-700"
                   }`}
        disabled={disabled}
      >
        {value && (
          <div className="relative w-6 h-6">
            <Image
              src={
                !imageError[value.symbol]
                  ? getTokenIcon(value.symbol)
                  : "/tokens/default-token.svg"
              }
              alt={value.symbol}
              width={24}
              height={24}
              className="rounded-full"
              onError={() => handleImageError(value.symbol)}
              priority
            />
          </div>
        )}
        <span className="font-medium">
          {value?.symbol || t("token.select")}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{t("token.select")}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="sr-only">Close</span>×
              </button>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("token.search")}
              className="w-full px-4 py-2 bg-gray-800 rounded-xl mb-4 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="space-y-2">
              {filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onChange(token);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 
                           rounded-xl transition-colors"
                >
                  <div className="relative w-8 h-8">
                    <Image
                      src={
                        !imageError[token.symbol]
                          ? getTokenIcon(token.symbol)
                          : "/tokens/default-token.svg"
                      }
                      alt={token.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                      onError={() => handleImageError(token.symbol)}
                      priority
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-400">{token.name}</div>
                  </div>
                </button>
              ))}

              {filteredTokens.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  {t("token.noResults")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
