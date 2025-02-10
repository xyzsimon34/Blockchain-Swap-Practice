"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EChainType } from "@/constant/enum/chain.types";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

interface TokenSelectorProps {
  label?: string;
  value: Token | null;
  onChange: (token: Token) => void;
  chainType: EChainType;
  className?: string;
}

// 模擬代幣列表
const mockTokens: Record<EChainType, Token[]> = {
  [EChainType.ETHEREUM]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      logoURI: "/tokens/eth.png",
    },
    {
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      logoURI: "/tokens/usdt.png",
    },
  ],
  [EChainType.BINANCE]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "BNB",
      name: "Binance Coin",
      decimals: 18,
      logoURI: "/tokens/bnb.png",
    },
    {
      address: "0x55d398326f99059ff775485246999027b3197955",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 18,
      logoURI: "/tokens/usdt.png",
    },
  ],
  [EChainType.TRON]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "TRX",
      name: "TRON",
      decimals: 6,
      logoURI: "/tokens/trx.png",
    },
    {
      address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      logoURI: "/tokens/usdt.png",
    },
  ],
  [EChainType.POLYGON]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "MATIC",
      name: "Polygon",
      decimals: 18,
      logoURI: "/tokens/matic.png",
    },
    {
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      logoURI: "/tokens/usdt.png",
    },
  ],
  [EChainType.POLYGON_ZKEVM]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      logoURI: "/tokens/eth.png",
    },
    {
      address: "0x1E4a5963aBFD975d8c9021ce480b42188849D41d",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      logoURI: "/tokens/usdt.png",
    },
  ],
};

export default function TokenSelector({
  value,
  onChange,
  chainType,
  className = "",
}: TokenSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 
                     rounded-xl transition-colors"
      >
        {value?.logoURI && (
          <img
            src={value.logoURI}
            alt={value.symbol}
            className="w-6 h-6 rounded-full"
          />
        )}
        <span className="font-medium">
          {value?.symbol || t("token.select")}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-medium mb-4">{t("token.select")}</h3>

            <input
              type="text"
              placeholder={t("token.search")}
              className="w-full px-4 py-2 bg-gray-800 rounded-xl mb-4"
            />

            <div className="space-y-2">
              {mockTokens[chainType]?.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onChange(token);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl"
                >
                  {token.logoURI && (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="text-left">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-400">{token.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
