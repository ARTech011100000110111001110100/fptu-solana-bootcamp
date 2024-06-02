require('dotenv').config();

const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction } = require('@solana/web3.js');
const base58 = require('bs58');
const devnetUrl = 'https://api.devnet.solana.com';
const connection = new Connection(devnetUrl);

console.log('Connected to Devnet: ', connection.rpcEndpoint);

// Create a new account
async function createAccount() {
    console.log('Generating new account...');
    const userKeypair = Keypair.generate();
    const userPublicKey = userKeypair.publicKey;
    console.log('Public key: ', userPublicKey.toString());
    return userPublicKey;
}

// Check balance
async function checkBalance(address) {
    try {
        const solBalance = await connection.getBalance(address);
        console.log('SOL Balance: ', solBalance, ' Lamports');
        return solBalance;
    } catch (error) {
        console.error('Error fetching balance for ', address.toString(), ': ', error);
    }
}

// Airdrop call
async function airdrop(address, amount) {
    const lamports = amount;
    console.log('Airdropping ', amount, ' Lamports to ', address.toString(), ' ...');
    let delay = 500;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const txHash = await connection.requestAirdrop(address, amount);
            console.log('Airdropped successfully!');
            return txHash;
        } catch (error) {
            if (error.code === 429) {
                console.error('Airdrop rate limit reached. Retrying in ', delay, ' ms...');
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                console.error('Airdrop failed: ', error);
                throw error;
            }
        }
    }
}

// Create transaction
async function createTransaction(senderKey, receiverKey, amount) {
    console.log('Creating a transaction...');
    try {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(senderKey),
                toPubkey: new PublicKey(receiverKey),
                lamports: amount,
            })
        );
        const { blockhash } = await connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;
        return transaction;
    } catch (error) {
        console.error('Transaction failed due to: ', error);
    }
}

// Get secret key
async function getSecretKey() {
    try {
        const secretKeyBase58 = process.env.SOLANA_SECRET_KEY;
        if (!secretKeyBase58 || typeof secretKeyBase58 !== 'string') {
            throw new Error('SOLANA_SECRET_KEY is not defined or not a string');
        }
        const secretKeyArray = Uint8Array.from(base58.decode(secretKeyBase58));
        const privateKey = Keypair.fromSecretKey(secretKeyArray);
        return privateKey;
    } catch (error) {
        console.error('Secret key failed due to: ', error);
    }
}

async function task1() {
    const newAccount = await createAccount();
}

async function task2() {
    const senderPublicKey = new PublicKey('7GnVC9WogD4DKRhFn9QXMiGJtPSP9Skz7reTpfgqXrL8');
    const receiverPublicKey = new PublicKey('63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs');

    let solBalance = await checkBalance(senderPublicKey);
    const requireSol = LAMPORTS_PER_SOL / 1000000 * 5;

    if (solBalance < requireSol) {
        console.log('Your balance is too low.');
        console.log('Processing without sufficient balance...');
    }
    const transaction = await createTransaction(senderPublicKey, receiverPublicKey, requireSol);

    if (!transaction) {
        console.error('Failed to create a transaction.');
        return;
    }

    const senderPrivateKey = await getSecretKey();

    if (!senderPrivateKey) {
        console.error('Failed to get secret key.');
        return;
    }

    try {
        transaction.sign(senderPrivateKey);
        const signature = await connection.sendTransaction(transaction, [senderPrivateKey]);
        console.log('Transaction signature: ', signature);

        const confirmation = await connection.confirmTransaction(signature);
        console.log('Transaction confirmed: ', confirmation);

        const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
        console.log('View transaction on Solana Explorer: ', explorerUrl);
    } catch (error) {
        console.error('Transaction failed: ', error.message);
    }
}

