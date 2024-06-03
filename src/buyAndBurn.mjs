import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import Raydium from '@raydium-io/raydium-sdk';
const raydiumEs5 = Raydium;

const connection = new Connection('https://api.devnet.solana.com');

const secretKey = Uint8Array.from(process.env.secretKey);
const wallet = Keypair.fromSecretKey(secretKey);

const RAYDIUM_MARKET = new PublicKey('CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW');
const GUAP_TOKEN = new PublicKey('9C7xMpQGVMMC61AHo7ejtdE2RXZDGZm6i6Kh7ak18gdJ');

async function buyGuap() {
  

  const raydium = new raydiumEs5(connection, wallet);

  // Fetch the market info
  const marketInfo = await raydium.fetchMarketInfo(RAYDIUM_MARKET);

  // Create or get associated token accounts
  const userGuapTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    GUAP_TOKEN,
    wallet.publicKey
  );

  // Define the trade amount and parameters
  const tradeAmount = 1; // Amount of GUAP to buy
  const slippage = 0.5; // Slippage tolerance in percentage

  // Execute the trade
  const transaction = await raydium.placeOrder({
    market: marketInfo,
    side: 'buy',
    price: marketInfo.askPrice * (1 + slippage / 100),
    size: tradeAmount,
    orderType: 'limit',
    clientId: null,
    selfTradeBehavior: 'decrementTake',
    userPublicKey: wallet.publicKey,
    userGuapTokenAccount
  });

  // Send the transaction
  const signature = await connection.sendTransaction(transaction, [wallet]);
  await connection.confirmTransaction(signature);

  console.log('Transaction successful with signature:', signature);
}

buyGuap().catch(console.error);
