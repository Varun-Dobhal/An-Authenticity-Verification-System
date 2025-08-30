import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Search,
  BarChart3,
  LogIn,
  UserPlus,
  Info,
  MoreHorizontal,
} from "lucide-react";

const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const mainTabs = [
    { path: "/manufacturer", label: "Manufacturer", icon: Package },
    { path: "/consumer", label: "Consumer", icon: Search },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const extraTabs = [
    { path: "/login", label: "Login", icon: LogIn },
    { path: "/signup", label: "SignUp", icon: UserPlus },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl leading-none font-bold text-gray-900 ">
                Authenticity Verification System
              </h1>
            </div>
          </Link>

          {/* Tabs Section */}
          <div className="flex items-center space-x-1 relative">
            {/* Main Tabs */}
            {mainTabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === tab.path
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Link>
            ))}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                  {extraTabs.map((tab) => (
                    <Link
                      key={tab.path}
                      to={tab.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center px-4 py-2 w-full text-left font-medium transition-all duration-200 ${
                        location.pathname === tab.path
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
