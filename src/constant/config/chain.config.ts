import { SiEthereum, SiBinance, SiPolygon } from "react-icons/si";
import { TbBrandTorchain } from "react-icons/tb";
import { EChainType, ETronType } from "@/constant/enum/chain.types";
import { IChainInfo } from "@/constant/interface/chain.interface";

export const ChainInfo: Record<EChainType, IChainInfo> = {
  [EChainType.ETHEREUM]: {
    name: "Ethereum",
    icon: SiEthereum,
    symbol: "ETH",
    chainId: "0x1", // Mainnet
    rpcUrl: "https://mainnet.infura.io/v3/your-project-id",
    explorerUrl: "https://etherscan.io",
  },
  [EChainType.BINANCE]: {
    name: "Binance Smart Chain",
    icon: SiBinance,
    symbol: "BNB",
    chainId: "0x38", // BSC Mainnet
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com",
  },
  [EChainType.TRON]: {
    name: "Tron",
    icon: TbBrandTorchain,
    symbol: "TRX",
    chainId: ETronType.Mainnet,
    explorerUrl: "https://tronscan.org",
  },
  [EChainType.POLYGON]: {
    name: "Polygon",
    icon: SiPolygon,
    symbol: "MATIC",
    chainId: "0x89", // Polygon Mainnet
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
  },
  [EChainType.POLYGON_ZKEVM]: {
    name: "Polygon zkEVM",
    icon: SiPolygon,
    symbol: "ETH",
    chainId: "0x44d", // Polygon zkEVM Mainnet
    rpcUrl: "https://zkevm-rpc.com",
    explorerUrl: "https://zkevm.polygonscan.com",
  },
} as const;
