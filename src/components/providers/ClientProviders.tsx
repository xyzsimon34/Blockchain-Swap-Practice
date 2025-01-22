"use client";

import { ReactNode, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiProvider } from "@/contexts/api/ApiContext";
import { ChainApiProvider } from "@/contexts/api/ChainApiContext";
import { I18nProvider } from "@/contexts/i18nContext";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-red-500">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

function LoadingFallback() {
  return <div className="animate-pulse">Loading...</div>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <ChainApiProvider>
            <I18nProvider>
              <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
            </I18nProvider>
          </ChainApiProvider>
        </ApiProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
