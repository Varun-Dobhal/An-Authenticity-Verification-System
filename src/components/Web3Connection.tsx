import React, { useState, useEffect } from "react";
import { Wallet, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { web3Service } from "../utils/web3";

interface Web3ConnectionProps {
  onConnectionChange: (connected: boolean) => void;
}

const Web3Connection: React.FC<Web3ConnectionProps> = ({
  onConnectionChange,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{
    name: string;
    chainId: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const connected = web3Service.getConnectionStatus();
    setIsConnected(connected);

    if (connected) {
      const address = await web3Service.getWalletAddress();
      const network = await web3Service.getNetworkInfo();
      setWalletAddress(address);
      setNetworkInfo(network);
    }

    onConnectionChange(connected);
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const initialized = await web3Service.initialize();

      if (!initialized) {
        throw new Error("Failed to initialize Web3. Please install MetaMask.");
      }

      const address = await web3Service.connectWallet();
      const network = await web3Service.getNetworkInfo();

      setIsConnected(true);
      setWalletAddress(address);
      setNetworkInfo(network);
      onConnectionChange(true);
    } catch (error: any) {
      setError(error.message);
      setIsConnected(false);
      onConnectionChange(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletAddress) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Wallet Connected
              </p>
              <p className="text-xs text-green-600">
                {formatAddress(walletAddress)} •{" "}
                {networkInfo?.name || "Unknown Network"}
              </p>
            </div>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
            Blockchain Active
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <div className="text-center">
        <Wallet className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Let's Connect to Blockchain
        </h3>
        <p className="text-yellow-700 mb-4 text-sm">
          Connect your MetaMask wallet to use blockchain features.
          <br />
          Make sure you're connected to Ganache Local network (localhost:8545
          with Chain Id 1337).
          <br />
          As my script is set up to use it.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center mx-auto"
        >
          {isConnecting ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect MetaMask
            </>
          )}
        </button>

        <div className="mt-4 text-xs text-yellow-600">
          <p>
            Setup Guide: Check SETUP_GUIDE.md for complete Ganache + MetaMask
            setup,
            <br />
            as I have included all the steps to start it from scratch.
          </p>
          <p>
            If not have metamask extension get it from here have MetaMask?{" "}
            <br />
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Install here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Web3Connection;
