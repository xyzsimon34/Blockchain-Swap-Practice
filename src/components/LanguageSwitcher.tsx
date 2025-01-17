"use client";

import { useTranslation } from "react-i18next";
import { supportedLngs } from "@/i18n";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation("common");

  const handleLanguageChange = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem("i18nextLng", lng);
      document.documentElement.lang = lng;
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <div className="flex gap-2">
      {supportedLngs.map((lng) => (
        <button
          key={lng}
          onClick={() => handleLanguageChange(lng)}
          className={`px-3 py-1 rounded transition-colors ${
            i18n.language === lng
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {t(`language.${lng}`)}
        </button>
      ))}
    </div>
  );
}
