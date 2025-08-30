import React, { useState, useEffect } from "react";
import {
  Plus,
  Package,
  QrCode,
  Calendar,
  TrendingUp,
  Loader,
} from "lucide-react";
import { BlockchainSimulator } from "../utils/blockchain";
import { web3Service } from "../utils/web3";
import { generateQRCode } from "../utils/qrGenerator";
import { Product } from "../types/Product";
import Web3Connection from "./Web3Connection";

const ManufacturerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useBlockchain, setUseBlockchain] = useState(false);
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    description: "",
    price: "",
    category: "",
  });

  const blockchain = BlockchainSimulator.getInstance();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    // Always load from local storage for UI display
    blockchain.loadFromStorage();
    let localProducts = blockchain.getAllProducts();

    if (useBlockchain && isWeb3Connected) {
      try {
        // Get blockchain products and merge with local data
        const blockchainProducts = await web3Service.getMyProducts();

        // Merge blockchain data with local QR codes
        const mergedProducts = blockchainProducts.map((blockchainProduct) => {
          const localProduct = localProducts.find(
            (p) => p.blockchainHash === blockchainProduct.blockchainHash
          );
          return {
            ...blockchainProduct,
            qrCode: localProduct?.qrCode || null,
          };
        });

        setProducts(mergedProducts);
      } catch (error) {
        console.error("Failed to load blockchain products:", error);
        setProducts(localProducts);
      }
    } else {
      setProducts(localProducts);
    }
  };

  const handleWeb3ConnectionChange = (connected: boolean) => {
    setIsWeb3Connected(connected);
    if (connected) {
      setUseBlockchain(true);
      loadProducts();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        id: `PROD_${Date.now()}`,
      };

      let hash: string;
      let qrCodeUrl: string;

      if (useBlockchain && isWeb3Connected) {
        // Use real blockchain
        hash = await web3Service.registerProduct(productData);

        // Generate QR code for blockchain hash
        qrCodeUrl = await generateQRCode(hash);

        // Store product locally for UI display with QR code
        const localProduct = {
          ...productData,
          blockchainHash: hash,
          qrCode: qrCodeUrl,
          createdAt: new Date(),
          scanCount: 0,
          isActive: true,
        };
        blockchain.addProduct(localProduct);
      } else {
        // Use simulation
        hash = blockchain.addProduct(productData);
        qrCodeUrl = await generateQRCode(hash);

        // Update with QR code
        const updatedProducts = blockchain.getAllProducts();
        const newProduct = updatedProducts.find(
          (p) => p.blockchainHash === hash
        );
        if (newProduct) {
          newProduct.qrCode = qrCodeUrl;
          blockchain.addProduct(newProduct);
        }
      }

      await loadProducts();
      setFormData({
        name: "",
        manufacturer: "",
        description: "",
        price: "",
        category: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = (qrCode: string, productName: string) => {
    const link = document.createElement("a");
    link.download = `${productName}_QR.png`;
    link.href = qrCode;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manufacturer's Dashboard
              {useBlockchain && isWeb3Connected
                ? "(Ethereum blockchain)"
                : "(simulated blockchain)*"}
            </h1>
            <p className="text-gray-600">
              You can Register and manage your products on the
              {useBlockchain && isWeb3Connected
                ? " Ethereum blockchain"
                : " simulated blockchain"}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>

        {/* Web3 Connection */}
        <Web3Connection onConnectionChange={handleWeb3ConnectionChange} />

        {/* Blockchain Mode Toggle */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">*Blockchain Mode</h3>
              <p className="text-sm text-gray-600">
                {useBlockchain && isWeb3Connected ? (
                  <>
                    Using real Ethereum blockchain with smart contracts
                    <br />
                    If you are seeing this message congratulations you are
                    connected to the Ethereum blockchain
                  </>
                ) : (
                  <>
                    Using simulated blockchain.
                    <br />
                    Basically this feature will allow you to get an idea of how
                    the blockchain works if you are not able to connect to the
                    real blockchain.
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  useBlockchain && isWeb3Connected
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {useBlockchain && isWeb3Connected
                  ? "Blockchain Mode"
                  : "Simulation Mode"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products added</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.length}
                </p>
              </div>
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.reduce((sum, p) => sum + p.scanCount, 0)}
                </p>
              </div>
              <QrCode className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter((p) => p.isActive).length}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        {useBlockchain && isWeb3Connected
                          ? "Adding to Blockchain..."
                          : "Adding..."}
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.blockchainHash}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-2">
                  by {product.manufacturer}
                </p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.scanCount} scans
                  </span>
                </div>

                {product.qrCode && (
                  <div className="text-center mb-4">
                    <img
                      src={product.qrCode}
                      alt="QR Code"
                      className="mx-auto mb-2 border rounded-lg"
                      style={{ width: "120px", height: "120px" }}
                    />
                    <button
                      onClick={() => downloadQR(product.qrCode, product.name)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Download QR Code
                    </button>
                  </div>
                )}

                <div className="text-xs text-gray-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                  {useBlockchain && isWeb3Connected && (
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      On-Chain
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first product to the blockchain
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
