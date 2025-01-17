"use client";

import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  HomeModernIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation("common");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初始內容使用固定值
  const brandText = isClient ? t("navbar.brand") : "測試";

  return (
    <Menu as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="text-white text-xl font-bold">{brandText}</div>
          </div>
          {isClient && (
            <div className="flex items-center gap-4">
              {/* Add LanguageSwitcher */}
              <LanguageSwitcher />
              <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600">
                {t("navbar.menu.title")}
                <ChevronDownIcon className="size-4 fill-white/60" />
              </MenuButton>

              <MenuItems className="absolute right-4 top-16 w-52 origin-top-right rounded-xl border border-white/5 bg-gray-700 p-1 text-sm/6 text-white shadow-lg focus:outline-none">
                <MenuItem>
                  <Link
                    href="/"
                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600"
                  >
                    <HomeModernIcon className="size-4 fill-white/30" />
                    {t("navbar.menu.home")}
                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                      ⌘H
                    </kbd>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600">
                    <PencilIcon className="size-4 fill-white/30" />
                    {t("navbar.menu.edit")}
                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                      ⌘E
                    </kbd>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600">
                    <Square2StackIcon className="size-4 fill-white/30" />
                    {t("navbar.menu.duplicate")}
                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                      ⌘D
                    </kbd>
                  </button>
                </MenuItem>
                <div className="my-1 h-px bg-white/5" />
                <MenuItem>
                  <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600">
                    <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
                    {t("navbar.menu.archive")}
                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                      ⌘A
                    </kbd>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600">
                    <TrashIcon className="size-4 fill-white/30" />
                    {t("navbar.menu.delete")}
                    <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                      ⌘D
                    </kbd>
                  </button>
                </MenuItem>
              </MenuItems>
            </div>
          )}
        </div>
      </div>
    </Menu>
  );
}
