import { Token, PriceInfo } from "@/types/swap.types";
import { EChainType } from "@/constant/enum/chain.types";
import { ethers } from "ethers";

export class PriceService {
  private static readonly PRICE_IMPACT_THRESHOLD = 0.05; // 5%
  private static readonly SLIPPAGE_TOLERANCE = 0.005; // 0.5%
  private static readonly CACHE_DURATION = 30000; // 緩存時間（30 秒）

  // 價格緩存
  private static priceCache: {
    [key: string]: {
      data: PriceInfo;
      timestamp: number;
    };
  } = {};

  // CoinGecko API URL
  private static readonly COINGECKO_API_URL =
    "https://api.coingecko.com/api/v3";

  // 代幣 ID 映射
  private static readonly TOKEN_IDS: Record<string, string> = {
    ETH: "ethereum",
    BNB: "binancecoin",
    MATIC: "matic-network",
    USDT: "tether",
    USDC: "usd-coin",
    // 可以添加更多代幣...
  };

  private static getCacheKey(
    fromToken: Token,
    toToken: Token,
    amount: string,
    sourceChain: EChainType,
    targetChain: EChainType
  ): string {
    return `${fromToken.symbol}-${toToken.symbol}-${amount}-${sourceChain}-${targetChain}`;
  }

  private static getCachedPrice(cacheKey: string): PriceInfo | null {
    const cached = this.priceCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log("Using cached price data");
      return cached.data;
    }
    return null;
  }

  private static setCachedPrice(cacheKey: string, data: PriceInfo): void {
    this.priceCache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };
  }

  private static async fetchCoinGeckoPrice(
    fromToken: Token,
    toToken: Token,
    amount: string
  ): Promise<{ rate: string; path: string[] }> {
    try {
      const fromId = this.TOKEN_IDS[fromToken.symbol];
      const toId = this.TOKEN_IDS[toToken.symbol];

      if (!fromId || !toId) {
        throw new Error(
          `Unsupported token pair: ${fromToken.symbol}-${toToken.symbol}`
        );
      }

      console.log(
        `Fetching price from CoinGecko for ${fromToken.symbol}-${toToken.symbol}`
      );

      const response = await fetch(
        `${this.COINGECKO_API_URL}/simple/price?` +
          new URLSearchParams({
            ids: `${fromId},${toId}`,
            vs_currencies: "usd",
          })
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }

      const data = await response.json();

      // 計算匯率
      const fromUsdPrice = data[fromId].usd;
      const toUsdPrice = data[toId].usd;
      const rate = (fromUsdPrice / toUsdPrice).toString();

      console.log(
        `CoinGecko rate for ${fromToken.symbol}-${toToken.symbol}: ${rate}`
      );

      return {
        rate,
        path: [fromToken.address, toToken.address],
      };
    } catch (error) {
      console.error("CoinGecko price fetch error:", error);
      throw error;
    }
  }

  static async getPrice(
    fromToken: Token,
    toToken: Token,
    amount: string,
    sourceChain: EChainType,
    targetChain: EChainType
  ): Promise<PriceInfo> {
    try {
      // 檢查緩存
      const cacheKey = this.getCacheKey(
        fromToken,
        toToken,
        amount,
        sourceChain,
        targetChain
      );
      const cachedPrice = this.getCachedPrice(cacheKey);
      if (cachedPrice) {
        return cachedPrice;
      }

      this.validateSwapParams(fromToken, toToken, amount);

      const { rate, path } = await this.fetchCoinGeckoPrice(
        fromToken,
        toToken,
        amount
      );

      const networkFee = await this.estimateNetworkFee(
        sourceChain,
        targetChain
      );
      const priceImpact = "0.01"; // 1%
      const minimumReceived = this.calculateMinimumReceived(
        amount,
        rate,
        priceImpact
      );

      const priceInfo = {
        price: rate,
        priceImpact,
        minimumReceived,
        networkFee,
        route: path,
      };

      // 儲存到緩存
      this.setCachedPrice(cacheKey, priceInfo);

      return priceInfo;
    } catch (error) {
      console.error("Price calculation error:", error);
      throw new Error("Failed to calculate price");
    }
  }

  private static calculateMinimumReceived(
    amount: string,
    rate: string,
    priceImpact: string
  ): string {
    const expectedAmount = parseFloat(amount) * parseFloat(rate);
    const impact = parseFloat(priceImpact);
    const slippage = this.SLIPPAGE_TOLERANCE;

    return (expectedAmount * (1 - impact - slippage)).toFixed(6);
  }

  private static async estimateNetworkFee(
    sourceChain: EChainType,
    targetChain: EChainType
  ): Promise<string> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        this.getChainRPC(sourceChain)
      );
      const gasPrice = await provider.getGasPrice();

      const estimatedGas =
        sourceChain === targetChain
          ? ethers.BigNumber.from(180000)
          : ethers.BigNumber.from(250000);

      const fee = gasPrice.mul(estimatedGas);
      return ethers.utils.formatEther(fee);
    } catch (error) {
      console.error("Network fee estimation error:", error);
      throw error;
    }
  }

  private static validateSwapParams(
    fromToken: Token,
    toToken: Token,
    amount: string
  ): boolean {
    if (!fromToken || !toToken) {
      throw new Error("Invalid tokens");
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error("Invalid amount");
    }

    return true;
  }

  public static getChainRPC(chain: EChainType): string {
    const RPC_URLS: Record<EChainType, string> = {
      [EChainType.ETHEREUM]: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      [EChainType.BINANCE]: "https://bsc-dataseed.binance.org",
      [EChainType.POLYGON]: "https://polygon-rpc.com",
      [EChainType.TRON]: "https://api.trongrid.io",
      [EChainType.POLYGON_ZKEVM]: "https://zkevm-rpc.com",
    };
    return RPC_URLS[chain] || RPC_URLS[EChainType.ETHEREUM];
  }
}
