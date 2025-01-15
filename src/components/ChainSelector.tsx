'use client'
import React,{ Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { EChainType } from '@/constant/enum/chain.types'
import { ChainInfo } from '@/constant/config/chain.config'

interface ChainSelectorProps {
  onChainChange?: (chain: EChainType) => void;
}

export default function ChainSelector({ onChainChange }: ChainSelectorProps) {
  const { t } = useTranslation('common')
  const [selectedChain, setSelectedChain] = useState(EChainType.ETHEREUM)

  const handleChainChange = (chain: EChainType) => {
    setSelectedChain(chain)
    onChainChange?.(chain)
  }

  return (
    <div className="w-72">
      <Listbox value={selectedChain} onChange={handleChainChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
            <span className="flex items-center">
              {/* 使用動態 Icon 組件 */}
              {React.createElement(ChainInfo[selectedChain].icon, {
                className: "h-6 w-6 mr-2 text-gray-600"
              })}
              <span className="block truncate">{ChainInfo[selectedChain].name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({ChainInfo[selectedChain].symbol})
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
              {Object.entries(EChainType).map(([key, value]) => (
                <Listbox.Option
                  key={value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                    }`
                  }
                  value={value}
                >
                  {({ selected, active }) => (
                    <>
                      <span className="flex items-center">
                        {React.createElement(ChainInfo[value].icon, {
                          className: `h-6 w-6 mr-2 ${active ? 'text-indigo-600' : 'text-gray-600'}`
                        })}
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {ChainInfo[value].name}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({ChainInfo[value].symbol})
                        </span>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                      
                      {/* 可選：顯示 Chain ID */}
                      {ChainInfo[value].chainId && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400">
                          Chain ID: {ChainInfo[value].chainId}
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      
      {/* Optional: Display additional information about the currently selected chain */}
      {ChainInfo[selectedChain].explorerUrl && (
        <div className="mt-2 text-sm text-gray-500">
          <a 
            href={ChainInfo[selectedChain].explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800"
          >
            {t('home.viewExplorer')}
          </a>
        </div>
      )}
    </div>
  )
}