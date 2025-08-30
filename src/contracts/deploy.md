# Smart Contract Deployment Guide

## Prerequisites

1. **Install Required Tools**:
   ```bash
   npm install -g @remix-project/remixd
   npm install -g truffle
   npm install -g ganache-cli
   ```

2. **Get Test ETH**:
   - For testnets: Use faucets (Sepolia, Goerli)
   - For local development: Use Ganache

## Deployment Options

### Option 1: Using Remix IDE (Recommended for beginners)

1. **Open Remix**: Go to https://remix.ethereum.org
2. **Create Contract**: Copy `ProductRegistry.sol` into Remix
3. **Compile**: 
   - Select Solidity Compiler
   - Choose version 0.8.19+
   - Click "Compile ProductRegistry.sol"
4. **Deploy**:
   - Go to "Deploy & Run Transactions"
   - Select "Injected Provider - MetaMask"
   - Connect your MetaMask wallet
   - Click "Deploy"
   - Confirm transaction in MetaMask
5. **Copy Address**: After deployment, copy the contract address
6. **Update Code**: Replace `CONTRACT_ADDRESS` in `src/utils/web3.ts`

### Option 2: Using Hardhat (Advanced)

1. **Initialize Project**:
   ```bash
   mkdir blockchain-contracts
   cd blockchain-contracts
   npm init -y
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npx hardhat
   ```

2. **Create Deployment Script**:
   ```javascript
   // scripts/deploy.js
   async function main() {
     const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
     const productRegistry = await ProductRegistry.deploy();
     await productRegistry.deployed();
     console.log("ProductRegistry deployed to:", productRegistry.address);
   }
   
   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

3. **Deploy**:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### Option 3: Local Development with Ganache

1. **Start Ganache**:
   ```bash
   ganache-cli --deterministic --accounts 10 --host 0.0.0.0 --port 8545
   ```

2. **Configure MetaMask**:
   - Network: Custom RPC
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Import accounts using private keys from Ganache

3. **Deploy using Remix** with "Web3 Provider" pointing to localhost:8545

## Network Configuration

### Sepolia Testnet (Recommended)
- Network Name: Sepolia
- RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- Chain ID: 11155111
- Currency: SepoliaETH
- Faucet: https://sepoliafaucet.com/

### Goerli Testnet
- Network Name: Goerli
- RPC URL: https://goerli.infura.io/v3/YOUR_INFURA_KEY
- Chain ID: 5
- Currency: GoerliETH
- Faucet: https://goerlifaucet.com/

## After Deployment

1. **Update Contract Address**: Replace the placeholder in `src/utils/web3.ts`
2. **Test Connection**: Try connecting MetaMask in the app
3. **Register Test Product**: Add a product through the manufacturer dashboard
4. **Verify Product**: Scan the QR code in the consumer interface

## Troubleshooting

- **Gas Fees**: Ensure you have enough ETH for gas
- **Network Issues**: Check MetaMask network selection
- **Contract Errors**: Verify contract compilation and deployment
- **Connection Problems**: Ensure MetaMask is unlocked and connected

## Security Notes

- Never deploy with real funds on mainnet without thorough testing
- Use testnets for development and testing
- Keep private keys secure
- Consider using multi-signature wallets for production