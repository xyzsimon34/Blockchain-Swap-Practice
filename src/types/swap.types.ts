export interface SwapToken {
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
}

export interface SwapPair {
  fromToken: SwapToken;
  toToken: SwapToken;
  rate: string;
  fee: string;
}

export interface SwapQuote {
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  route: SwapPair[];
}
