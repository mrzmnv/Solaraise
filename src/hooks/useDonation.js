import { useCallback } from 'react';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

const useDonation = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const donate = useCallback(
    async (amount, address) => {
      if (!wallet.connected) {
        console.error("Cüzdan bağlı değil.");
        return;
      }

      try {
        const { blockhash } = await connection.getRecentBlockhash();
        const transaction = new Transaction({
          recentBlockhash: blockhash,
          feePayer: wallet.publicKey,
        }).add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(address),
            lamports: amount * 1e9, // SOL'u lamports'a çevir
          })
        );

        // İşlemi imzala
        const signature = await wallet.signTransaction(transaction);
        // İşlemi gönder
        await connection.sendRawTransaction(signature.serialize());
      } catch (error) {
        console.error("Bağış işlemi sırasında hata oluştu:", error);
      }
    },
    [connection, wallet]
  );

  return { donate };
};

export default useDonation;
