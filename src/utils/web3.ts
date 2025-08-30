import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  "function registerProduct(string productHash, string id, string name, string manufacturer, string description, uint256 price, string category) public",
  "function scanProduct(string productHash) public returns (uint256)",
  "function getProduct(string productHash) public view returns (tuple(string id, string name, string manufacturer, string description, uint256 price, string category, address registeredBy, uint256 createdAt, uint256 scanCount, uint256 lastScanned, bool isActive))",
  "function getAllProductHashes() public view returns (string[])",
  "function getProductsByManufacturer(address manufacturer) public view returns (string[])",
  "function getTotalStats() public view returns (uint256, uint256)",
  "event ProductRegistered(string indexed productHash, string name, string manufacturer, address indexed registeredBy, uint256 timestamp)",
  "event ProductScanned(string indexed productHash, address indexed scannedBy, uint256 scanCount, uint256 timestamp)",
];

// Contract address (you'll need to deploy the contract and update this)
const CONTRACT_ADDRESS = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601"; // TODO: Replace with your Ganache deployed contract address

export class Web3BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private isConnected = false;

  async initialize(): Promise<boolean> {
    try {
      const ethereumProvider = await detectEthereumProvider();

      if (!ethereumProvider) {
        console.warn(
          "MetaMask not detected. Please install MetaMask extension."
        );
        return false;
      }

      this.provider = new ethers.BrowserProvider(ethereumProvider as any);
      await this.connectWallet();

      return true;
    } catch (error) {
      console.warn("Failed to initialize Web3. Using simulation mode.", error);
      return false;
    }
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    try {
      // Request account access
      await this.provider.send("eth_requestAccounts", []);

      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        this.signer
      );

      const address = await this.signer.getAddress();
      this.isConnected = true;

      return address;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }

  async registerProduct(productData: {
    id: string;
    name: string;
    manufacturer: string;
    description: string;
    price: number;
    category: string;
  }): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error("Contract not initialized. Please connect wallet first.");
    }

    try {
      // Generate unique hash for the product
      const productHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(productData) + Date.now())
      );

      // Convert price to Wei (smallest unit of Ether)
      const priceInWei = ethers.parseEther(productData.price.toString());

      // Call smart contract function
      const tx = await this.contract.registerProduct(
        productHash,
        productData.id,
        productData.name,
        productData.manufacturer,
        productData.description,
        priceInWei,
        productData.category
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      console.log("Product registered on blockchain:", receipt);
      return productHash;
    } catch (error) {
      console.error("Failed to register product on blockchain:", error);
      throw error;
    }
  }

  async scanProduct(productHash: string): Promise<number> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const tx = await this.contract.scanProduct(productHash);
      const receipt = await tx.wait();

      // Get the updated scan count from the transaction events
      const event = receipt.logs.find(
        (log: any) =>
          log.topics[0] ===
          ethers.id("ProductScanned(string,address,uint256,uint256)")
      );

      if (event) {
        const decodedEvent = this.contract.interface.parseLog(event);
        return Number(decodedEvent?.args[2]); // scanCount
      }

      return 1;
    } catch (error) {
      console.error("Failed to scan product on blockchain:", error);
      throw error;
    }
  }

  async getProduct(productHash: string): Promise<any> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const product = await this.contract.getProduct(productHash);

      return {
        id: product.id,
        name: product.name,
        manufacturer: product.manufacturer,
        description: product.description,
        price: ethers.formatEther(product.price), // Convert from Wei to Ether
        category: product.category,
        registeredBy: product.registeredBy,
        createdAt: new Date(Number(product.createdAt) * 1000),
        scanCount: Number(product.scanCount),
        lastScanned:
          product.lastScanned > 0
            ? new Date(Number(product.lastScanned) * 1000)
            : null,
        isActive: product.isActive,
        blockchainHash: productHash,
      };
    } catch (error) {
      console.error("Failed to get product from blockchain:", error);
      return null;
    }
  }

  async getAllProducts(): Promise<any[]> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const productHashes = await this.contract.getAllProductHashes();
      const products = [];

      for (const hash of productHashes) {
        const product = await this.getProduct(hash);
        if (product) {
          products.push(product);
        }
      }

      return products;
    } catch (error) {
      console.error("Failed to get all products from blockchain:", error);
      return [];
    }
  }

  async getMyProducts(): Promise<any[]> {
    if (!this.contract || !this.signer) {
      throw new Error("Contract not initialized");
    }

    try {
      const address = await this.signer.getAddress();
      const productHashes = await this.contract.getProductsByManufacturer(
        address
      );
      const products = [];

      for (const hash of productHashes) {
        const product = await this.getProduct(hash);
        if (product) {
          products.push(product);
        }
      }

      return products;
    } catch (error) {
      console.error("Failed to get my products from blockchain:", error);
      return [];
    }
  }

  async getTotalStats(): Promise<{
    totalProducts: number;
    totalScans: number;
  }> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const [totalProducts, totalScans] = await this.contract.getTotalStats();
      return {
        totalProducts: Number(totalProducts),
        totalScans: Number(totalScans),
      };
    } catch (error) {
      console.error("Failed to get stats from blockchain:", error);
      return { totalProducts: 0, totalScans: 0 };
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  async getWalletAddress(): Promise<string | null> {
    if (!this.signer) return null;
    try {
      return await this.signer.getAddress();
    } catch {
      return null;
    }
  }

  async getNetworkInfo(): Promise<{ name: string; chainId: number } | null> {
    if (!this.provider) return null;
    try {
      const network = await this.provider.getNetwork();
      return {
        name: network.name,
        chainId: Number(network.chainId),
      };
    } catch {
      return null;
    }
  }
}

export const web3Service = new Web3BlockchainService();
