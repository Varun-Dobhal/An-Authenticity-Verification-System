import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package, Scan, Calendar, AlertTriangle } from 'lucide-react';
import { BlockchainSimulator } from '../utils/blockchain';

const Analytics: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalScans: 0,
    averageScans: 0,
    multipleScans: 0
  });

  const blockchain = BlockchainSimulator.getInstance();

  useEffect(() => {
    blockchain.loadFromStorage();
    const allProducts = blockchain.getAllProducts();
    setProducts(allProducts);

    const totalScans = allProducts.reduce((sum, p) => sum + p.scanCount, 0);
    const multipleScans = allProducts.filter(p => p.scanCount > 1).length;

    setStats({
      totalProducts: allProducts.length,
      totalScans,
      averageScans: allProducts.length > 0 ? Math.round(totalScans / allProducts.length * 10) / 10 : 0,
      multipleScans
    });
  }, []);

  const getTopScannedProducts = () => {
    return [...products]
      .sort((a, b) => b.scanCount - a.scanCount)
      .slice(0, 5);
  };

  const getRecentActivity = () => {
    return products
      .filter(p => p.lastScanned)
      .sort((a, b) => new Date(b.lastScanned).getTime() - new Date(a.lastScanned).getTime())
      .slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor product verification and scanning patterns</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-green-600 text-sm">Registered</p>
              </div>
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalScans}</p>
                <p className="text-blue-600 text-sm">Verifications</p>
              </div>
              <Scan className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Scans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScans}</p>
                <p className="text-purple-600 text-sm">Per Product</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Multiple Scans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.multipleScans}</p>
                <p className="text-orange-600 text-sm">Suspicious</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Scanned Products */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Top Scanned Products</h2>
            </div>
            
            <div className="space-y-4">
              {getTopScannedProducts().map((product, index) => (
                <div key={product.blockchainHash} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">by {product.manufacturer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-blue-600">{product.scanCount}</p>
                    <p className="text-sm text-gray-500">scans</p>
                  </div>
                </div>
              ))}
              
              {getTopScannedProducts().length === 0 && (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No scanning data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center mb-6">
              <Calendar className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {getRecentActivity().map((product) => (
                <div key={`${product.blockchainHash}-${product.lastScanned}`} className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">Scanned by consumer</p>
                    <p className="text-xs text-gray-500">
                      {new Date(product.lastScanned).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.scanCount > 1 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.scanCount === 1 ? 'First Scan' : `${product.scanCount} Scans`}
                    </span>
                  </div>
                </div>
              ))}
              
              {getRecentActivity().length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">All Products</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Manufacturer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Scans</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.blockchainHash} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{product.manufacturer}</td>
                    <td className="py-3 px-4 text-gray-700">${product.price}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        product.scanCount > 1 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {product.scanCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {products.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products registered yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;