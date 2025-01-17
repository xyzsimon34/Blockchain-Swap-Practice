"use client";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ChainSelector from "@/components/ChainSelector";
import { EChainType, ETronType } from "@/constant/enum/chain.types";

export default function Home() {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Demonstrate how to handle the chain selection
  const handleChainSelect = (chain: EChainType) => {
    if (chain === EChainType.TRON) {
      console.log(`${t("home.chainSelect.tronMainnet")}:`, ETronType.Mainnet);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4">{t("home.title")}</h1>
        <div className="mt-4">
          <ChainSelector onChainChange={handleChainSelect} />
        </div>
      </div>
    </main>
  );
}
