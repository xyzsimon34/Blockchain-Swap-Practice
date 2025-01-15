'use client'

import { useTranslation } from 'react-i18next';
import { supportedLngs } from '@/i18n';

export default function LanguageSwitcher() {
    const { t, i18n } = useTranslation('common');
  
    return (
      <div className="flex gap-2">
        {supportedLngs.map((lng) => (
          <button
            key={lng}
            onClick={() => i18n.changeLanguage(lng)}
            className={`px-3 py-1 rounded transition-colors ${
              i18n.language === lng 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {t(`language.${lng}`)}
          </button>
        ))}
      </div>
    );
}