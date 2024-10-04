import React, { useState, useEffect } from 'react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { notify } from '../utils/notifications';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';

interface DonationCardProps {
  address: string;
  description: string;
  imageUrl: string;
}

interface NftData {
  imageUrl: string;
  name: string;
  description: string;
}

const DonationCard: React.FC<DonationCardProps> = ({ address, description, imageUrl }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState<number>(0);
  const [nftList, setNftList] = useState<NftData[]>([]);

  const predefinedAmounts = [0.1, 0.5, 1, 2.5, 5, 7.5, 10, 100];

  useEffect(() => {
    generateRandomNFTs();
  }, []);

  const handleDonate = async () => {
    if (wallet.connected) {
      try {
        const { blockhash } = await connection.getLatestBlockhash();
        const transaction = new Transaction({
          recentBlockhash: blockhash,
          feePayer: wallet.publicKey,
        }).add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(address),
            lamports: amount * 1e9,
          })
        );

        const signature = await wallet.signTransaction(transaction);
        const result = await connection.sendRawTransaction(signature.serialize());
        await connection.confirmTransaction(result);
        
        notify({ type: 'success', message: 'Donation successful!', txid: result });

        await mintRandomNFT();

      } catch (error) {
        notify({ type: 'error', message: 'An error occurred during donation!' });
        console.error("Error during donation:", error);
      }
    } else {
      notify({ type: 'error', message: 'Wallet is not connected.' });
      console.error("Wallet is not connected.");
    }
  };

  const mintRandomNFT = async () => {
    const randomIndex = Math.floor(Math.random() * nftList.length);
    const nftData = nftList[randomIndex];

    if (!wallet.connected || !wallet.publicKey) {
      notify({ title: 'Error', message: 'Wallet is not connected!' });
      return;
    }

    try {
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

      const { nft } = await metaplex.nfts().create({
        uri: nftData.imageUrl,
        name: nftData.name,
        sellerFeeBasisPoints: 500,
        owner: wallet.publicKey,
        symbol: 'NFT',
        creators: [{ address: wallet.publicKey, share: 100 }],
      });

      notify({ title: 'Minting successful', message: `NFT: ${nft.name} minted!` });
      console.log('Minted NFT:', nft);

    } catch (error) {
      console.error('Minting failed:', error);
      notify({ title: 'Minting failed', message: `${error}` });
    }
  };

  const generateRandomNFTs = () => {
    const randomNFTs = [];
    for (let i = 0; i < 10; i++) {
      randomNFTs.push({
        imageUrl: [
          "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100269.jpg?t=st=1728053719~exp=1728057319~hmac=1d63e4c79182f5dc28d315c31c28602a2f69826f78cfee88f6f602b85141fdd3&w=740",
          "https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611165.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid",
          "https://img.freepik.com/free-photo/3d-rendering-financial-neon-bull_23-2151691928.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid",
          "https://img.freepik.com/free-photo/advanced-technological-robot-interacting-with-money-finance_23-2151612661.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid",
          "https://img.freepik.com/free-photo/cyberpunk-illustration-with-neon-colors-futuristic-technology_23-2151672017.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid",
          "https://img.freepik.com/premium-photo/enigmatic-connection-surreal-isometric-pattern-human-head-open-book-purple-backgrou_1000124-208257.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid",
          "https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611169.jpg?size=626&ext=jpg&ga=GA1.2.895119861.1715800073&semt=ais_hybrid",
          "https://img.freepik.com/premium-photo/nft-security-shield-icon-neon-gradient-style_181667-48561.jpg?size=626&ext=jpg&ga=GA1.2.895119861.1715800073&semt=ais_hybrid",
          "https://img.freepik.com/premium-photo/nft-letter-dice-with-paint-splatters-multiple-colors_1048944-30749333.jpg?size=626&ext=jpg&ga=GA1.2.895119861.1715800073&semt=ais_hybrid",
          "https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611170.jpg?size=626&ext=jpg&ga=GA1.2.895119861.1715800073&semt=ais_hybrid"
        ][i],
        name: `NFT #${i}`,
        description: `Description for NFT #${i}`,
      });
    }
    setNftList(randomNFTs);
  };

  const handlePredefinedAmount = (value: number) => {
    setAmount(value);
  };

  return (
    <div className="donation-card bg-white shadow-lg rounded-lg p-4 m-4">
      <img src={imageUrl} alt="Donation" className="rounded-md w-full h-40 object-cover" />
      <h3 className="text-lg font-semibold text-black">{description}</h3>
      <p className="text-black">Donation Address: Solana</p>
      <p className="text-black" style={{ fontSize: '0.7em' }}>{address}</p>
      
      <div className="mt-2 flex flex-wrap">
        {predefinedAmounts.map((amount, index) => (
          <button 
            key={index} 
            onClick={() => handlePredefinedAmount(amount)} 
            className="bg-indigo-500 text-white rounded-md py-1 px-2 m-1 hover:bg-opacity-80"
          >
            {amount} SOL
          </button>
        ))}
      </div>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Donation Amount (SOL)"
        className="mt-2 p-2 border rounded-md w-full text-black"
      />
      
      <button
        onClick={handleDonate}
        className="mt-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white rounded-md py-2 w-full hover:bg-opacity-80 transition duration-200"
      >
        Donate
      </button>
    </div>
  );
};

export default DonationCard;
