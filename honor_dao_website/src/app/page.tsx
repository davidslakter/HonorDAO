'use client'

import axios from "axios";
import * as dotenv from "dotenv";
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sword, Shield, Bold } from 'lucide-react'
import { createPublicClient, http, Block } from "viem";
import { sepolia } from "viem/chains";
import { parseAbiItem, createWalletClient, custom, recoverMessageAddress, getContract } from 'viem'
import { privateKeyToAccount, signMessage } from 'viem/accounts';
import { toBytes } from 'viem/utils';
import { ethers } from 'ethers';

dotenv.config();

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!
const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY!
const WALLET_PRIVATE_KEY = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY!

const client = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
});

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum!),
})

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const oldHonorDAOContract = '0x06774662e7CEe40B7465B2aE1d10853AFF12A01e';
const oldHonorTokenContract = '0x7A37F505b639f8c13259CAcD32552368D557D789';
const oldDishonorTokenContract = '0x643d47204D12a438165352A2d11C6c2fE3De0B51';

const HonorTokenContract = '0xB12F62A9A007ef97963ACF3bf18113E9aB584340';
const DishonorTokenContract = '0x9e6Fe31330948E18836949D048C0fCa5f2C34790';
const HonorDAOContract = '0xecFd90A4e3927FFFB8DeBC4F94fE441047fe0113';

// ABI for the `balanceOf` function
const balanceOfAbi = parseAbiItem('function balanceOf(address owner) view returns (uint256)');

// ABI for `sendTransactionHonor` function 
const sendTransactionHonorAbi = parseAbiItem('function sendTransactionHonor(bytes32 _txHash, bytes memory signature, bool honor, address to) public');

export function WalletConnect() {
  const [userWalletAddress, setWalletAddress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access from MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Set the first account (primary account) to state
        setWalletAddress(accounts[0]);
      } else {
        setErrorMessage('MetaMask is not installed');
      }
    } catch (error) {
      // Handle errors (e.g., user denied access)
      setErrorMessage('Failed to connect wallet');
      console.error(error);
    }
  };

  return (
    <div className="fixed top-4 right-4">
      <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
        {userWalletAddress ? `Connected: ${userWalletAddress.slice(0, 6)}...` : 'Connect Wallet'}
      </button>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}


