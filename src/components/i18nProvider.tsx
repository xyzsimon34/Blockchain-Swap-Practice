"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { DEFAULT_LANGUAGE } from "@/i18n";
import { supportedLngs } from "@/i18n";

export default function I18nProvider({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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

        const handleLanguageChange = (lng: string) => {
          localStorage.setItem("i18nextLng", lng);
          document.documentElement.lang = lng;
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
  }, []);

  if (!mounted) {
    return (
      <div aria-hidden="true" className="invisible">
        {children}
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
