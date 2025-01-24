"use client";

import { createContext, useContext, ReactNode } from "react";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";

// Types
interface BaseResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

interface ApiContextType {
  axiosInstance: AxiosInstance;
  axiosRequest: <T>(config: AxiosRequestConfig) => Promise<BaseResponse<T>>;
}

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

// Constants
const RETRY_CONFIG = {
  maxRetries: Number(process.env.NEXT_PUBLIC_API_RETRY_COUNT) || 3,
  retryDelay: Number(process.env.NEXT_PUBLIC_API_RETRY_DELAY) || 1000,
  statusCodesToRetry: [503, 502, 500],
};

// Context
const ApiContext = createContext<ApiContextType | null>(null);

// Provider
export function ApiProvider({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error("API URL is not defined in environment variables");
  }

  // 創建 axios 實例
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
        message:
          error.response?.data?.message ||
          error.message ||
          "Service Unavailable",
        data: error.response?.data || null,
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

        // 重試邏輯
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

        // 錯誤詳情記錄
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

        return Promise.reject({
          status: status || 500,
          message:
            error.response?.data?.message ||
            error.message ||
            "Service Unavailable",
          data: error.response?.data || null,
        });
      }

      console.error("未知錯誤:", error);
      return Promise.reject({
        status: 500,
        message: "發生未知錯誤",
        data: null,
      });
    }
  );

  // 請求函數
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
      const errorResponse: BaseResponse<T> = {
        status: axios.isAxiosError(error) ? error.response?.status || 500 : 500,
        message: axios.isAxiosError(error) ? error.message : "Unknown error",
        data: null as T,
      };

      console.error("Request failed:", {
        url: axios.isAxiosError(error) ? error.config?.url : "unknown",
        status: errorResponse.status,
        message: errorResponse.message,
      });

      throw errorResponse;
    }
  }

  return (
    <ApiContext.Provider value={{ axiosInstance, axiosRequest }}>
      {children}
    </ApiContext.Provider>
  );
}

// Hook
export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within ApiProvider");
  }
  return context;
}

export type { BaseResponse, ApiContextType };
