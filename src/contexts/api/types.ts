// 基礎響應類型
export interface BaseResponse<T> {
  status: number;
  message?: string;
  data: T;
}

// 鏈的響應類型
export interface ChainApiResponse {
  chainType: string;
  name: string;
  currencySymbol?: string;
  chainId: string;
  blockExplorerUrl?: string;
  rpcUrl?: string;
}
