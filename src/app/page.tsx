'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scroll, Sword } from 'lucide-react'

// Mock ABI - replace with your actual smart contract ABI
const contractABI = [
  {
    "inputs": [{"internalType": "address", "name": "wallet", "type": "address"}],
    "name": "checkWallet",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
]

export default function MedievalEthereumApp() {
  const [walletAddress, setWalletAddress] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const handleWalletCheck = async () => {
    if (!ethers.utils.isAddress(walletAddress)) {
      setResult('Invalid Ethereum address')
      return
    }

    try {
      // Connect to the Ethereum network (replace with your preferred provider)
      const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR-PROJECT-ID')
      
      // Replace with your actual contract address
      const contractAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      
      const contract = new ethers.Contract(contractAddress, contractABI, provider)
      
      const isValid = await contract.checkWallet(walletAddress)
      setResult(isValid ? 'Wallet is valid!' : 'Wallet is not valid.')
    } catch (error) {
      console.error('Error checking wallet:', error)
      setResult('Error checking wallet. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center">
      <div className="bg-[#8B4513] p-8 rounded-lg shadow-2xl border-4 border-[#654321] max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-[#FFD700] font-medieval">Ye Olde Ethereum Checker</h1>
        <div className="space-y-4">
          <div className="relative">
            <Scroll className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]" />
            <Input
              type="text"
              placeholder="Enter thy Ethereum address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="pl-10 bg-[#D2B48C] border-2 border-[#654321] text-[#4B3621] placeholder-[#8B4513]"
            />
          </div>
          <Button
            onClick={handleWalletCheck}
            className="w-full bg-[#CD7F32] hover:bg-[#B8860B] text-[#FFD700] border-2 border-[#654321]"
          >
            <Sword className="mr-2" />
            Verify Thy Wallet
          </Button>
        </div>
        {result && (
          <div className="mt-4 p-4 bg-[#D2B48C] border-2 border-[#654321] rounded text-center text-[#4B3621]">
            {result}
          </div>
        )}
      </div>
    </div>
  )
}