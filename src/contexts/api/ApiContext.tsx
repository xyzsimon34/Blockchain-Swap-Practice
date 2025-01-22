"use client";

import { createContext, useContext, ReactNode } from "react";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";

// 基本響應格式
interface BaseResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

// Context 類型
interface ApiContextType {
  axiosInstance: AxiosInstance;
  axiosRequest: <T>(config: AxiosRequestConfig) => Promise<BaseResponse<T>>;
}

// 擴展 AxiosRequestConfig 類型
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

// 重試配置
const RETRY_CONFIG = {
  maxRetries: Number(process.env.NEXT_PUBLIC_API_RETRY_COUNT) || 3,
  retryDelay: Number(process.env.NEXT_PUBLIC_API_RETRY_DELAY) || 1000,
  statusCodesToRetry: [503, 502, 500],
};

const ApiContext = createContext<ApiContextType | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error("API URL is not defined in environment variables");
  }

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: new AxiosHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
    withCredentials: false,
  });

  // 請求攔截器
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log("發送請求到", fullUrl);

      // 添加額外的請求頭
      const headers = new AxiosHeaders(config.headers);
      if (process.env.NEXT_PUBLIC_API_KEY) {
        headers.set(
          "Authorization",
          `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        );
      } else {
        console.warn("API key is not defined in environment variables");
      }
      config.headers = headers;

      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject({
        status: 500,
        message: "Request configuration error",
        data: null,
      });
    }
  );

  // 響應攔截器
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log("API Response:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });

      // 處理響應數據格式
      const baseResponse: BaseResponse = {
        status: response.status,
        message: response.data?.message || "Success",
        data: response.data,
      };

      return { ...response, data: baseResponse };
    },
    async (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const config = error.config as CustomInternalAxiosRequestConfig;

        // 處理可重試的錯誤
        if (
          config &&
          RETRY_CONFIG.statusCodesToRetry.includes(status!) &&
          (!config.retryCount || config.retryCount < RETRY_CONFIG.maxRetries)
        ) {
          config.retryCount = (config.retryCount || 0) + 1;

          const delay =
            RETRY_CONFIG.retryDelay * Math.pow(2, config.retryCount - 1);

          console.log(
            `Retrying request (${config.retryCount}/${RETRY_CONFIG.maxRetries}) after ${delay}ms...`
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          return axiosInstance(config);
        }

        const errorDetails = {
          url: config?.url || "unknown",
          method: config?.method || "unknown",
          baseURL: config?.baseURL,
          status: status || "unknown",
          statusText: error.response?.statusText || "unknown",
          message: error.message || "No error message",
          data: error.response?.data || null,
          headers: config?.headers || {},
          timestamp: new Date().toISOString(),
        };

        console.error("API 錯誤詳情:", JSON.stringify(errorDetails, null, 2));

        const errorResponse: BaseResponse = {
          status: status || 500,
          message:
            error.response?.data?.message ||
            error.message ||
            "Service Unavailable",
          data: error.response?.data || null,
        };

        return Promise.reject(errorResponse);
      }

      // 處理非 Axios 錯誤
      console.error("未知錯誤:", error);
      return Promise.reject({
        status: 500,
        message: "發生未知錯誤",
        data: null,
      });

      return Promise.reject({
        status: 500,
        message: "Unknown error occurred",
        data: null,
      });
    }
  );

  async function axiosRequest<T>(
    config: AxiosRequestConfig
  ): Promise<BaseResponse<T>> {
    try {
      const headers = new AxiosHeaders({
        ...config.headers,
        Accept: "application/json",
        "Content-Type": "application/json",
      });

      const response = await axiosInstance.request<BaseResponse<T>>({
        ...config,
        headers,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetails = {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        };
        console.error("Request Failed:", errorDetails);
      }
      throw error;
    }
  }

  const value: ApiContextType = {
    axiosInstance,
    axiosRequest,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within ApiProvider");
  }
  return context;
}

export type { BaseResponse, ApiContextType };
