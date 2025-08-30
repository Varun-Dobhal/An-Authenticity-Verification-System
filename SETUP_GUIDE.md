# Complete Setup Guide

## Prerequisites Installation

### Step 1: Install Node.js and npm

1. Download Node.js from https://nodejs.org/ (LTS version)
2. Install and verify:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Ganache CLI

```bash
npm install -g ganache-cli
```

### Step 3: Install Truffle (for contract deployment)

```bash
npm install -g truffle
```

### Step 4: Install MetaMask Browser Extension

1. Go to https://metamask.io/
2. Click "Download" and install for your browser
3. Create a new wallet or import existing one
4. **IMPORTANT**: Save your seed phrase securely!

## Now Local Blockchain Setup

### Step 5: Start Ganache Local Blockchain

Open a new terminal and run:

```bash
ganache-cli --deterministic --accounts 10 --host 0.0.0.0 --port 8545 --networkId 1337
```

**What this does:**

- Creates 10 test accounts with 100 ETH each
- Runs on localhost:8545
- Network ID: 1337
- Deterministic: Same accounts every time

**Keep this terminal running!** You'll see:

- 10 account addresses with private keys
- RPC Server running on http://127.0.0.1:8545

### Step 6: Configure MetaMask for Local Network

1. Open MetaMask extension
2. Click network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - **Network Name**: Ganache Local
   - **New RPC URL**: http://localhost:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
   - **Block Explorer URL**: (leave empty)
5. Click "Save"
6. Switch to "Ganache Local" network

### Step 7: Import Ganache Account to MetaMask

1. Copy any private key from Ganache terminal output
2. In MetaMask, click account icon → "Import Account"
3. Select "Private Key" and paste the key
4. Click "Import"
5. You should see 100 ETH balance!

### Step 8: Deploy Contract

**Now you're ready to deploy!**
**_Open CMD in Project Folder_**

```bash
truffle compile
truffle migrate --network development
```

**IMPORTANT - Save the contract address!**

You'll see output like this:

```
Deploying 'ProductRegistry'
   ----------------------
   > transaction hash:    0xabc123...
   > Blocks: 0            Seconds: 0
   > contract address:    0x5FbDB2315678afecb367f032d93F642f64180aa3
   > block number:        2
   > block timestamp:     1640995200
   > account:             0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   > balance:             99.99
   > gas used:            1234567
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01234567 ETH

ProductRegistry deployed at address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Copy this address to src/utils/web3.ts CONTRACT_ADDRESS
```

**COPY THE CONTRACT ADDRESS!**
In this example: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

**What to do with this address:**

- Copy the long address (starts with 0x...)
- You'll paste it in Step 9 into your React app
- This tells your app WHERE to find the contract on the blockchain

**If you see errors:**

- Make sure Ganache is running
- Check that truffle-config.js has correct settings
- Verify your contract code has no syntax errors

## Update Application Code

### Step 9: Update Contract Address

In your React app, update `src/utils/web3.ts`:

```typescript
// Replace this line:
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
// With your actual deployed address from Step 12
const CONTRACT_ADDRESS = "0xYOUR_ACTUAL_CONTRACT_ADDRESS_HERE";
```

## Testing the Complete System

### Step 10: Test Manufacturer Flow

1. Start your React app: `npm run dev`
2. Open the app in browser
3. Click "Connect MetaMask" - should connect automatically
4. Go to Manufacturer tab
5. Add a new product:
   - Name: "Test iPhone"
   - Manufacturer: "Apple"
   - Description: "Test product"
   - Price: "999"
   - Category: "Electronics"
6. Click "Add Product"
7. **MetaMask will popup** - confirm the transaction
8. Wait for transaction to complete
9. Product should appear with QR code

### Step 11: Test Consumer Flow

1. Download the QR code from manufacturer dashboard
2. Go to Consumer tab
3. Upload the QR image or scan with camera
4. Should show "Product Verified" with details
5. Scan again - should show "Multiple Scans" warning

### Step 12: Verify on Blockchain

Check Ganache terminal - you should see:

- Transaction hashes
- Gas used
- Block numbers
- Account balances decreasing (gas fees)

## Troubleshooting

### Common Issues:

1. **MetaMask not connecting:**

   - Ensure Ganache is running on port 8545
   - Check network settings in MetaMask
   - Try refreshing the page

2. **Transaction fails:**

   - Check if you have enough ETH for gas
   - Ensure contract address is correct
   - Check Ganache logs for errors

3. **Contract not found:**

   - Verify contract deployed successfully
   - Check contract address in web3.ts
   - Ensure you're on correct network

4. **Gas estimation failed:**
   - Increase gas limit in truffle-config.js
   - Check contract function parameters

### Reset Everything:

If something goes wrong:

1. Stop Ganache (Ctrl+C)
2. Restart Ganache with same command
3. Redeploy contracts: `truffle migrate --reset`
4. Update contract address in code
5. Reset MetaMask account (Settings → Advanced → Reset Account)

## Next Steps

Once everything works locally:

1. Deploy to Sepolia testnet for public testing
2. Get testnet ETH from faucets
3. Share with others for testing
4. Eventually deploy to Ethereum mainnet

**Congratulations!** You now have a fully functional blockchain-based product identification system running locally!

**_Novalty feature_**

<!-- function scanProduct(string memory productHash)
public
productMustExist(productHash)
returns (uint256)
{
products[productHash].scanCount++; // yaha increase hota hai
products[productHash].lastScanned = block.timestamp;
totalScans++;

    emit ProductScanned(
        productHash,
        msg.sender,
        products[productHash].scanCount,
        block.timestamp
    );

    return products[productHash].scanCount;

} -->
