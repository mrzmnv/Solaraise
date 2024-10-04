import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { notify } from '../utils/notifications';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';

const NFTMintingPage: React.FC = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [nftList, setNftList] = useState<{ imageUrl: string; name: string; description: string; }[]>([]);
    const [selectedNft, setSelectedNft] = useState<{ imageUrl: string; name: string; description: string; } | null>(null);

    useEffect(() => {
        generateRandomNFTs();
    }, []);

    const mintNFTToken = async (nftId: number) => {
        if (!wallet.connected || !wallet.publicKey) {
            notify({ title: 'Error', message: 'Wallet is not connected!' });
            return;
        }

        try {
            const nftData = nftList[nftId];
            const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

            const { nft } = await metaplex.nfts().create({
                uri: nftData.imageUrl,
                name: nftData.name,
                sellerFeeBasisPoints: 500,
                owner: wallet.publicKey,
                symbol: 'NFT',
                creators: [{ address: wallet.publicKey, share: 100 }],
            });

            notify({ title: 'Minting successful', message: `NFT: ${nft.name} has been minted!` });
            console.log('Minted NFT:', nft);

        } catch (error) {
            console.error('Minting failed:', error);
            notify({ title: 'Minting failed', message: `${error}` });
        }
    };

    const generateRandomNFTs = () => {
        const randomNFTs = [
            {
                imageUrl: 'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100269.jpg?t=st=1728053719~exp=1728057319~hmac=1d63e4c79182f5dc28d315c31c28602a2f69826f78cfee88f6f602b85141fdd3&w=740',
                name: 'Androgynous Avatar',
                description: 'A unique representation of a non-binary individual.',
            },
            {
                imageUrl: 'https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611165.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid',
                name: 'Cyberpunk Bitcoin',
                description: 'A futuristic take on Bitcoin in a cyberpunk setting.',
            },
            {
                imageUrl: 'https://img.freepik.com/free-photo/3d-rendering-financial-neon-bull_23-2151691928.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid',
                name: 'Neon Bull Market',
                description: 'A 3D rendering representing a bullish market in finance.',
            },
            {
                imageUrl: 'https://img.freepik.com/free-photo/advanced-technological-robot-interacting-with-money-finance_23-2151612661.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid',
                name: 'Tech Robot Finance',
                description: 'A robotic entity interacting with financial elements.',
            },
            {
                imageUrl: 'https://img.freepik.com/free-photo/cyberpunk-illustration-with-neon-colors-futuristic-technology_23-2151672017.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid',
                name: 'Futuristic Technology',
                description: 'An illustration of advanced technology in neon colors.',
            },
            {
                imageUrl: 'https://img.freepik.com/premium-photo/enigmatic-connection-surreal-isometric-pattern-human-head-open-book-purple-backgrou_1000124-208257.jpg?size=626&ext=jpg&ga=GA1.1.895119861.1715800073&semt=ais_hybrid',
                name: 'Surreal Connection',
                description: 'A surreal representation of knowledge and connectivity.',
            },
            {
                imageUrl: 'https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611169.jpg?size=626&ext=jpg&ga=GA1.2.895119861.1715800073&semt=ais_hybrid',
                name: 'Cyberpunk Bitcoin V2',
                description: 'Another variation of cyberpunk-themed Bitcoin artwork.',
            },
            {
                imageUrl: 'https://img.freepik.com/premium-photo/nft-security-shield-icon-neon-gradient-style_181667-48561.jpg?size=626&ext=jpg&ga=GA1.2.895119861.1715800073&semt=ais_hybrid',
                name: 'NFT Security Shield',
                description: 'A neon gradient style representation of NFT security.',
            },
            {
                imageUrl: 'https://img.freepik.com/premium-photo/nft-letter-dice-with-paint-splatters-multiple-colors_1048944-30749333.jpg?size=626&ext=jpg&ga=GA1.2.895119861.1715800073&semt=ais_hybrid',
                name: 'Colorful NFT Dice',
                description: 'A creative take on NFTs represented as colorful dice.',
            },
            {
                imageUrl: 'https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611170.jpg?size=626&ext=jpg&ga=GA1.2.895119861.1715800073&semt=ais_hybrid',
                name: 'Cyberpunk Bitcoin V3',
                description: 'Yet another cyberpunk-themed artwork focused on Bitcoin.',
            },
        ];
        setNftList(randomNFTs);
    };

    const handleNftClick = (nft: { imageUrl: string; name: string; description: string; }) => {
        setSelectedNft(nft);
    };

    const handleClosePopup = () => {
        setSelectedNft(null);
    };

    return (
        <div className="nft-minting-page max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
            <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">NFT Minting</h1>

            <div className="nft-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {nftList.map((nft, index) => (
                    <div 
                        key={index} 
                        className="nft-card bg-white shadow-lg rounded-lg overflow-hidden relative cursor-pointer" 
                        onClick={() => handleNftClick(nft)}
                    >
                        <img src={nft.imageUrl} alt={nft.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h2 className="text-lg font-bold text-gray-800">{nft.name}</h2>
                            <div className="text-gray-600 mb-4">{nft.description}</div>
                        </div>
                        <div className="absolute bottom-0 w-full px-4 mb-4">
                            <button
                                onClick={() => mintNFTToken(index)}
                                className="bg-indigo-500 text-white font-semibold rounded-full py-2 w-full shadow-md transition duration-200 hover:scale-105"
                                style={{ transform: 'translateY(5px)' }}
                            >
                                Mint Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedNft && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3 relative">
                        <button 
                            onClick={handleClosePopup} 
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                        <img src={selectedNft.imageUrl} alt={selectedNft.name} className="w-full h-40 object-cover mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">{selectedNft.name}</h2>
                        <p className="text-gray-600">{selectedNft.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NFTMintingPage;
