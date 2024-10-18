'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Send, ChevronDown, Sword } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">HonorDAO</h1>
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
            placeholder="Ethereum Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full"
          /></>)}
          {activeTab === 'send' && (
            <Select onValueChange={setHonorType} value={honorType}>
              <SelectTrigger className="w-full">
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
            className="w-full"
          >
            {activeTab === 'check' ? (
              <>
                <Sword className="mr-2 h-6 w-6" />
                Check Honor
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
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
    </div>
  )
}