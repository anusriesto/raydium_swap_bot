import { Connection, PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";
import * as fs from "fs";
import dotenv from 'dotenv';
import https from 'https';
import base58 from 'bs58';
import { Wallet,web3 } from '@project-serum/anchor';
const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";

const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;

const raydium: PublicKey = new PublicKey(RAYDIUM_PUBLIC_KEY);

// Replace HTTP_URL & WSS_URL with QuickNode HTTPS and WSS Solana Mainnet endpoint
const connection: Connection = new Connection(`https://cosmological-orbital-brook.solana-mainnet.quiknode.pro/51b9d378ef3cd20ffdf4fed00155a17e51e5ac4c`, {
    wsEndpoint: `wss://cosmological-orbital-brook.solana-mainnet.quiknode.pro/51b9d378ef3cd20ffdf4fed00155a17e51e5ac4c`,
    httpHeaders: { "x-session-hash": SESSION_HASH }
});