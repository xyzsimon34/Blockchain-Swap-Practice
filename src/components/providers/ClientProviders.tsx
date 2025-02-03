"use client";

import { ReactNode, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiProvider } from "@/contexts/api/ApiContext";
import { ChainApiProvider } from "@/contexts/api/ChainApiContext";
import { I18nProvider } from "@/contexts/i18nContext";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import { WalletProvider } from "./WalletProvider";
import "react-toastify/dist/ReactToastify.css";

// Error Boundary (displayed when the application encounters an error)
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-red-500">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

// Loading Placeholder (to avoid white screen)
function LoadingFallback() {
  return <div className="animate-pulse">Loading...</div>;
}

// React Query Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 🚀 **Integrate All Providers**
export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <ChainApiProvider>
            <WalletProvider>
              <I18nProvider>
                <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
                {/* Toast Notifications */}
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
              </I18nProvider>
            </WalletProvider>
          </ChainApiProvider>
        </ApiProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
