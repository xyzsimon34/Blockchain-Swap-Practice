"use client";

import { createConfig, configureChains } from "wagmi";
import { mainnet, bsc, polygon } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { BinanceW3WConnector } from "@binance/w3w-wagmi-connector";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient } from "@tanstack/react-query";

// Custom Polygon Amoy testnet configuration
const polygonAmoy = {
  id: 80_001,
  name: "Polygon Amoy",
  network: "polygon-amoy",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    public: { http: ["https://rpc-amoy.polygon.technology"] },
    default: { http: ["https://rpc-amoy.polygon.technology"] },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://www.oklink.com/amoy" },
  },
} as const;

// Check if WalletConnect Project ID exists
if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID");
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Initialize QueryClient with default settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, bsc, polygon, polygonAmoy],
  [publicProvider()]
);

// Base WalletConnect configuration
const baseWalletConnectConfig = {
  projectId,
  qrcode: true,
  metadata: {
    name: "Blockchain Swap",
    description: "Cross-chain exchange platform",
    url: typeof window !== "undefined" ? window.location.origin : "",
    icons: [
      typeof window !== "undefined"
        ? `${window.location.origin}/wallet.svg`
        : "",
    ],
  },
};

// Configure wallet connectors
const connectors = [
  // MetaMask
  new InjectedConnector({
    chains,
    options: {
      name: "MetaMask",
    },
  }),
  new BinanceW3WConnector({
    chains: [bsc, mainnet],
    options: {
      rpc: {
        1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
        56: "https://bsc-dataseed.binance.org",
      },
    },
  }),
  // General WalletConnect
  new WalletConnectConnector({
    chains,
    options: baseWalletConnectConfig,
  }),
];

// Create wagmi config
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
  queryClient,
});

// Export configurations
export { config, chains, queryClient };
