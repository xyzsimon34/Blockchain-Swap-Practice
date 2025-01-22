import { useI18n } from "@/contexts/i18nContext";
import { supportedLngs } from "@/i18n";

export function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useI18n();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {supportedLngs.map((lng) => (
        <option key={lng} value={lng}>
          {lng}
        </option>
      ))}
    </select>
  );
}
