'use client'

import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'


const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'A', href: '/', current: false },
  { name: 'B', href: '/', current: false },
  { name: 'C', href: '/', current: false },
]

export default function Navbar() {
  return (
    <Menu as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="text-white text-xl font-bold">Test</div>
          </div>

          <div className="flex items-center">
            <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600">
              Menu
              <ChevronDownIcon className="size-4 fill-white/60" />
            </MenuButton>

            <MenuItems className="absolute right-4 top-16 w-52 origin-top-right rounded-xl border border-white/5 bg-gray-700 p-1 text-sm/6 text-white shadow-lg focus:outline-none">
              {/* Navigation Links */}
              {navigation.map((item) => (
                <MenuItem key={item.name}>
                  <a
                    href={item.href}
                    className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600 ${
                      item.current ? 'bg-gray-600' : ''
                    }`}
                  >
                    {item.name}
                  </a>
                </MenuItem>
              ))}

               {/* Divider */}
               <div className="my-1 h-px bg-white/5" />
              
              {/* Additional Menu Items */}
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600">
                  <PencilIcon className="size-4 fill-white/30" />
                  Edit
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">⌘E</kbd>
                </button>
              </MenuItem>
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600">
                  <Square2StackIcon className="size-4 fill-white/30" />
                  Duplicate
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">⌘D</kbd>
                </button>
              </MenuItem>
              <div className="my-1 h-px bg-white/5" />
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600">
                  <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
                  Archive
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">⌘A</kbd>
                </button>
              </MenuItem>
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-gray-600">
                  <TrashIcon className="size-4 fill-white/30" />
                  Delete
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-hover:inline">⌘D</kbd>
                </button>
              </MenuItem>
            </MenuItems>
          </div>
        </div>
        </div>
    </Menu>
  )
}