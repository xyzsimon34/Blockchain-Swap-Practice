"use client";

import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

// Types
interface Token {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  decimals: number;
}

interface SwapDetails {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: string;
  networkFee: string;
  minimumReceived: string;
}

interface SwapConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  swapDetails: SwapDetails;
  isLoading?: boolean;
}

export default function SwapConfirmation({
  isOpen,
  onClose,
  onConfirm,
  swapDetails,
  isLoading = false,
}: SwapConfirmationProps) {
  const { t } = useTranslation("common");

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex justify-between items-center mb-4"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {t("swap.confirmTitle")}
                  </h3>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </Dialog.Title>

                {/* 交換詳情 */}
                <div className="space-y-4">
                  {/* 代幣金額 */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {swapDetails.fromToken.logoURI && (
                          <Image
                            src={swapDetails.fromToken.logoURI}
                            alt={swapDetails.fromToken.symbol}
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                        )}
                        <span>{swapDetails.fromAmount}</span>
                        <span className="ml-2 text-gray-600">
                          {swapDetails.fromToken.symbol}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="bg-white rounded-full p-2">
                        <ArrowDownIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {swapDetails.toToken.logoURI && (
                          <Image
                            src={swapDetails.toToken.logoURI}
                            alt={swapDetails.toToken.symbol}
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                        )}
                        <span>{swapDetails.toAmount}</span>
                        <span className="ml-2 text-gray-600">
                          {swapDetails.toToken.symbol}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 交換詳情 */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {t("swap.exchangeRate")}
                      </span>
                      <span>{swapDetails.exchangeRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {t("swap.priceImpact")}
                      </span>
                      <span
                        className={
                          parseFloat(swapDetails.priceImpact) > 5
                            ? "text-red-500"
                            : "text-gray-900"
                        }
                      >
                        {swapDetails.priceImpact}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {t("swap.networkFee")}
                      </span>
                      <span>{swapDetails.networkFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {t("swap.minimumReceived")}
                      </span>
                      <span>{swapDetails.minimumReceived}</span>
                    </div>
                  </div>
                </div>

                {/* 按鈕 */}
                <div className="mt-6 space-y-2">
                  <button
                    type="button"
                    className={`w-full rounded-lg px-4 py-2 text-white ${
                      isLoading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? t("swap.confirming") : t("swap.confirmButton")}
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200"
                    onClick={onClose}
                  >
                    {t("swap.cancelButton")}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
