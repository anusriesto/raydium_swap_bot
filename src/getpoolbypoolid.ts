// Importing required modules and objects from the Solana web3.js and Raydium SDK
import { PublicKey, Connection } from "@solana/web3.js";  // Solana PublicKey and Connection object for handling public keys and connection
import {  
    LIQUIDITY_STATE_LAYOUT_V4,  // Layout for liquidity state in Raydium V4
    MARKET_STATE_LAYOUT_V3,     // Layout for market state in Raydium V3
    MAINNET_PROGRAM_ID          // Mainnet program IDs for different Raydium components
} from '@raydium-io/raydium-sdk';

// Defining an interface for the return structure of pool and market details
interface PoolKeys {
    id: PublicKey;
    programId: PublicKey;
    status: number;  // You can replace this with the specific enum or type if known
    baseDecimals: number;
    quoteDecimals: number;
    lpDecimals: number;
    baseMint: PublicKey;
    quoteMint: PublicKey;
    version: number;
    authority: PublicKey;
    openOrders: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    marketProgramId: PublicKey;
    marketId: PublicKey;
    marketBids: PublicKey;
    marketAsks: PublicKey;
    marketEventQueue: PublicKey;
    marketBaseVault: PublicKey;
    marketQuoteVault: PublicKey;
    marketAuthority: PublicKey;
    targetOrders: PublicKey;
    lpMint: PublicKey;
}

// Function to get pool keys by providing the pool's AMM ID
const getPoolKeysByPoolId = async (ammId: string, connection: Connection): Promise<PoolKeys | undefined> => {
    console.log(`Getting pool keys for ${ammId}`);  // Log the pool ID being queried
    
    // Fetch the account information for the given AMM ID
    const ammAccount = await connection.getAccountInfo(new PublicKey(ammId));
    if (ammAccount) {  // If the AMM account exists
        // Decode the account data using the liquidity state layout
        const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(ammAccount.data);
        
        // Fetch the market account information based on the decoded market ID
        const marketAccount = await connection.getAccountInfo(poolState.marketId);
        if (marketAccount) {  // If the market account exists
            // Decode the market account data using the market state layout
            const marketState = MARKET_STATE_LAYOUT_V3.decode(marketAccount.data);
            
            // Calculate the market authority using the market state and the program ID
            const marketAuthority = PublicKey.createProgramAddressSync(
                [
                    marketState.ownAddress.toBuffer(),  // Convert market address to buffer
                    marketState.vaultSignerNonce.toArrayLike(Buffer, "le", 8),  // Convert nonce to buffer in little-endian format
                ],
                MAINNET_PROGRAM_ID.OPENBOOK_MARKET,  // Program ID for the OpenBook market
            );
            
            // Return an object containing various details about the pool and market
            return {
                id: new PublicKey(ammId),  // Pool ID
                programId: MAINNET_PROGRAM_ID.AmmV4,  // Program ID for Raydium AMM V4
                status: poolState.status,  // Pool status
                baseDecimals: poolState.baseDecimal.toNumber(),  // Decimals for base token
                quoteDecimals: poolState.quoteDecimal.toNumber(),  // Decimals for quote token
                lpDecimals: 9,  // Decimals for liquidity provider token
                baseMint: poolState.baseMint,  // Mint address for the base token
                quoteMint: poolState.quoteMint,  // Mint address for the quote token
                version: 4,  // Version of the AMM
                authority: new PublicKey(  // Predefined authority address
                    "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
                ),
                openOrders: poolState.openOrders,  // Address for open orders account
                baseVault: poolState.baseVault,  // Address for the base token vault
                quoteVault: poolState.quoteVault,  // Address for the quote token vault
                marketProgramId: MAINNET_PROGRAM_ID.OPENBOOK_MARKET,  // Program ID for the market
                marketId: marketState.ownAddress,  // Address of the market
                marketBids: marketState.bids,  // Address of the market's bids
                marketAsks: marketState.asks,  // Address of the market's asks
                marketEventQueue: marketState.eventQueue,  // Address of the market's event queue
                marketBaseVault: marketState.baseVault,  // Address of the market's base vault
                marketQuoteVault: marketState.quoteVault,  // Address of the market's quote vault
                marketAuthority: marketAuthority,  // Calculated market authority address
                targetOrders: poolState.targetOrders,  // Address for target orders account
                lpMint: poolState.lpMint,  // Mint address for the liquidity provider token
            };
        }
    }
};

// Exporting the getPoolKeysByPoolId function for use in other parts of the application
export { getPoolKeysByPoolId };
