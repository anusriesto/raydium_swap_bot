import { RaydiumSwap } from './raydium-swap';
import { CONFIG } from './config';
import { 
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';

async function main(){

const raydiumSwap = new RaydiumSwap(CONFIG.RPC_URL, CONFIG.WALLET_SECRET_KEY);
await raydiumSwap.createWrappedSolAccountInstruction(CONFIG.TOKEN_A_AMOUNT);
}
main()