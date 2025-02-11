// src/constant/tokenIcons.ts
export const TOKEN_ICONS: Record<string, string> = {
  ETH: "/tokens/eth.svg",
  USDT: "/tokens/usdt.svg",
  USDC: "/tokens/usdc.svg",
  BNB: "/tokens/bnb.svg",
  TRX: "/tokens/trx.svg",
  MATIC: "/tokens/matic.svg",
};

export const getTokenIcon = (symbol: string): string => {
  return TOKEN_ICONS[symbol.toUpperCase()] || "/tokens/default-token.svg";
};
