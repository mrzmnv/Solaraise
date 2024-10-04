import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const SOLANA_DEVNET = 'https://api.devnet.solana.com';

export const transferTokens = async (fromWallet: any, toAddress: string, lamports: number) => {
  const connection = new Connection(SOLANA_DEVNET, 'confirmed');
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports,
    })
  );
  
  const signature = await connection.sendTransaction(transaction, [fromWallet]);
  await connection.confirmTransaction(signature);
};
