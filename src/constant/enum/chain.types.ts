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

export type ChainType = keyof typeof EChainType;
export type TronNetworkType = keyof typeof ETronType;