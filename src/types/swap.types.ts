// src/types/swap.types.ts
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface PriceInfo {
  price: string;
  priceImpact: string;
  minimumReceived: string;
  networkFee: string;
  route?: string[];
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: string;
  networkFee: string;
  minimumReceived: string;
  route?: string[];
  estimatedGas?: string;
  validTo?: number;
}

export interface TokenPair {
  fromToken: Token;
  toToken: Token;
}

export interface PriceResponse {
  success: boolean;
  data?: PriceInfo;
  error?: string;
}

export interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  quote: SwapQuote | null;
  isLoading: boolean;
  error: string | null;
}

export interface SwapActions {
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  swapTokens: () => void;
  resetState: () => void;
}
