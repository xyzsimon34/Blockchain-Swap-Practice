// src/components/swap/SwapConfirmation.tsx
"use client";

import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { getTokenIcon } from "@/constant/tokenIcons";
import { Token } from "@/types/swap.types";

interface SwapDetails {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: string;
  networkFee: string;
  minimumReceived: string;
  route?: string[];
  estimatedGas?: string;
  validTo?: number;
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
  const { t } = useTranslation();
  const [imageError, setImageError] = React.useState<Record<string, boolean>>(
    {}
  );

  const handleImageError = (symbol: string) => {
    setImageError((prev) => ({ ...prev, [symbol]: true }));
  };

  // 計算剩餘有效時間
  const getRemainingTime = () => {
    if (!swapDetails.validTo) return null;
    const now = Math.floor(Date.now() / 1000);
    const remaining = swapDetails.validTo - now;
    if (remaining <= 0) return null;

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return { minutes, seconds };
  };

  const remainingTime = getRemainingTime();

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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl 
                                     bg-[#1a1f2d] p-6 text-left align-middle shadow-xl transition-all
                                     border border-purple-500/20"
              >
                <Dialog.Title
                  as="div"
                  className="flex justify-between items-center mb-6"
                >
                  <h3 className="text-lg font-medium text-white">
                    {t("swap.confirmTitle")}
                  </h3>
                  <button
                    onClick={onClose}
                    className="rounded-xl p-2 hover:bg-white/5 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </Dialog.Title>

                {/* 交換詳情 */}
                <div className="space-y-6">
                  {/* 代幣金額 */}
                  <div className="bg-[#242b3d] rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-6 h-6">
                          <Image
                            src={
                              !imageError[swapDetails.fromToken.symbol]
                                ? getTokenIcon(swapDetails.fromToken.symbol)
                                : "/tokens/default-token.svg"
                            }
                            alt={swapDetails.fromToken.symbol}
                            width={24}
                            height={24}
                            className="rounded-full"
                            onError={() =>
                              handleImageError(swapDetails.fromToken.symbol)
                            }
                            priority
                          />
                        </div>
                        <span className="text-white">
                          {swapDetails.fromAmount}
                        </span>
                        <span className="text-gray-400">
                          {swapDetails.fromToken.symbol}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="bg-[#1a1f2d] rounded-xl p-2">
                        <ArrowDownIcon className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-6 h-6">
                          <Image
                            src={
                              !imageError[swapDetails.toToken.symbol]
                                ? getTokenIcon(swapDetails.toToken.symbol)
                                : "/tokens/default-token.svg"
                            }
                            alt={swapDetails.toToken.symbol}
                            width={24}
                            height={24}
                            className="rounded-full"
                            onError={() =>
                              handleImageError(swapDetails.toToken.symbol)
                            }
                            priority
                          />
                        </div>
                        <span className="text-white">
                          {swapDetails.toAmount}
                        </span>
                        <span className="text-gray-400">
                          {swapDetails.toToken.symbol}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 交換詳情 */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {t("swap.exchangeRate")}
                      </span>
                      <span className="text-white">
                        {swapDetails.exchangeRate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {t("swap.priceImpact")}
                      </span>
                      <span
                        className={
                          parseFloat(swapDetails.priceImpact) > 5
                            ? "text-red-500"
                            : "text-white"
                        }
                      >
                        {swapDetails.priceImpact}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {t("swap.networkFee")}
                      </span>
                      <span className="text-white">
                        {swapDetails.networkFee}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {t("swap.minimumReceived")}
                      </span>
                      <span className="text-white">
                        {swapDetails.minimumReceived}
                      </span>
                    </div>
                    {swapDetails.estimatedGas && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {t("swap.gasFee")}
                        </span>
                        <span className="text-white">
                          {swapDetails.estimatedGas} ETH
                        </span>
                      </div>
                    )}
                    {remainingTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {t("swap.validFor")}
                        </span>
                        <span className="text-white">
                          {remainingTime.minutes}:
                          {remainingTime.seconds.toString().padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 路徑顯示 */}
                  {swapDetails.route && (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">
                        {t("swap.route")}
                      </span>
                      <div className="flex items-center gap-2 text-sm">
                        {swapDetails.route.map((symbol, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && (
                              <span className="text-gray-400">→</span>
                            )}
                            <span className="text-white">{symbol}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 按鈕 */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    className={`w-full rounded-xl px-4 py-3 text-white font-medium
                              ${
                                isLoading
                                  ? "bg-blue-600/50 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                              } transition-colors`}
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? t("swap.confirming") : t("swap.confirmButton")}
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-xl px-4 py-3 text-gray-300
                             bg-[#242b3d] hover:bg-[#2a324a] transition-colors
                             font-medium"
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
