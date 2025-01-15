'use client'

import i18n,{ LanguageDetectorModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import  resources from './resource'

export const defaultNS = 'common';
export const supportedLngs = ['en', 'zh-TW'] as const;

class LanguageDetector implements LanguageDetectorModule {
    private key: 'language' = 'language';

    public type: 'languageDetector' = 'languageDetector';

    private available() {
        return typeof window !== 'undefined' && window.localStorage;
    }

    public detect() {
        if (!this.available()) return ;
        const lngFromStorage = localStorage.getItem(this.key);
        return lngFromStorage ? lngFromStorage :  supportedLngs[0];
    }

    public cacheUserLanguage(lng: string) {
        if (!this.available()) return ;
        localStorage.setItem(this.key, lng);
    }
}

const languageDetector = new LanguageDetector();

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    lng: 'zh-TW',
    ns: ['common'],
    fallbackLng: 'zh-TW',
    defaultNS,
    resources,
    interpolation: { escapeValue: false },
    supportedLngs,
  });

export default i18n;


