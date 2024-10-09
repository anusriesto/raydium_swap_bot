import { RaydiumSwap } from './raydium-swap';
import { CONFIG } from './config';
import { 
  PublicKey,
  Connection,
  PublicKeyData,
  ParsedTransactionWithMeta,
  LAMPORTS_PER_SOL,
  Transaction,
  VersionedTransaction,
  TransactionInstruction
} from '@solana/web3.js';


const connection: Connection = new Connection(`https://cosmological-orbital-brook.solana-mainnet.quiknode.pro/51b9d378ef3cd20ffdf4fed00155a17e51e5ac4c`)
async function fetchammountofswap(txId: string, connection: Connection): Promise<void> {
  try {
      const tx: ParsedTransactionWithMeta | null = await connection.getParsedTransaction(txId, {
          maxSupportedTransactionVersion: 0,
          commitment: 'confirmed'
      });

      if (!tx) {
          console.error("Transaction not found or not confirmed yet.");
          return;
      }

      

      // Fetch post-token balances
      const post_balance = tx?.meta?.innerInstructions;
;



      // Display the parsed transaction data
      console.log("Transaction ID:", txId);
      console.log("Post-Token Balances:", post_balance);
      console.log(JSON.stringify(post_balance, null, 2));

      // Generate Explorer URL for the transaction
      //console.log("Transaction Explorer URL:", generateExplorerUrl(txId));
      //console.log("Total QuickNode Credits Used in this session:", credits);
  } catch (error) {
      console.error("Error fetching transaction:", error);
  }
}

// Example: Call this function with a known signature to get transaction details
const txSignature = '4j8LMFoHkkfAaDHZueQh4x7iaEuKQfmG3koXXVztpTfcLBUCnfF7jrkJ8JjT2E1DtFpZdwVzPJz8Jos3P5ymfzQW'; // Replace with a real transaction signature
fetchammountofswap(txSignature, connection).catch(console.error);