"use client";

import { createContext, useContext } from "react";
import { BaseResponse, useApi } from "./ApiContext";
import { EChainType } from "@/constant/enum/chain.types";
import axios from "axios";

// API 響應格式
export interface IChainResponse {
  chainType: string;
  name: string;
  symbol: string;
  chainId: string;
  blockExplorerUrl: string;
  rpcUrl: string;
}

// API 回應的資料結構
export interface ChainApiResponse
  extends BaseResponse<Record<string, IChainResponse>> {}

// 默認鏈數據格式
interface IChainData {
  chainType: EChainType;
  name: string;
  currencySymbol: string;
  chainId: string;
  blockExplorerUrl: string;
  rpcUrl: string;
}

// Context 型別定義
interface ChainApiContextType {
  getChains: () => Promise<ChainApiResponse>;
}

const ChainApiContext = createContext<ChainApiContextType | null>(null);

// 轉換默認數據為 API 響應格式
const convertToApiResponse = (chains: IChainData[]): IChainResponse[] => {
  return chains.map((chain) => ({
    chainType: chain.chainType.toString(),
    name: chain.name,
    symbol: chain.currencySymbol,
    chainId: chain.chainId,
    blockExplorerUrl: chain.blockExplorerUrl,
    rpcUrl: chain.rpcUrl,
  }));
};

// 備份鏈數據
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

interface ChainApiProviderProps {
  children: React.ReactNode;
}

const createFallbackResponse = (errorMessage: string): ChainApiResponse => {
  const chainData = fallbackChains.reduce((acc, chain) => {
    acc[chain.chainType] = {
      chainType: chain.chainType.toString(),
      name: chain.name,
      symbol: chain.currencySymbol,
      chainId: chain.chainId,
      blockExplorerUrl: chain.blockExplorerUrl,
      rpcUrl: chain.rpcUrl,
    };
    return acc;
  }, {} as Record<string, IChainResponse>);

  return {
    status: 200,
    message: `使用備用數據 (原因: ${errorMessage})`,
    data: chainData, // 直接返回轉換後的數據
  };
};

export function ChainApiProvider({ children }: ChainApiProviderProps) {
  const { axiosRequest } = useApi();

  const getChains = async (): Promise<ChainApiResponse> => {
    try {
      console.log("正在嘗試從 API 獲取鏈數據...");
      const response = await axiosRequest<Record<string, IChainResponse>>({
        method: "GET",
        url: "/secure/external/networks",
        timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
      }).catch((error) => {
        console.warn("API 請求出錯:", error);
        throw error;
      });

      if (!response?.data || Object.keys(response.data).length === 0) {
        console.warn("API 響應無效或為空，使用備用數據");
        return createFallbackResponse("API 響應為空");
      }

      console.log("成功從 API 獲取數據:", response);
      return {
        status: response.status || 200,
        message: response.message || "成功",
        data: response.data,
      };
    } catch (error) {
      console.warn("使用備用數據，原因:", error);
      return createFallbackResponse(
        axios.isAxiosError(error) ? error.message : "未知錯誤"
      );
    }
  };

  const value: ChainApiContextType = {
    getChains,
  };

  return (
    <ChainApiContext.Provider value={value}>
      {children}
    </ChainApiContext.Provider>
  );
}

export function useChainApi(): ChainApiContextType {
  const context = useContext(ChainApiContext);
  if (!context) {
    throw new Error("useChainApi must be used within ChainApiProvider");
  }
  return context;
}

// 統一導出
export type { ChainApiContextType, IChainData };
export { fallbackChains };
