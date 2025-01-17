import { axiosRequest } from "./index";
import { EChainType } from "@/constant/enum/chain.types";
import { IChainInfo } from "@/constant/interface/chain.interface";

export interface IChainResponse {
  chainId: string;
  chainType: EChainType;
  name: string;
  symbol: string;
  rpcUrl?: string;
  explorerUrl?: string;
}

export const getChains = async () => {
  const response = await axiosRequest<{ data: IChainResponse[] }>({
    method: "get",
    url: "/secure/external/networks",
  });
  return response.data; // 確保返回陣列
};
