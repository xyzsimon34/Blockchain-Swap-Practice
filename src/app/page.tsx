import Navbar from "@/components/Navbar";
import ChainSelector from '@/components/ChainSelector'
import { EChainType, ETronType } from '@/types/chains'

export default function Home() {
  // Demonstrate how to handle the chain selection
  const handleChainSelect = (chain: EChainType) => {
    if (chain === EChainType.TRON) {
      console.log('Tron 主網 Chain ID:', ETronType.Mainnet)
    }
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4">Choose your network</h1>
        <div className="mt-4">
          <ChainSelector />
        </div>
      </div>
    </main>
  )
}
