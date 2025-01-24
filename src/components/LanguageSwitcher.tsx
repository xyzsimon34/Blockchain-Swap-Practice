"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { supportedLngs } from "@/i18n";
import { GlobeAltIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation("common");

  return (
    <Menu as="div" className="relative">
      <MenuButton className="inline-flex items-center gap-2 rounded-lg bg-gray-800/80 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/80 backdrop-blur-sm">
        <GlobeAltIcon className="h-5 w-5" />
        {i18n.language.toUpperCase()}
        <ChevronDownIcon className="h-4 w-4" />
      </MenuButton>

      <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg bg-gray-800/90 backdrop-blur-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="px-1 py-1">
          {supportedLngs.map((lng) => (
            <MenuItem key={lng}>
              {({ active }) => (
                <button
                  onClick={() => i18n.changeLanguage(lng)}
                  className={`${
                    active ? "bg-gray-700/80" : ""
                  } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-white`}
                >
                  {t(`language.${lng}`)}
                  {i18n.language === lng && (
                    <span className="ml-auto text-xs text-purple-400">✓</span>
                  )}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
