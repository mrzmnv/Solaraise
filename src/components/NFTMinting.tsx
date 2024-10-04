import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { notify } from '../utils/notifications';

const NFTMinting: React.FC = () => {
  const wallet = useWallet();
  const [nfts, setNfts] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [metadataLink, setMetadataLink] = useState('');

  const mintNFT = async () => {
    // NFT mintleme işlemleri burada olacak.
    // Bu fonksiyona gerekli kodları ekleyin.
    notify({ type: 'success', message: 'NFT minted successfully!' });
  };

  const addNFT = () => {
    setNfts([...nfts, { imageUrl, metadataLink }]);
    setImageUrl('');
    setMetadataLink('');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">NFT Minting Page</h2>
      <div>
        <input 
          type="text" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
          placeholder="NFT Görsel URL" 
          className="border p-2 mb-2 w-full"
        />
        <input 
          type="text" 
          value={metadataLink} 
          onChange={(e) => setMetadataLink(e.target.value)} 
          placeholder="Metadata URL" 
          className="border p-2 mb-2 w-full"
        />
        <button onClick={addNFT} className="bg-blue-500 text-white p-2 mb-4">
          NFT Ekle
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {nfts.map((nft, index) => (
          <div key={index} className="border p-2">
            <img src={nft.imageUrl} alt="NFT" className="w-full h-40 object-cover" />
            <p>{nft.metadataLink}</p>
          </div>
        ))}
      </div>
      <button onClick={mintNFT} className="bg-green-500 text-white p-2 mt-4">
        Mint NFT
      </button>
    </div>
  );
};

export default NFTMinting;
