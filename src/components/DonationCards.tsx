import React, { useState } from 'react';
import DonationCard from './DonationCard';
import { useConnection } from '@solana/wallet-adapter-react';

const DonationCards: React.FC = () => {
  const { connection } = useConnection();
  const [newAddress, setNewAddress] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [cards, setCards] = useState<{ address: string; description: string; imageUrl: string }[]>([
    { address: '9Da24yexqz7WwpgTzGgBuxYQoRQ3hTCdzzWgmeo7wNTR', description: 'Forest Association', imageUrl: 'https://iyikigormusum.com/uploads/d6993a874eeb0ca0dbb320bebb93487b.jpeg' },
    { address: 'GpLaM1PzfPDwQSGpe2aGTEgk47q3gPJR8jVpM7pagvJ4', description: 'Africa Water Well Donation', imageUrl: 'https://www.avrupayardimvakfi.com/wp-content/uploads/2021/08/afrikada-su-kuyusu-actirmak-1-870x450.jpg' },
    { address: 'GpLaM1PzfPDwQSGpe2aGTEgk47q3gPJR8jVpM7pagvJ4', description: 'Clean Energy Investment', imageUrl: 'https://www.aydemenerji.com.tr/upload/blogs/202407111341521720694512gorselbuyuk.jpg' },
  ]);

  const handleAddCard = () => {
    if (newAddress && newDescription && newImageUrl) {
      setCards([...cards, { address: newAddress, description: newDescription, imageUrl: newImageUrl }]);
      setNewAddress('');
      setNewDescription('');
      setNewImageUrl('');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-row space-x-2">
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Enter donation address"
          className="px-4 py-2 border rounded-md text-black"
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Enter description"
          className="px-4 py-2 border rounded-md text-black"
        />
        <input
          type="text"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="px-4 py-2 border rounded-md text-black"
        />
        <button
          onClick={handleAddCard}
          className="btn bg-green-500 text-white px-4 py-2"
        >
          Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <DonationCard
            key={index}
            address={card.address}
            description={card.description}
            imageUrl={card.imageUrl}
            connection={connection}
          />
        ))}
      </div>
    </div>
  );
};

export default DonationCards;
