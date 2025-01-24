"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { DEFAULT_LANGUAGE } from "@/i18n";
import { supportedLngs } from "@/i18n";

interface I18nContextType {
  currentLanguage: string;
  changeLanguage: (lng: string) => Promise<void>;
  isLoaded: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initI18n = async () => {
        try {
          const savedLng = localStorage.getItem("i18nextLng");

          const finalLng =
            savedLng &&
            supportedLngs.includes(savedLng as (typeof supportedLngs)[number])
              ? savedLng
              : DEFAULT_LANGUAGE;

          await i18n.changeLanguage(finalLng);
          document.documentElement.lang = finalLng;
          setCurrentLanguage(finalLng);

          const handleLanguageChange = (lng: string) => {
            localStorage.setItem("i18nextLng", lng);
            document.documentElement.lang = lng;
            setCurrentLanguage(lng);
          };

          i18n.on("languageChanged", handleLanguageChange);
          setMounted(true);

          return () => {
            i18n.off("languageChanged", handleLanguageChange);
          };
        } catch (error) {
          console.error("Failed to initialize i18n:", error);
          setMounted(true);
        }
      };

      initI18n();
    }
  }, []);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    isLoaded: mounted,
  };

  if (!mounted) {
    return (
      <div aria-hidden="true" className="invisible">
        {children}
      </div>
    );
  }

  return (
    <I18nContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
