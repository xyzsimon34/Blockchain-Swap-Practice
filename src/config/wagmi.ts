"use client";

import { createConfig, configureChains } from "wagmi";
import { mainnet, bsc, polygon } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient } from "@tanstack/react-query";
import { type Config } from "wagmi";

// 創建 QueryClient 實例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// 配置支援的鏈和 Provider
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, bsc, polygon],
  [publicProvider()]
);

// 配置支援的錢包連接器
const connectors = [
  new InjectedConnector({
    chains,
    options: {
      name: "Injected",
      shimDisconnect: true,
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
      showQrModal: true,
    },
  }),
];

// 創建 wagmi 配置
const wagmiConfig = {
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
} as const;

// 使用 createConfig 創建最終配置
const config = createConfig(wagmiConfig);

export { config, chains, queryClient };
