"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  Package,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const blockchainFeatures = [
    {
      icon: Shield,
      title: "Immutable Security",
      description:
        "Every product verification is permanently recorded on the blockchain",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description:
        "Real-time authentication with lightning-fast blockchain queries",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      title: "Global Network",
      description:
        "Decentralized verification network spanning across continents",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    {
      number: "---",
      label: "Products Secured",
      delay: "0s",
    },
    { number: "---", label: "Blockchain Transactions", delay: "0.2s" },
    { number: "99.9%", label: "Verification Accuracy", delay: "0.4s" },
    { number: "---", label: "Countries Covered", delay: "0.6s" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Blockchain Blocks */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10 animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          >
            <div className="w-16 h-16 border-2 border-blue-400 rotate-45 animate-spin-slow" />
          </div>
        ))}

        {/* Mouse Follower Effect */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Logo Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-full transform group-hover:scale-110 transition-transform duration-300">
                <Package className="h-12 w-12 text-white animate-bounce" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Authenticity Verification
            <br />
            <span className="text-white">System</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Blockchain verification system using distributed ledger technology
            to eliminate counterfeiting forever...
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate("/manufacturer")}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center">
                Start Verification
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transform transition-all duration-1000 hover:scale-110 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ animationDelay: stat.delay }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {blockchainFeatures.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`relative w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Hover Arrow */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Blockchain Visualization */}
        <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-20">
          <h3 className="text-3xl font-bold text-center mb-8">
            Blockchain Network
          </h3>
          <div className="flex justify-center items-center space-x-4 overflow-x-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 animate-pulse`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                {i < 4 && (
                  <div
                    className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"
                    style={{ animationDelay: `${i * 0.3 + 0.15}s` }}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 mt-6">
            Each block represents a verified product in our immutable ledger
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Secure Your Products?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the blockchain revolution and protect your brand with
            unbreakable verification
          </p>
          <button
            onClick={() => navigate("/manufacturer")}
            className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full font-bold text-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">Get Started Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
