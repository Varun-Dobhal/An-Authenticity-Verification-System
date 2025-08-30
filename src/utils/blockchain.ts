import CryptoJS from "crypto-js";

export class BlockchainSimulator {
  private static instance: BlockchainSimulator;
  private products: Map<string, any> = new Map();

  static getInstance(): BlockchainSimulator {
    if (!BlockchainSimulator.instance) {
      BlockchainSimulator.instance = new BlockchainSimulator();
    }
    return BlockchainSimulator.instance;
  }

  generateHash(data: string): string {
    return CryptoJS.SHA256(data + Date.now()).toString();
  }

  addProduct(product: any): string {
    // If product already has a hash, use it (for blockchain products)
    const hash =
      product.blockchainHash || this.generateHash(JSON.stringify(product));
    const productWithHash = {
      ...product,
      blockchainHash: hash,
      createdAt: product.createdAt || new Date(),
      scanCount: product.scanCount || 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
    };

    this.products.set(hash, productWithHash);
    this.saveToStorage();
    return hash;
  }

  getProduct(hash: string): any | null {
    return this.products.get(hash) || null;
  }

  incrementScanCount(hash: string): void {
    const product = this.products.get(hash);
    if (product) {
      product.scanCount++;
      product.lastScanned = new Date();
      this.products.set(hash, product);
      this.saveToStorage();
    }
  }

  getAllProducts(): any[] {
    return Array.from(this.products.values());
  }

  private saveToStorage(): void {
    const data = Array.from(this.products.entries());
    localStorage.setItem("blockchain_products", JSON.stringify(data));
  }

  loadFromStorage(): void {
    const data = localStorage.getItem("blockchain_products");
    if (data) {
      const entries = JSON.parse(data);
      this.products = new Map(entries);
    }
  }
}
