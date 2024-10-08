// Next, React
import React from 'react';

import DonationCards from '../../components/DonationCards'; // Import the DonationCards component
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import DonationCard  from '../../components/DonationCard';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-6'>
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
          Solaraise
        </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p>Decentralized Donation Platform</p>
          <p className='text-slate-500 text-2x1 leading-relaxed'>After a successful donation, we offer you a random NFT as a gift from our NFT pool.</p>
        </h4>
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <DonationCards 
           address="Bağış Adresi" 
           description="Bu bir bağış açıklamasıdır." 
           imageUrl="https://example.com/image.jpg" 
        />
        </div>
        <div className="flex flex-col mt-2">
          <RequestAirdrop />
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
          {wallet &&
          <div className="flex flex-row justify-center">
            <div>
              {(balance || 0).toLocaleString()}
              </div>
              <div className='text-slate-600 ml-2'>
                SOL
              </div>
          </div>
          }
          </h4>
        </div>
      </div>
    </div>
  );
};

