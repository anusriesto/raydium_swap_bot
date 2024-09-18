import { Keypair,PublicKey,Connection,LAMPORTS_PER_SOL,clusterApiUrl } from "@solana/web3.js";
import * as fs from "fs";
import dotenv from 'dotenv';
import https from 'https';
import base58 from 'bs58';
import { Wallet,web3 } from '@project-serum/anchor';
dotenv.config();

const generateKey = async (): Promise<void> => {
  //generating new wallet
  const keyPair: Keypair = Keypair.generate();
  const keyData = Array.from(keyPair.secretKey);  // Convert Uint8Array to regular array;

  console.log("Public Key:", keyPair.publicKey.toString());
  console.log("Secret Key:", keyPair.secretKey); // Secret key is a UInt8Array
  fs.writeFileSync("secret-key.json", JSON.stringify(keyData));

  

};
//Writing few helper function
  //******************************************
  //Getting public key

const getPublicKeyFromJson = (filePath: string): PublicKey => {
    const keyData = fs.readFileSync(filePath, "utf8");
  
    const parsedData = JSON.parse(keyData);
  
    if (!parsedData.secretKey) {
      throw new Error("Secret key not found in the JSON file.");
    }
    const secretKey = Uint8Array.from(parsedData.secretKey);
    const keypair = Keypair.fromSecretKey(secretKey);
    return keypair.publicKey;
};


//Get Balance of the wallet

const get_balance = async (): Promise<void> => {
    if (!process.env.QUICKNODE_URL) {
        throw new Error('QUICKNODE_URL is not set in the environment variables');
      }
    const url = new Connection(process.env.QUICKNODE_URL);
    if (!process.env.WALLET_SECRET_KEY) {
        throw new Error('WALLET_SECRET_KEY is not provided');
      }
    const secretKey = base58.decode(process.env.WALLET_SECRET_KEY);
    const wallet = new Wallet(Keypair.fromSecretKey(secretKey));
    const balance= await url.getBalance(wallet.publicKey);
    console.log(`Wallet Balance: ${balance/LAMPORTS_PER_SOL}`);
};

  
  // Example usage:
// const publicKey = getPublicKeyFromJson("secret-key.json");
// console.log("Public Key:", publicKey.toString());

generateKey(); 
get_balance();