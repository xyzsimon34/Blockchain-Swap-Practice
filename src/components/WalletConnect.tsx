"use client";

import { useAccount, useBalance, useNetwork, useDisconnect } from "wagmi";
import { Web3Button } from "@web3modal/react";
import { toast } from "react-toastify";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg border border-gray-200">
      {isConnected ? (
        <>
          {/* Wallet Address */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium">Wallet Address</p>
            <p className="text-xs text-gray-500">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>

          {/* Balance */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium">Current Balance</p>
            <p className="text-xs text-gray-500">
              {balance?.formatted} {balance?.symbol}
            </p>
          </div>

          {/* Current Network */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium">Current Network</p>
            <p className="text-xs text-gray-500">{chain?.name}</p>
          </div>

          {/* Web3 Button (to switch wallets) */}
          <Web3Button />

          {/* Disconnect Button */}
          <button
            onClick={() => {
              disconnect();
              toast.success("Wallet disconnected successfully");
            }}
            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Disconnect
          </button>
        </>
      ) : (
        <Web3Button />
      )}
    </div>
  );
}
