import { Connection, PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";

const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";

const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;

const raydium: PublicKey = new PublicKey(RAYDIUM_PUBLIC_KEY);

// Replace HTTP_URL & WSS_URL with QuickNode HTTPS and WSS Solana Mainnet endpoint
const connection: Connection = new Connection(`https://cosmological-orbital-brook.solana-mainnet.quiknode.pro/51b9d378ef3cd20ffdf4fed00155a17e51e5ac4c`, {
    wsEndpoint: `wss://cosmological-orbital-brook.solana-mainnet.quiknode.pro/51b9d378ef3cd20ffdf4fed00155a17e51e5ac4c`,
    httpHeaders: { "x-session-hash": SESSION_HASH }
});

// Monitor logs
async function main(connection: Connection, programAddress: PublicKey): Promise<void> {
    console.log("Monitoring logs for program:", programAddress.toString());
    connection.onLogs(
        programAddress,
        ({ logs, err, signature }) => {
            if (err) return;

            if (logs && logs.some(log => log.includes("initialize2"))) {
                console.log("Signature for 'initialize2':", signature);
                fetchRaydiumAccounts(signature, connection);
            }
        },
        "finalized"
    );
}

// Parse transaction and filter data
async function fetchRaydiumAccounts(txId: string, connection: Connection): Promise<void> {
    const tx: ParsedTransactionWithMeta | null = await connection.getParsedTransaction(
        txId,
        {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        }
    );
    
    credits += 100;
    
    //const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY)?.programId;
    //const accounts=tx?.transaction.message.instructions.find(ix=>ix.programId.toBase58()===)   
    const accounts=tx?.transaction.message.instructions;
    if (!accounts) {
        console.log("No accounts found in the transaction.");
        return;
    }

    const tokenAIndex = 8;
    const tokenBIndex = 9;

    const tokenAAccount = accounts[tokenAIndex];
    const tokenBAccount = accounts[tokenBIndex];

    // const displayData = [
    //     { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
    //     { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
    // ];
    const displayData = [
      { "Token": "A", "Account Public Key": tokenAAccount },
      { "Token": "B", "Account Public Key": tokenBAccount }
  ];
    console.log("New LP Found");
    console.log(generateExplorerUrl(txId));
    console.table(displayData);
    console.log("Total QuickNode Credits Used in this session:", credits);
}

function generateExplorerUrl(txId: string): string {
    return `https://solscan.io/tx/${txId}`;
}

main(connection, raydium).catch(console.error);
