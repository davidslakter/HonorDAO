'use client'

import axios from "axios";
import * as dotenv from "dotenv";
import { ethers } from  "ethers";
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sword, Shield, Bold } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { resolve } from "path";

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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('check')
  const [isSendHonor, setIsSendHonor] = useState<boolean>(false);
  const transactionResults: Array<{ address: string, value: number }> = [];
  
  const [showComplete, setComplete] = useState(false);

  dotenv.config();

  // Etherscan API key
  const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY!

  const handleWalletCheck = async () => {
    // Placeholder for wallet check functionality
    setComplete(true)
  }

  const good_images = [
    `/images/good_honor/head-bank.png`,
    `/images/good_honor/head-crown.png`,
    `/images/good_honor/head-faberge.png`,
    `/images/good_honor/head-unicorn.png`,
    `/images/good_honor/head-wizardhat.png`
  ];

  const bad_images = [
    `/images/bad_honor/head-factory-dark.png`,
    `/images/bad_honor/head-saguaro.png`,
    `/images/bad_honor/head-skeleton-hat.png`,
    `/images/bad_honor/head-trashcan.png`,
    `/images/bad_honor/head-werewolf.png`
  ];

  const good_quotes = [
  "True honor is a currency that never devalues.",
  "Honor is the silent echo of a brave heart.",
  "In the game of life, honor is the ace up your sleeve.",
  "The weight of a promise is the measure of one’s honor."
  ]

  const bad_quotes = [
  "Those who dance with honor never step on the toes of deceit.",
  "Dishonor lurks where shortcuts lead.",
  "The road to dishonor is paved with excuses and half-truths.",
  "Dishonor is like a bad haircut—you can try to hide it, but it’s still there.",
  "Dishonor is a pit stop, not the end of the road. You can always choose the next turn."
  ]


  const handleHonorSend = async () => {
    setComplete(true);
  }

  const changedTab = (tab: String) => {
    setActiveTab(`${tab}`);
    setComplete(false);
  }

  const handleHonorToggle = () => {
    setComplete(false);
    setIsSendHonor(!isSendHonor);
  };

  // Effect to run a function whenever walletAddress changes
  useEffect(() => {
    if (walletAddress) {
      // Call your function here
      handleWalletAddressChange(walletAddress);
    }
  }, [walletAddress]); // Dependency array includes walletAddress

  // Function to execute when walletAddress is updated
  const handleWalletAddressChange = (newAddress: string) => {
    if (activeTab == 'send') {
      getTransactionHistory();
    }
  };

  const getRandomStr= (imgArr: Array<string>) => {
    const randomIndex = Math.floor(Math.random() * imgArr.length);
    return imgArr[randomIndex];
  }

  async function resolveENS(address: string) {
    const url = `https://api.etherscan.io/api?module=account&action=ensresolve&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
    
    try {
      const response = await axios.get(url);
      const data = response.data;
      console.log(`Looking up ens name for ${address}`)
      if (data.status === "1") {
        console.log(`The ENS name for ${address} is: ${data.result}`);
        return data.result
      } else {
        console.log('No ENS name found')
        return address
      }
    } catch (error) {
      console.error('Error fetching ENS name:', error);
      return address
    }
  }

  // Function to fetch transaction history using Etherscan API
  async function getTransactionHistory() {
    try {
      const response = await axios.get(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${ETHERSCAN_API_KEY}`
      );

      const transactions = response.data.result;

      if (response.data.status === "1" && Array.isArray(transactions)) {
        const filteredTransactions = transactions.filter((tx: any) => tx.isError === "0" && tx.to != walletAddress.toLowerCase());
        console.log(filteredTransactions)
        // Initialize an empty array to store transaction results
      const transactionResults = [];

      for (const tx of filteredTransactions) {
        const address = await resolveENS(tx.to);
        const value = tx.value;
        
        // Push the result into the transactionResults array
        transactionResults.push({ address: address, value: value });
      }
      // Now update the state with the transaction results
      setTransactions(transactionResults);
      } else {
        console.log("Error fetching transaction History")
      }
      
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-center text-black mb-6 arcade-text">HonorDAO</h1>
      <div className="bg-blue-800  rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-white">
      
        <div className="flex mb-6">
          <Button
            variant={activeTab === 'check' ? 'default' : 'outline'}
            onClick={() => changedTab('check')}
            className="flex-1 rounded-r-none"
          >
            Check Honor
          </Button>
          <Button
            variant={activeTab === 'send' ? 'default' : 'outline'}
            onClick={() => changedTab('send')}
            className="flex-1 rounded-l-none"
          >
            Send Honor
          </Button>
        </div>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="ETHEREUM WALLET ADDRESS"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full bg-black text-gray-400 font-bold placeholder-green-700"
          />
          {activeTab === 'send' && (
              <Select disabled={transactions.length === 0} onValueChange={setSelectedTransaction} value={selectedTransaction}>
              <SelectTrigger className="w-full bg-black text-gray-400 font-bold placeholder-green-700">
                <SelectValue placeholder="Select Transaction" />
              </SelectTrigger>
              <SelectContent>
                {transactions.map((tx) => (
                  <SelectItem key={tx.address} value={tx.value.toString()}>
                    {`${tx.address} | Value: ${tx.value / 1e18} ETH`}
                  </SelectItem>
                ))}
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
            className="w-full hover:scale-105"
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
        {showComplete && (
          <div className="mt-4 text-center">

          {isSendHonor ? (
            <>
              {activeTab == 'check' ? (
                <>
                  <p className="text-white text-lg">This address has 5 Dishonor and 10 Honor</p>
                </>
              ) : (
                <>
                  <p className="text-white text-lg">Honor Report Sent!</p>
                </>
              )}
              <img src={getRandomStr(good_images)} alt="Honor Sent" className="w-32 h-32 mx-auto" />
              <p className="text-white text-lg">"{getRandomStr(good_quotes)}"</p>
            </>
          ) : (
            <>
              {activeTab == 'check' ? (
                <>
                  <p className="text-white text-lg">This address has 5 Dishonor and 10 Honor</p>
                </>
              ) : (
                <>
                  <p className="text-white text-lg">Honor Report Sent!</p>
                </>
              )}
              <img src={getRandomStr(bad_images)} alt="Dishonor Sent" className="w-32 h-32 mx-auto" />
              <p className="text-white text-lg">"{getRandomStr(bad_quotes)}"</p>
            </>
          )}

          {activeTab == 'check' ? (
            <>
            </>
          ) : (
            <>
            <br></br>
              <p className="text-white text-lg font-bold">Thank You For Reporting!</p>
            </>
          )}

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
          animation: neon-flicker 1.5s infinite alternate;
        }
      `}</style>
    </div>
  )
}