export default function HonorDAO() {
  var [walletAddress, setWalletAddress] = useState('')
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('check')
  const [isSendHonor, setIsSendHonor] = useState<boolean>(false);
  const [showComplete, setComplete] = useState(false);
  const [isCheckedHonor, setIsCheckedHonor] = useState<boolean>(false);
  const [honorTokens, setHonorTokens] = useState<string>('0');
  const [dishonorTokens, setDishonorTokens] = useState<string>('0');
  const [currTxHash, setTxHash] = useState<string>('0');

  const handleWalletCheck = async () => {

      // Ensure that the wallet starts with 0x
    if (!walletAddress.startsWith("0x")) {
      walletAddress = "0x" + walletAddress; // Prepend '0x' if necessary
    }
    const walletHex: `0x${string}` = walletAddress as `0x${string}`;
    const honorTokens = await getTokenBalance(HonorTokenContract, walletHex)
    const dishonorTokens = await getTokenBalance(DishonorTokenContract, walletHex)


    if (parseInt(honorTokens) > parseInt(dishonorTokens)) {
      setIsCheckedHonor(true)
    } else {
      setIsCheckedHonor(false)
    }

    setHonorTokens(honorTokens);
    setDishonorTokens(dishonorTokens);
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
    let result = await sendTransactionHonor('0x3b97b82314f2c324b147e8d7a717fe30c13a14fb3c76fa8ac7214613c72cc553','0xe4Bb3843fD25b55fa0E9a3B4AFA769206e5C544F')
    if (result) {
      setComplete(true);
    }
  }

  const changedTab = async (tab: String) => {

    if (tab == 'send') {
      let accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' })
      setWalletAddress(accounts[0]);
    }
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

    if (selectedTransaction) {

    }
  }, [walletAddress, selectedTransaction]); // Dependency array includes walletAddress

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

  // get Token Balance of Honor and Dishonor tokens
  async function getTokenBalance(contractAddress: `0x${string}`, walletAddress: `0x${string}`) {

    const balance = await client.readContract({
      address: contractAddress,
      abi: [balanceOfAbi],
      functionName: 'balanceOf',
      args: [walletAddress],
    });

    console.log(` This is the balance: ${balance.toString(10)}`)
    return balance.toString(10)
    
  }


  async function sendTransactionHonor(txHash: string, to: string) {
    //const account = privateKeyToAccount(`0x${WALLET_PRIVATE_KEY}`);
    const [account] = await walletClient.getAddresses()
    const signature = await walletClient.signMessage({ 
      account,
      message: txHash,
    })

    // Verify the signature
    const recoveredAddress = await recoverMessageAddress({ message: txHash, signature });
    console.log(`here is the signature: ${signature}`)
    console.log(`here is the recovered Address: ${recoveredAddress}`)

    const contract = getContract({
      abi: [sendTransactionHonorAbi],
      address: HonorDAOContract,
      client: walletClient
    })

    try {
      // Prepare the function arguments
      const args: readonly [
        `0x${string}`, // transaction hash in bytes32 format
        `0x${string}`, // signature in bytes format
        boolean,       // honor (true or false)
        `0x${string}`  // recipient address
      ] = [txHash as `0x${string}`, signature, isSendHonor, to as `0x${string}`];

      const options = {
        account,       
        chain: sepolia
      };
      // Send the transaction
      const transactionHash = await contract.write.sendTransactionHonor(args, options);
  
      console.log('Transaction sent, hash:', transactionHash);

      return true
    } catch (error) {
      console.error('Error sending transaction:', error);

      return false
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
        const filteredTransactions = transactions.filter((tx: any) => tx.isError === "0" && tx.to != walletAddress.toLowerCase() && tx.to != '');
        console.log(filteredTransactions)
        // Initialize an empty array to store transaction results
      const transactionResults = [];

      for (const tx of filteredTransactions) {
        const address = await resolveENS(tx.to);
        
        // Push the result into the transactionResults array
        transactionResults.push({ address: address, hash: tx.hash, value: tx.value});
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
      <WalletConnect></WalletConnect>
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
              <Select 
              disabled={transactions.length === 0} 
              onValueChange={(value) => setSelectedTransaction(value)} 
              value={selectedTransaction}
            >
              <SelectTrigger className="w-full bg-black text-gray-400 font-bold placeholder-green-700">
                <SelectValue placeholder="Select Transaction" />
              </SelectTrigger>
              <SelectContent>
                {transactions.map((tx) => (
                  <SelectItem key={tx.hash} value={tx.hash}>
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

          {activeTab == 'check' ? (
            <>
              <p className="text-white text-lg">This address has {honorTokens} Honor and {dishonorTokens} Dishonor</p>
              {isCheckedHonor ? (
                <>
                  <img src={getRandomStr(good_images)} alt="Honorable" className="w-32 h-32 mx-auto" />
                   <p className="text-white text-lg">"{getRandomStr(good_quotes)}"</p>
                </>
              ) : (
                <>
                  <img src={getRandomStr(bad_images)} alt="Honorable" className="w-32 h-32 mx-auto" />
                  <p className="text-white text-lg">"{getRandomStr(bad_quotes)}"</p>
                </>
              )}
              
            </>
          ) : (
            <>
              <p className="text-white text-lg">Honor Report Sent!</p>
              {isSendHonor  ? (
                <>
                  <img src={getRandomStr(good_images)} alt="Honor Sent" className="w-32 h-32 mx-auto" />
                  <p className="text-white text-lg">"{getRandomStr(good_quotes)}"</p>
                </>
              ) : (
                <>
                  <img src={getRandomStr(bad_images)} alt="Dishonor Sent" className="w-32 h-32 mx-auto" />
              <p className="text-white text-lg">"{getRandomStr(bad_quotes)}"</p>
                </>
              )}
              <br></br>
              <p className="text-white text-lg font-bold">Thank You For Reporting!</p>
            </>
          )}

          {activeTab == 'check' ? (
            <>
            </>
          ) : (
            <>
            
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