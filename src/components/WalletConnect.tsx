import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect, Connector } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { Tooltip } from "react-tooltip";

// 定義錢包類型
interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  supportedWallets?: Array<{
    name: string;
    icon: string;
  }>;
}

// 定義支援的錢包列表
const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: "injected",
    name: "MetaMask",
    icon: "/metamask.svg",
    description: "MetaMask 瀏覽器擴充功能",
  },
  {
    id: "walletConnect",
    name: "WalletConnect",
    icon: "/walletconnect.svg",
    description: "支援多種行動錢包",
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
  const [showWalletConnectOptions, setShowWalletConnectOptions] =
    useState(false);
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected) {
      setShowWalletList(false);
      setShowWalletConnectOptions(false);
    }
  }, [isConnected]);

  if (!mounted) return null;

  const handleWalletSelect = (connector: Connector) => {
    if (connector.id === "walletConnect") {
      setShowWalletConnectOptions(true);
    } else {
      connect({ connector });
    }
  };

  const getWalletInfo = (connectorId: string): WalletInfo | undefined => {
    return SUPPORTED_WALLETS.find((w) => w.id === connectorId);
  };

  const walletConnectInfo = SUPPORTED_WALLETS.find(
    (w) => w.id === "walletConnect"
  );

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (isConnected) {
            disconnect();
          } else {
            setShowWalletList(!showWalletList);
            setShowWalletConnectOptions(false);
          }
        }}
        className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition-colors"
        data-tooltip-id="wallet-tooltip"
        data-tooltip-content={
          isConnected && address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : "連接錢包"
        }
      >
        <img src="/wallet.svg" alt="wallet" className="h-6 w-6" />
      </button>
      <Tooltip id="wallet-tooltip" />

      {/* 主要錢包列表 */}
      {showWalletList && !isConnected && !showWalletConnectOptions && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2">
            <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
              選擇錢包連接方式
            </div>
            {connectors.map((connector) => {
              const wallet = getWalletInfo(connector.id);
              if (!wallet) return null;

              return (
                <button
                  key={connector.id}
                  onClick={() => handleWalletSelect(connector)}
                  disabled={!connector.ready || isLoading}
                  className={`
                    w-full px-4 py-3 text-sm text-left text-gray-700 
                    hover:bg-gray-50 flex items-center gap-3
                    ${!connector.ready ? "opacity-50" : ""}
                    ${
                      isLoading && connector.id === pendingConnector?.id
                        ? "bg-gray-50"
                        : ""
                    }
                  `}
                >
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="h-6 w-6"
                  />
                  <div>
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-xs text-gray-500">
                      {wallet.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* WalletConnect 支援的錢包列表 */}
      {showWalletConnectOptions &&
        !isConnected &&
        walletConnectInfo?.supportedWallets && (
          <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-2">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b flex items-center">
                <button
                  onClick={() => setShowWalletConnectOptions(false)}
                  className="mr-2 text-gray-500 hover:text-gray-700"
                >
                  ←
                </button>
                選擇行動錢包
              </div>
              {walletConnectInfo.supportedWallets.map((wallet, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const connector = connectors.find(
                      (c) => c.id === "walletConnect"
                    );
                    if (connector) connect({ connector });
                  }}
                  className="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="h-6 w-6"
                  />
                  <div className="font-medium">{wallet.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
