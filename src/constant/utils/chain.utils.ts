import { EChainType } from "../enum/chain.types";
import { ChainInfo } from "../config/chain.config";

export const isEthereumChain = (chain: EChainType) => chain === EChainType.ETHEREUM;
export const isTronChain = (chain: EChainType) => chain === EChainType.TRON;
export const getChainExplorer = (chain: EChainType) => ChainInfo[chain].explorerUrl;