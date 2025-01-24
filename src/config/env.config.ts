export const ENV = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Crossover",

  API_URL:
    process.env.NEXT_PUBLIC_API_VERSION === "production"
      ? process.env.NEXT_PUBLIC_PROD_API_URL
      : process.env.NEXT_PUBLIC_API_URL,

  EXPLORER_URL:
    process.env.NEXT_PUBLIC_API_VERSION === "production"
      ? process.env.NEXT_PUBLIC_PROD_SWAP_EXPLORER_URL
      : process.env.NEXT_PUBLIC_SWAP_EXPLORER_URL,

  IS_PRODUCTION: process.env.NEXT_PUBLIC_API_VERSION === "production",
} as const;

function validateEnv() {
  const requiredEnvs = ["APP_NAME", "API_URL", "EXPLORER_URL"] as const;

  const missingEnvs = requiredEnvs.filter((key) => !ENV[key]);

  if (missingEnvs.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvs.join(", ")}`
    );
  }
}

if (process.env.NODE_ENV === "development") {
  validateEnv();
}

export default ENV;
