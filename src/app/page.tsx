"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { WalletConnect } from "@/components/WalletConnect";
import SwapContainer from "@/components/swap/SwapContainer";

function HomeContent() {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black">
        <Navbar />
        <div className="animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <Navbar />
      <div className="relative max-w-2xl mx-auto mt-32 px-4 pb-32">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative space-y-8">
          {/* Swap Container */}
          <SwapContainer className="text-white" />
        </div>
      </div>
    </main>
  );
}

export default HomeContent;
