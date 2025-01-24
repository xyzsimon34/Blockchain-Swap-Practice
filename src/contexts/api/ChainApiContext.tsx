"use client";

import { createContext, useContext } from "react";
import { BaseResponse, useApi } from "./ApiContext";
import { EChainType } from "@/constant/enum/chain.types";
import { toast } from "react-toastify";
import axios from "axios";

// Types
export interface IChainResponse {
  chainType: string;
  name: string;
  currencySymbol: string;
  chainId: string;
  blockExplorerUrl: string;
  rpcUrl: string;
}

export interface ChainApiResponse
  extends BaseResponse<Record<string, IChainResponse>> {}

interface IChainData {
  chainType: EChainType;
  name: string;
  currencySymbol: string;
  chainId: string;
  blockExplorerUrl: string;
  rpcUrl: string;
}

interface ChainApiContextType {
  getChains: () => Promise<ChainApiResponse>;
}

interface ChainApiProviderProps {
  children: React.ReactNode;
}

// Constants
const fallbackChains: IChainData[] = [
  {
    chainType: EChainType.ETHEREUM,
    name: "Sepolia Testnet",
    currencySymbol: "ETH",
    chainId: "11155111",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://ethereum-sepolia.publicnode.com",
  },
  {
    chainType: EChainType.BINANCE,
    name: "BNB Smart Chain Testnet",
    currencySymbol: "BNB",
    chainId: "97",
    blockExplorerUrl: "https://testnet.bscscan.com",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  },
  {
    chainType: EChainType.TRON,
    name: "Shasta Testnet",
    currencySymbol: "TRX",
    chainId: "1",
    blockExplorerUrl: "https://shasta.tronscan.io",
    rpcUrl: "https://api.shasta.trongrid.io",
  },
  {
    chainType: EChainType.POLYGON,
    name: "Polygon Amoy Testnet",
    currencySymbol: "MATIC",
    chainId: "80002",
    blockExplorerUrl: "https://amoy.polygonscan.com",
    rpcUrl: "https://rpc-amoy.polygon.technology",
  },
  {
    chainType: EChainType.POLYGON_ZKEVM,
    name: "Polygon zkEVM Cardona Testnet",
    currencySymbol: "ETH",
    chainId: "2442",
    blockExplorerUrl: "https://cardona-zkevm.polygonscan.com",
    rpcUrl: "https://etherscan.cardona.zkevm-rpc.com",
  },
];

// Context
const ChainApiContext = createContext<ChainApiContextType | null>(null);

// Helper Functions
const createFallbackResponse = (errorMessage: string): ChainApiResponse => {
  console.log("[Fallback] Creating fallback response...");

  const chainData = fallbackChains.reduce((acc, chain) => {
    acc[chain.chainType] = {
      chainType: chain.chainType.toString(),
      name: chain.name,
      currencySymbol: chain.currencySymbol,
      chainId: chain.chainId,
      blockExplorerUrl: chain.blockExplorerUrl,
      rpcUrl: chain.rpcUrl,
    };
    console.log(
      `[Fallback] Created data for ${chain.chainType}:`,
      acc[chain.chainType]
    );
    return acc;
  }, {} as Record<string, IChainResponse>);

  const response = {
    status: 200,
    message: `Using fallback data (Reason: ${errorMessage})`,
    data: chainData,
  };

  console.log("[Fallback] Final fallback response:", response);
  return response;
};

// Provider
function ChainApiProvider({ children }: ChainApiProviderProps) {
  const { axiosRequest } = useApi();

  const getChains = async (): Promise<ChainApiResponse> => {
    console.log("[API] Fetching chains from API...");
    try {
      const apiResponse = await axiosRequest<Record<string, IChainResponse>>({
        method: "GET",
        url: "/secure/external/networks",
        timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
      });

      console.log("[API] Received API response:", apiResponse);

      if (!apiResponse?.data || Object.keys(apiResponse.data).length === 0) {
        console.warn("[API] API returned empty data. Using fallback...");
        toast.warning("API returned empty data");
      }

      console.log("[API] Successfully fetched chains from API.");
      return apiResponse;
    } catch (error) {
      toast.warning("[API] API request failed. Using fallback data:");
      return createFallbackResponse("API unavailable or error occurred");
    }
  };

  {
    console.log("[Provider] Rendering ChainApiProvider...");
  }

  return (
    <ChainApiContext.Provider value={{ getChains }}>
      {children}
    </ChainApiContext.Provider>
  );
}

// Hook
function useChainApi(): ChainApiContextType {
  console.log("[Hook] Using ChainApiContext...");
  const context = useContext(ChainApiContext);
  if (!context) {
    toast.warning("[Hook] ChainApiContext is not available!");
    throw new Error("useChainApi must be used within ChainApiProvider");
  }
  console.log("[Hook] Successfully retrieved ChainApiContext.");
  return context;
}

// Exports
export type { ChainApiContextType, IChainData };
export {
  fallbackChains,
  ChainApiProvider,
  useChainApi,
  createFallbackResponse,
};
