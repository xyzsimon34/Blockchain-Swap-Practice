"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

export default function I18nProvider({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleLanguageChange = (lng: string) => {
      localStorage.setItem("i18nextLng", lng);
      document.documentElement.lang = lng;
    };

    i18n.on("languageChanged", handleLanguageChange);

    const saveLng = localStorage.getItem("i18nextLng");
    if (saveLng) {
      i18n.changeLanguage(saveLng);
    }

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  //在Client端render之前return一個loading state or 空內容
  if (!isClient) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
