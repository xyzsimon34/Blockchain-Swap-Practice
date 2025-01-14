import { IconType } from 'react-icons';
import { SiEthereum, SiBinance, SiPolygon } from 'react-icons/si';
import { TbBrandTorchain } from 'react-icons/tb'; // 使用 Tron 的替代圖示

export enum EChainType {
  ETHEREUM = 'ethereum',
  BINANCE = 'binance',
  TRON = 'tron',
  POLYGON = 'polygon',
  POLYGON_ZKEVM = 'polygon_zkevm',
}

export enum ETronType {
  Mainnet = '0x2b6653dc',
  Shasta = '0x94a9059e',
  Nile = '0xcd8690dc',
}


interface IChainInfo {
  name: string;
  icon: IconType;
  symbol: string;
  chainId?: string; 
  rpcUrl?: string; 
  explorerUrl?: string; 
}


export const ChainInfo: Record<EChainType, IChainInfo> = {
  [EChainType.ETHEREUM]: {
    name: '以太坊',
    icon: SiEthereum,
    symbol: 'ETH',
    chainId: '0x1', // Mainnet
    rpcUrl: 'https://mainnet.infura.io/v3/your-project-id',
    explorerUrl: 'https://etherscan.io',
  },
  [EChainType.BINANCE]: {
    name: '幣安智能鏈',
    icon: SiBinance,
    symbol: 'BNB',
    chainId: '0x38', // BSC Mainnet
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
  },
  [EChainType.TRON]: {
    name: '波場',
    icon: TbBrandTorchain,
    symbol: 'TRX',
    chainId: ETronType.Mainnet,
    explorerUrl: 'https://tronscan.org',
  },
  [EChainType.POLYGON]: {
    name: 'Polygon',
    icon: SiPolygon,
    symbol: 'MATIC',
    chainId: '0x89', // Polygon Mainnet
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
  },
  [EChainType.POLYGON_ZKEVM]: {
    name: 'Polygon zkEVM',
    icon: SiPolygon,
    symbol: 'ETH',
    chainId: '0x44d', // Polygon zkEVM Mainnet
    rpcUrl: 'https://zkevm-rpc.com',
    explorerUrl: 'https://zkevm.polygonscan.com',
  },
} as const;


export type ChainType = keyof typeof EChainType;
export type TronNetworkType = keyof typeof ETronType;


export const isEthereumChain = (chain: EChainType) => chain === EChainType.ETHEREUM;
export const isTronChain = (chain: EChainType) => chain === EChainType.TRON;
export const getChainExplorer = (chain: EChainType) => ChainInfo[chain].explorerUrl;