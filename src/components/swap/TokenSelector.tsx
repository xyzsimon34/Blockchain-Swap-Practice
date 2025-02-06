"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EChainType } from "@/constant/enum/chain.types";

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
  label,
  value,
  onChange,
  chainType,
  className = "w-full",
}: TokenSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const tokens = mockTokens[chainType] || [];

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-2 border rounded-lg"
      >
        <span>{value?.symbol || t("token.select")}</span>
        <span>▼</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-lg p-4 max-w-md w-full max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-medium mb-4">{t("token.select")}</h3>
            <div className="space-y-2">
              {tokens.map((token) => (
                <button
                  key={token.address}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    onChange(token);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    {token.logoURI && (
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-6 h-6 mr-2 rounded-full"
                      />
                    )}
                    <div>
                      <div>{token.symbol}</div>
                      <div className="text-sm text-gray-500">{token.name}</div>
                    </div>
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
