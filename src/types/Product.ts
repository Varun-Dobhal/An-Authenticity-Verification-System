export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  description: string;
  price: number;
  category: string;
  blockchainHash: string;
  qrCode: string;
  createdAt: Date;
  scanCount: number;
  lastScanned?: Date;
  isActive: boolean;
}