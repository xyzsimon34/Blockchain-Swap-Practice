"use client";

import i18n, { LanguageDetectorModule } from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./resource";

export const defaultNS = "common";
export const supportedLngs = ["en", "zh-TW"] as const;
export const DEFAULT_LANGUAGE = "zh-TW";

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE,
  ns: ["common"],
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS,
  resources,
  interpolation: { escapeValue: false },
  supportedLngs,
});

export default i18n;
