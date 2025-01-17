"use client";
import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Listbox,
  ListboxOptions,
  ListboxOption,
  ListboxButton,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { EChainType } from "@/constant/enum/chain.types";
import { getChains } from "@/utils/api/chain";
import { useQuery } from "@tanstack/react-query";
import { SiEthereum, SiBinance, SiPolygon } from "react-icons/si";
import { TbBrandTorchain } from "react-icons/tb";
import { IconType } from "react-icons";

// Define the chain selector props
interface ChainSelectorProps {
  onChainChange?: (chain: EChainType) => void;
}

// Define the chain data structure
interface ChainData {
  chainType: EChainType;
  name: string;
  currencySymbol?: string;
  chainId: string;
  blockExplorerUrl?: string;
  rpcUrl?: string;
}

// Define the icons for each chain
const chainIcons: Record<EChainType, IconType> = {
  [EChainType.ETHEREUM]: SiEthereum,
  [EChainType.BINANCE]: SiBinance,
  [EChainType.TRON]: TbBrandTorchain,
  [EChainType.POLYGON]: SiPolygon,
  [EChainType.POLYGON_ZKEVM]: SiPolygon,
};

interface ChainSelectorContentProps {
  selectedChain: EChainType;
  handleChainChange: (chain: EChainType) => void;
  chains: ChainData[];
  t: (key: string) => string;
}

function ChainSelectorContent({
  selectedChain,
  handleChainChange,
  chains,
  t,
}: ChainSelectorContentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedChainData = chains.find(
    (chain) => chain.chainType === selectedChain
  );

  useEffect(() => {
    console.log("Selected Chain:", selectedChain);
    console.log("Selected Chain Data:", selectedChainData);
    console.log("Explorer URL:", selectedChainData?.blockExplorerUrl);
    console.log("Is Client:", isClient);
  }, [selectedChain, selectedChainData, isClient]);

  return (
    <div className="w-72">
      <Listbox value={selectedChain} onChange={handleChainChange}>
        <div className="relative mt-1">
          <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
            <span className="flex items-center">
              {React.createElement(chainIcons[selectedChain], {
                className: "h-6 w-6 mr-2 text-gray-600",
              })}
              <span className="block truncate">{selectedChainData?.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({selectedChainData?.currencySymbol})
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
              {chains.map((chain) => (
                <ListboxOption
                  key={chain.chainType}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                    }`
                  }
                  value={chain.chainType}
                >
                  {({ selected, active }) => (
                    <>
                      <span className="flex items-center">
                        {React.createElement(chainIcons[chain.chainType], {
                          className: `h-6 w-6 mr-2 ${
                            active ? "text-indigo-600" : "text-gray-600"
                          }`,
                        })}
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {chain.name}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({chain.currencySymbol})
                        </span>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}

                      {chain.chainId && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400">
                          Chain ID: {chain.chainId}
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>

      {isClient && selectedChainData && selectedChainData.blockExplorerUrl && (
        <div className="mt-2 text-sm text-gray-500">
          <a
            href={selectedChainData.blockExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800"
          >
            {t("home.viewExplorer")}
          </a>
        </div>
      )}
    </div>
  );
}

export default function ChainSelector({ onChainChange }: ChainSelectorProps) {
  const { t } = useTranslation("common");
  const [selectedChain, setSelectedChain] = useState(EChainType.ETHEREUM);

  const {
    data: chainsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chains"],
    queryFn: getChains,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const chains = Array.isArray(chainsResponse)
    ? chainsResponse.map((chain) => ({
        ...chain,
        chainType: chain.chainType as EChainType,
      }))
    : [];

  useEffect(() => {
    if (chainsResponse) {
      console.log("API Response:", chainsResponse);
      console.log("Processed Chains:", chains);
    }
  }, [chainsResponse]);

  const handleChainChange = (chain: EChainType) => {
    setSelectedChain(chain);
    onChainChange?.(chain);
  };

  if (isLoading) {
    return (
      <div className="w-72">
        <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    console.error("Failed to load chains:", error);
    return null;
  }

  return (
    <ChainSelectorContent
      selectedChain={selectedChain}
      handleChainChange={handleChainChange}
      chains={chains}
      t={t}
    />
  );
}
