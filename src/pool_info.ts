// Importing necessary configurations from config.ts
import { CONFIG } from './config';

// Importing necessary classes from the Solana web3.js library
import { PublicKey, Connection } from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();
// Importing functions from the scripts folder
import { fetchMarketAccounts } from './fetchmarketaccount';  // Function to fetch market accounts
import { getPoolKeysByPoolId } from './getpoolbypoolid';  // Function to get pool keys by pool ID

// Type definitions for market data and pool keys (you can adjust these based on your actual structure)


// Creating the main asynchronous function
const main = async (): Promise<void> => {
  try {
    if (!process.env.QUICKNODE_URL) {
        throw new Error('QUICKNODE_URL is not set in the environment variables');
      }
    const url = new Connection(process.env.QUICKNODE_URL);
    
    // Initiating token PublicKey instances using the provided public key strings from config.ts
    const base: PublicKey = new PublicKey('So11111111111111111111111111111111111111112');  // Base token public key (tokenA)
    const quote: PublicKey = new PublicKey('ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY');  // Quote token public key (tokenB)
    
    // Fetching market data for the tokens to retrieve the pool ID
    const marketData = await fetchMarketAccounts(url, base, quote, "confirmed");

    // Validate marketData to ensure there's a pool ID
    if (!marketData || !marketData.id) {
      throw new Error('Invalid market data or pool ID not found.');
    }
    
    // Fetching pool keys using the retrieved pool ID (marketData.id)
    const poolKeys = await getPoolKeysByPoolId(marketData.id, url);
    
    // Logging the fetched pool keys to the console
    console.log(poolKeys);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Calling the main function to execute the script
main();
