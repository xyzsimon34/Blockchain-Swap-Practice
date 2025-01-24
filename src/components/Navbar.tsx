"use client";

import { Fragment } from "react";
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

  return (
    <nav className="p-4" aria-label="Main Navigation" role="navigation">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-white text-2xl font-bold">
              {t("navbar.brand")}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            <Menu as="div" className="relative z-50">
              <MenuButton className="inline-flex items-center gap-2 rounded-lg bg-gray-800/80 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/80 backdrop-blur-sm ">
                {t("navbar.menu.title")}
                <ChevronDownIcon className="h-4 w-4" />
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-52 origin-top-right rounded-lg bg-gray-800/90 backdrop-blur-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="px-1 py-1">
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        href="/"
                        className={`${
                          active ? "bg-gray-700/80" : ""
                        } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-white`}
                      >
                        <HomeModernIcon className="size-4 text-white/60" />
                        {t("navbar.menu.home")}
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                          ⌘H
                        </kbd>
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-700/80" : ""
                        } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-white`}
                      >
                        <PencilIcon className="size-4 text-white/60" />
                        {t("navbar.menu.edit")}
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                          ⌘E
                        </kbd>
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-700/80" : ""
                        } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-white`}
                      >
                        <Square2StackIcon className="size-4 text-white/60" />
                        {t("navbar.menu.duplicate")}
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                          ⌘D
                        </kbd>
                      </button>
                    )}
                  </MenuItem>
                  <div className="my-1 h-px bg-white/5" />
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-700/80" : ""
                        } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-white`}
                      >
                        <ArchiveBoxXMarkIcon className="size-4 text-white/60" />
                        {t("navbar.menu.archive")}
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                          ⌘A
                        </kbd>
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-700/80" : ""
                        } group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm text-white`}
                      >
                        <TrashIcon className="size-4 text-white/60" />
                        {t("navbar.menu.delete")}
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">
                          ⌘D
                        </kbd>
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
