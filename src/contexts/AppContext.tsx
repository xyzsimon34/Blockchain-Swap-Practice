"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/contexts/i18nContext";

interface AppContextType {
  queryClient: QueryClient;
  mounted: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

// Create the AppProvider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            retry: 2,
          },
        },
      })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div aria-hidden="true" className="invisible">
        {children}
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ queryClient, mounted }}>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>{children}</I18nProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}

// Create the useAppContext hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function useQueryClientFromApp() {
  const { queryClient } = useApp();
  return queryClient;
}

export function useMountedStatus() {
  const { mounted } = useApp();
  return mounted;
}
