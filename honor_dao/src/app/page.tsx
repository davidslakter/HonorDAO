'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ChevronDown, Sword, Shield } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

export default function HonorDAO() {
  const [walletAddress, setWalletAddress] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('check')
  const [isSendHonor, setIsSendHonor] = useState<boolean>(false);
  const [honorType, setHonorType] = useState('')

  const handleWalletCheck = async () => {
    // Placeholder for wallet check functionality
    setResult(`Honor check for ${walletAddress} completed!`)
  }

  const handleHonorSend = async () => {
    // Placeholder for honor send functionality
    setResult(`${honorType} honor sent to ${walletAddress}!`)
  }

  const handleHonorToggle = () => {
    setIsSendHonor(!isSendHonor);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-center text-white mb-6">HonorDAO</h1>
      <div className="bg-gradient-to-b from-purple-600 to-blue-800  rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-white">
      
        <div className="flex mb-6">
          <Button
            variant={activeTab === 'check' ? 'default' : 'outline'}
            onClick={() => setActiveTab('check')}
            className="flex-1 rounded-r-none"
          >
            Check Honor
          </Button>
          <Button
            variant={activeTab === 'send' ? 'default' : 'outline'}
            onClick={() => setActiveTab('send')}
            className="flex-1 rounded-l-none"
          >
            Send Honor
          </Button>
        </div>
        <div className="space-y-4">
          {activeTab == 'check' && (<><Input
            type="text"
            placeholder="ETHEREUM WALLET ADDRESS"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full bg-black text-green-500 font-bold placeholder-green-700"
          /></>)}
          {activeTab === 'send' && (
            <Select onValueChange={setHonorType} value={honorType}>
              <SelectTrigger className="w-full bg-black text-gray-400 font-bold placeholder-green-700">
                <SelectValue placeholder="Select Transaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Valor">Valor</SelectItem>
                <SelectItem value="Wisdom">Wisdom</SelectItem>
                <SelectItem value="Loyalty">Loyalty</SelectItem>
                <SelectItem value="Chivalry">Chivalry</SelectItem>
              </SelectContent>
            </Select>
          )}
          { activeTab === 'send' && (
            <><Button variant={isSendHonor ? 'default' : 'outline'}
              onClick={handleHonorToggle}
              className="flex-1 rounded-r-none"
            >
              Honor
            </Button><Button
              variant={isSendHonor ? 'outline' : 'default'}
              onClick={handleHonorToggle}
              className="flex-1 rounded-l-none"
            >
                Dishonor
              </Button></>
          )} 
          <Button
            onClick={activeTab === 'check' ? handleWalletCheck : handleHonorSend}
            className="w-full arcade-text hover:scale-105"
          >
            {activeTab === 'check' ? (
              <>
                <Sword className="mr-2 h-6 w-6" />
                Check Honor
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Send Honor
              </>
            )}
          </Button>
        </div>
        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md text-center text-gray-800 animate-fade-in">
            {result}
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 
              0 0 5px #fff,
              0 0 10px #fff,
              0 0 20px #fff,
              0 0 40px #0ff,
              0 0 80px #0ff,
              0 0 90px #0ff,
              0 0 100px #0ff,
              0 0 150px #0ff;
          }
          20%, 24%, 55% {
            text-shadow: none;
          }
        }
        .arcade-text {
          animation: neon-flicker 2.5s infinite alternate;
        }
      `}</style>
    </div>
  )
}