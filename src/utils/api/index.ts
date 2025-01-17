import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_VERSION === "production"
      ? process.env.NEXT_PUBLIC_PROD_API_URL
      : process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await instance(config);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default instance;