async function task3() {
    const newAccount = await createAccount()
    const senderPublicKey = new PublicKey('7GnVC9WogD4DKRhFn9QXMiGJtPSP9Skz7reTpfgqXrL8');
    const receiverPublicKey = newAccount;

    let solBalance = await checkBalance(senderPublicKey);
    const requireSol = LAMPORTS_PER_SOL / 1000000 * 5;

    await airdrop(receiverPublicKey, requireSol * 10)

    if (solBalance < requireSol) {
        console.log('Your balance is too low.');
        console.log('Processing without sufficient balance...');
    }
    const transaction = await createTransaction(senderPublicKey, receiverPublicKey, requireSol);

    if (!transaction) {
        console.error('Failed to create a transaction.');
        return;
    }

    const senderPrivateKey = await getSecretKey();

    if (!senderPrivateKey) {
        console.error('Failed to get secret key.');
        return;
    }

    try {
        transaction.sign(senderPrivateKey);
        const signature = await connection.sendTransaction(transaction, [senderPrivateKey]);
        console.log('Transaction signature: ', signature);

        const confirmation = await connection.confirmTransaction(signature);
        console.log('Transaction confirmed: ', confirmation);

        const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
        console.log('View transaction on Solana Explorer: ', explorerUrl);
    } catch (error) {
        console.error('Transaction failed: ', error.message);
    }
}

async function task4() {
    const newAccount = await createAccount()
    const senderPublicKey = new PublicKey('7GnVC9WogD4DKRhFn9QXMiGJtPSP9Skz7reTpfgqXrL8');
    const receiverPublicKey1 = newAccount;

    let solBalance1 = await checkBalance(senderPublicKey);
    const requireSol1 = LAMPORTS_PER_SOL / 1000000 * 5;

    await airdrop(receiverPublicKey1, requireSol1 * 10)

    if (solBalance < requireSol) {
        console.log('Your balance is too low.');
        console.log('Processing without sufficient balance...');
    }
    const transaction1 = await createTransaction(senderPublicKey, receiverPublicKey1, requireSol1);

    if (!transaction1) {
        console.error('Failed to create a transaction.');
        return;
    }

    const senderPrivateKey = await getSecretKey();

    if (!senderPrivateKey) {
        console.error('Failed to get secret key.');
        return;
    }

    try {
        transaction.sign(senderPrivateKey);
        const signature = await connection.sendTransaction(transaction, [senderPrivateKey]);
        console.log('Transaction signature: ', signature);

        const confirmation = await connection.confirmTransaction(signature);
        console.log('Transaction confirmed: ', confirmation);

        const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
        console.log('View transaction on Solana Explorer: ', explorerUrl);
    } catch (error) {
        console.error('Transaction failed: ', error.message);
    }

    const receiverPublicKey2 = new PublicKey('63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs');

    let solBalance2 = await checkBalance(senderPublicKey);
    const requireSol2 = LAMPORTS_PER_SOL / 1000000 * 5;

    if (solBalance2 < requireSol2) {
        console.log('Your balance is too low.');
        console.log('Processing without sufficient balance...');
    }
    const transaction = await createTransaction(senderPublicKey, receiverPublicKey2, requireSol2);

    if (!transaction) {
        console.error('Failed to create a transaction.');
        return;
    }

    try {
        transaction.sign(senderPrivateKey);
        const signature = await connection.sendTransaction(transaction, [senderPrivateKey]);
        console.log('Transaction signature: ', signature);

        const confirmation = await connection.confirmTransaction(signature);
        console.log('Transaction confirmed: ', confirmation);

        const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
        console.log('View transaction on Solana Explorer: ', explorerUrl);
    } catch (error) {
        console.error('Transaction failed: ', error.message);
    }
}

async function main() {
    // Task 1
    try {
        await task1()
    } catch(error) {
        console.log('Task 1 incomplete.')
    }

    // Task 2
    try {
        await task2()
    } catch(error) {
        console.log('Task 2 is incomplete.')
    }

    // Task 3
    try {
        await task3()
    } catch(error) {
        console.log('Task 3 is incomplete.')
    }

    // Task 4
    try {
        await task4()
    } catch(error) {
        console.log('Task 4 is incomplete.')
    }

}

main().catch(err => console.error(err));
