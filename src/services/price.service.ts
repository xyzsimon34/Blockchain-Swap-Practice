// src/services/price.service.ts
import { Token, PriceInfo, PriceResponse } from "@/types/swap.types";
import { EChainType } from "@/constant/enum/chain.types";

export class PriceService {
  private static readonly BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";
  private static readonly PRICE_IMPACT_THRESHOLD = 0.05; // 5%
  private static readonly SLIPPAGE_TOLERANCE = 0.005; // 0.5%

  /**
   * 獲取代幣價格和交換詳情
   */
  static async getPrice(
    fromToken: Token,
    toToken: Token,
    amount: string,
    sourceChain: EChainType,
    targetChain: EChainType
  ): Promise<PriceInfo> {
    try {
      // 1. 獲取即時匯率
      const rate = await this.fetchExchangeRate(
        fromToken.address,
        toToken.address
      );

      // 2. 計算滑點
      const priceImpact = await this.calculatePriceImpact(amount, rate);

      // 3. 計算網路費用
      const networkFee = await this.estimateNetworkFee(
        sourceChain,
        targetChain
      );

      // 4. 計算最小收到數量（考慮滑點）
      const minimumReceived = this.calculateMinimumReceived(
        amount,
        rate,
        priceImpact
      );

      // 5. 獲取最佳路由（如果有）
      const route = await this.findBestRoute(fromToken, toToken, amount);

      return {
        price: rate,
        priceImpact,
        minimumReceived,
        networkFee,
        route,
      };
    } catch (error) {
      console.error("Price calculation error:", error);
      throw new Error("Failed to calculate price");
    }
  }

  /**
   * 從價格預言機獲取即時匯率
   */
  private static async fetchExchangeRate(
    fromTokenAddress: string,
    toTokenAddress: string
  ): Promise<string> {
    try {
      // TODO: 整合實際的價格預言機
      // 模擬 API 調用
      await this.simulateApiCall();

      // 返回模擬匯率
      const mockRate = Math.random() * (1.5 - 0.5) + 0.5;
      return mockRate.toFixed(6);
    } catch (error) {
      console.error("Exchange rate fetch error:", error);
      return "1.0"; // 默認匯率
    }
  }

  /**
   * 計算價格影響
   */
  private static async calculatePriceImpact(
    amount: string,
    rate: string
  ): Promise<string> {
    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(rate);

    // 模擬價格影響計算
    // 交易量越大，影響越大
    const impact = (amountNum * rateNum * 0.001).toFixed(6);
    return impact;
  }

  /**
   * 估算網路費用
   */
  private static async estimateNetworkFee(
    sourceChain: EChainType,
    targetChain: EChainType
  ): Promise<string> {
    try {
      // TODO: 整合實際的 gas 預估
      // 模擬跨鏈橋費用計算
      await this.simulateApiCall();

      const baseFee = 0.001;
      const chainMultiplier = sourceChain === targetChain ? 1 : 1.5;
      return (baseFee * chainMultiplier).toFixed(6);
    } catch (error) {
      console.error("Network fee estimation error:", error);
      return "0.001"; // 默認費用
    }
  }

  /**
   * 計算最小收到數量
   */
  private static calculateMinimumReceived(
    amount: string,
    rate: string,
    priceImpact: string
  ): string {
    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(rate);
    const impactNum = parseFloat(priceImpact);

    // 考慮滑點和安全邊際
    const minimum =
      amountNum * rateNum * (1 - impactNum - this.SLIPPAGE_TOLERANCE);
    return minimum.toFixed(6);
  }

  /**
   * 尋找最佳交換路由
   */
  private static async findBestRoute(
    fromToken: Token,
    toToken: Token,
    amount: string
  ): Promise<string[]> {
    try {
      // TODO: 實現實際的路由查找邏輯
      // 模擬路由查找
      await this.simulateApiCall();

      return [
        fromToken.symbol,
        "USDT", // 模擬中間代幣
        toToken.symbol,
      ];
    } catch (error) {
      console.error("Route finding error:", error);
      return [fromToken.symbol, toToken.symbol];
    }
  }

  /**
   * 模擬 API 調用延遲
   */
  private static async simulateApiCall(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  /**
   * 驗證交易參數
   */
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

  /**
   * 獲取代幣餘額（模擬）
   */
  static async getTokenBalance(token: Token, address: string): Promise<string> {
    try {
      await this.simulateApiCall();
      return (Math.random() * 100).toFixed(4);
    } catch (error) {
      console.error("Balance fetch error:", error);
      return "0.0";
    }
  }
}
