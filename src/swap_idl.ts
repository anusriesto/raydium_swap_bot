import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
  // Path to the IDL file
import { Program,Idl,Wallet } from '@project-serum/anchor';
//import {idl} from "./programs/idl.json";
import * as dotenv from 'dotenv';
import base58 from 'bs58';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

dotenv.config();
const idl = require('./programs/idl.json');
console.log(idl)
const privateKeyString = process.env.WALLET_SECRET_KEY as string;
console.log(privateKeyString)
const keypair =Keypair.fromSecretKey(base58.decode(privateKeyString));


const RPC_URL = 'https://cosmological-orbital-brook.solana-mainnet.quiknode.pro/51b9d378ef3cd20ffdf4fed00155a17e51e5ac4c'; // Solana RPC URL
const programID = new PublicKey('CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C'); // The program's public key from Solana
//const programID=new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
const poolStatePubkey = new PublicKey('3nMFwZXwY1s1M5s8vYAHqd4wGs4iSxXE4LRoUMMYqEgF'); // Public key of the Raydium pool state

async function swapToken() {
  
  const connection = new Connection(RPC_URL, 'confirmed');
  

  
  const provider = new anchor.AnchorProvider(connection, new Wallet(keypair), anchor.AnchorProvider.defaultOptions());
  anchor.setProvider(provider);

  
  const program = new Program(idl as anchor.Idl, programID, provider);

  
  const poolState = await program.account.poolState.fetch(poolStatePubkey);
  console.log(poolState)

  const inputTokenAccount = new PublicKey('So11111111111111111111111111111111111111112'); 
  const outputTokenAccount = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'); 
  const inputVault = new PublicKey(poolState.token0Vault); 
  const outputVault = new PublicKey(poolState.token1Vault); 
  const authority=new PublicKey(poolState.ammAuthority)
  const wsolAmount = 0.001; // The amount of WSOL you want to swap
  const lamportsPerSol = 1_000_000_000;  

  
  const amountIn = new anchor.BN(wsolAmount * lamportsPerSol); 
  const minAmountOut = new anchor.BN(wsolAmount * lamportsPerSol * 0.95); // Minimum output token to prevent slippage

  
  const tx = await program.methods
    .swapBaseInput(amountIn, minAmountOut)
    .accounts({
      payer: keypair.publicKey,
      authority: authority,
      poolState: poolStatePubkey,
      inputTokenAccount: inputTokenAccount,
      outputTokenAccount: outputTokenAccount,
      inputVault: inputVault,
      outputVault: outputVault,
      inputTokenProgram: TOKEN_PROGRAM_ID,
      outputTokenProgram: TOKEN_PROGRAM_ID,
    })
    .transaction();


  const signature = await provider.sendAndConfirm(tx, [keypair]);
  console.log('Swap transaction confirmed:', signature);
 }


swapToken().catch((err) => {
  console.error('Error during swap:', err);
});
