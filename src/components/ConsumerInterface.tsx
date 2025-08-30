import React, { useState, useRef, useEffect } from "react";
import {
  Scan,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  Upload,
} from "lucide-react";
import QrScanner from "qr-scanner";
import { BlockchainSimulator } from "../utils/blockchain";
import { web3Service } from "../utils/web3";
import Web3Connection from "./Web3Connection";

const ConsumerInterface: React.FC = () => {
  const [scanResult, setScanResult] = useState<string>("");
  const [verification, setVerification] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMethod, setScanMethod] = useState<"camera" | "upload">("camera");
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const blockchain = BlockchainSimulator.getInstance();

  useEffect(() => {
    blockchain.loadFromStorage();
    setIsWeb3Connected(web3Service.getConnectionStatus());
  }, []);

  const handleWeb3ConnectionChange = (connected: boolean) => {
    setIsWeb3Connected(connected);
  };

  const startCameraScanning = async () => {
    try {
      setIsScanning(true);
      if (videoRef.current) {
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            setScanResult(result.data);
            verifyProduct(result.data);
            stopScanning();
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );
        await qrScannerRef.current.start();
      }
    } catch (error) {
      console.error("Error starting camera:", error);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await QrScanner.scanImage(file);
        setScanResult(result);
        verifyProduct(result);
      } catch (error) {
        console.error("Error scanning image:", error);
        setVerification({
          isValid: false,
          message: "Could not read QR code from image",
          product: null,
        });
      }
    }
  };

  const verifyProduct = async (hash: string) => {
    let product = null;
    let scanCount = 0;
    let fromBlockchain = false;

    try {
      if (isWeb3Connected) {
        product = await web3Service.getProduct(hash);
        if (product) {
          scanCount = await web3Service.scanProduct(hash);
          product.scanCount = scanCount;
          fromBlockchain = true;

          const localProduct = {
            ...product,
            blockchainHash: hash,
            createdAt: product.createdAt || new Date(),
            scanCount: scanCount,
            isActive: true,
          };
          blockchain.addProduct(localProduct);
        }
      } else {
        product = blockchain.getProduct(hash);
        if (product) {
          blockchain.incrementScanCount(hash);
          product = blockchain.getProduct(hash);
          scanCount = product.scanCount;
        }
      }
    } catch (error) {
      console.error("Error verifying product:", error);
      product = blockchain.getProduct(hash);
      if (product) {
        blockchain.incrementScanCount(hash);
        product = blockchain.getProduct(hash);
        scanCount = product.scanCount;
      }
    }

    if (!product) {
      setVerification({
        isValid: false,
        message: `Product not found in ${
          fromBlockchain ? "blockchain" : "database"
        }. This may be a counterfeit product.`,
        product: null,
        scanCount: 0,
      });
      return;
    }

    if (scanCount > 1) {
      setVerification({
        isValid: true,
        message: `Product is authentic but has been scanned ${scanCount} times. This could indicate the QR code has been copied.`,
        product: product,
        scanCount: scanCount,
        isMultipleScan: true,
        fromBlockchain: fromBlockchain,
      });
    } else {
      setVerification({
        isValid: true,
        message: `Product is authentic and verified on ${
          fromBlockchain ? "Ethereum blockchain" : "simulated blockchain"
        }.`,
        product: product,
        scanCount: scanCount,
        isMultipleScan: false,
        fromBlockchain: fromBlockchain,
      });
    }
  };

  const manualVerification = () => {
    if (scanResult.trim()) {
      verifyProduct(scanResult.trim());
    }
  };

  const resetVerification = () => {
    setScanResult("");
    setVerification(null);
    stopScanning();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Verification
          </h1>
          <p className="text-gray-600">
            Scan QR code to verify product authenticity on{" "}
            {isWeb3Connected ? "Ethereum blockchain" : "simulated blockchain"}
          </p>
        </div>

        {/* Web3 Connection */}
        <Web3Connection onConnectionChange={handleWeb3ConnectionChange} />

        {/* Scan Method Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h2 className="text-lg font-semibold mb-4">Choose Scanning Method</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setScanMethod("camera")}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                scanMethod === "camera"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Camera className="h-4 w-4 mr-2" />
              Camera Scan
            </button>
            <button
              onClick={() => setScanMethod("upload")}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                scanMethod === "upload"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </button>
          </div>
        </div>

        {/* Scanning Interface */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          {scanMethod === "camera" ? (
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-4">Camera Scanner</h2>
              {!isScanning ? (
                <>
                  <div className="bg-gray-100 rounded-lg p-8 mb-4">
                    <Scan className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Click to start camera scanning
                    </p>
                  </div>
                  <button
                    onClick={startCameraScanning}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Start Camera Scan
                  </button>
                </>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full max-w-md mx-auto rounded-lg mb-4"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <button
                    onClick={stopScanning}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200"
                  >
                    Stop Scanning
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-4">Upload QR Image</h2>
              <div className="bg-gray-100 rounded-lg p-8 mb-4 border-2 border-dashed border-gray-300">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Select an image containing a QR code
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Choose Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Manual Input */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h2 className="text-lg font-semibold mb-4">Manual Verification</h2>
          <div className="flex space-x-3">
            <input
              type="text"
              value={scanResult}
              onChange={(e) => setScanResult(e.target.value)}
              placeholder="Enter blockchain hash manually"
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={manualVerification}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Modal for Verification Results */}
        {verification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={resetVerification}
              >
                ✖
              </button>

              {/* Verification Icon & Message */}
              <div className="text-center mb-6">
                {verification.isValid ? (
                  verification.isMultipleScan ? (
                    <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                  ) : (
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  )
                ) : (
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                )}

                <h2
                  className={`text-2xl font-bold mb-2 ${
                    verification.isValid
                      ? verification.isMultipleScan
                        ? "text-orange-600"
                        : "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {verification.isValid
                    ? verification.isMultipleScan
                      ? "Warning: Multiple Scans Detected"
                      : "Product Verified"
                    : "Product Not Verified"}
                </h2>

                <p className="text-gray-600 mb-6">{verification.message}</p>
              </div>

              {/* Blockchain Info */}
              <div className="text-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    verification.fromBlockchain
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  Verified on{" "}
                  {verification.fromBlockchain
                    ? "Ethereum Blockchain"
                    : "Simulated Blockchain"}
                </span>
              </div>

              {/* Product Details */}
              {verification.product && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Product Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Product Name
                        </label>
                        <p className="text-gray-900">
                          {verification.product.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Manufacturer
                        </label>
                        <p className="text-gray-900">
                          {verification.product.manufacturer}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Category
                        </label>
                        <p className="text-gray-900">
                          {verification.product.category}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Price
                        </label>
                        <p className="text-gray-900">
                          ${verification.product.price}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Scan Count
                        </label>
                        <p
                          className={`font-medium ${
                            verification.scanCount > 1
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {verification.scanCount} scans
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Created
                        </label>
                        <p className="text-gray-900">
                          {new Date(
                            verification.product.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="text-gray-900">
                      {verification.product.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={resetVerification}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Scan Another Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerInterface;
