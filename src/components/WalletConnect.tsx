"use client";

import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect, Connector } from "wagmi";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";

// Define wallet type
interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  supportedWallets?: Array<{
    name: string;
    icon: string;
  }>;
}

// Define supported wallets list
const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: "injected",
    name: "MetaMask",
    icon: "/metamask.svg",
  },
  {
    id: "BinanceW3W",
    name: "Binance Wallet",
    icon: "/binanceWallet.svg",
  },
  {
    id: "walletConnect",
    name: "WalletConnect",
    icon: "/walletconnect.svg",
    supportedWallets: [
      { name: "Trust Wallet", icon: "/trustwallet.svg" },
      { name: "TokenPocket", icon: "/tokenpocket.svg" },
      { name: "imToken", icon: "/imtoken.svg" },
      { name: "OKX Wallet", icon: "/okx.svg" },
      { name: "Bitget Wallet", icon: "/bitget.svg" },
    ],
  },
];

export function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const [showWalletList, setShowWalletList] = useState(false);

  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    onSuccess() {
      setShowWalletList(false);
      toast.success("Wallet connected successfully!");
    },
    onError(error) {
      toast.error(error.message || "Failed to connect wallet");
    },
  });

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect({
    onSuccess() {
      toast.success("Wallet disconnected");
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleWalletSelect = async (connector: Connector) => {
    try {
      await connect({ connector });
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const getWalletInfo = (connector: Connector): WalletInfo | undefined => {
    console.log("Connector details:", {
      id: connector.id,
      name: connector.name,
    });

    if (connector.id === "injected" && connector.name === "MetaMask") {
      return SUPPORTED_WALLETS[0];
    } else if (
      connector.id === "BinanceW3W" ||
      connector.name === "BinanceW3W"
    ) {
      return SUPPORTED_WALLETS[1];
    } else if (
      connector.id === "walletConnect" ||
      connector.name === "WalletConnect"
    ) {
      return SUPPORTED_WALLETS[2];
    }
    return undefined;
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (isConnected) {
            disconnect();
          } else {
            setShowWalletList(!showWalletList);
          }
        }}
        className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition-colors"
        data-tooltip-id="wallet-tooltip"
        data-tooltip-content={
          isConnected && address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : "Connect wallet"
        }
      >
        <img src="/wallet.svg" alt="wallet" className="h-6 w-6" />
      </button>
      <Tooltip id="wallet-tooltip" />

      {/* Wallet list modal */}
      {showWalletList && !isConnected && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2">
            <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
              Choose Wallet
            </div>
            {connectors.map((connector) => {
              const walletInfo = getWalletInfo(connector);
              if (!walletInfo) return null;

              return (
                <button
                  key={`${connector.id}-${walletInfo.name}`}
                  onClick={() => handleWalletSelect(connector)}
                  disabled={!connector.ready || isLoading}
                  className={`
                    w-full px-4 py-3 text-sm text-left text-gray-700 
                    hover:bg-gray-50 flex items-center gap-3
                    ${!connector.ready ? "opacity-50 cursor-not-allowed" : ""}
                    ${
                      isLoading && connector.id === pendingConnector?.id
                        ? "bg-gray-50"
                        : ""
                    }
                  `}
                >
                  <img
                    src={walletInfo.icon}
                    alt={walletInfo.name}
                    className="h-6 w-6"
                  />
                  <div>
                    <div className="font-medium">{walletInfo.name}</div>
                    {isLoading && connector.id === pendingConnector?.id && (
                      <div className="text-xs text-blue-500">Connecting...</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
