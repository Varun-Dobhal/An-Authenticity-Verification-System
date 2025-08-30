import React, { useState } from "react";
import { Package, Shield, Users, Award, Target } from "lucide-react";

const About: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description:
        "State-of-the-art encryption and blockchain technology to ensure product authenticity.",
    },
    {
      icon: Users,
      title: "User-Friendly",
      description:
        "Simple interface for both manufacturers and consumers to verify product authenticity.",
    },
    {
      icon: Award,
      title: "Industry Leading",
      description:
        "Well this system is under Examination for Production phase...",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Package className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Authenticity Verification System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Protecting brands and consumers from counterfeit products through
              Blockchain technology
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white shadow-md rounded-xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
            This invention is related to a system and method for identifying
            pirated products across various industries like Pharmaceuticals,
            Luxury goods, Electronics, Fashion, Automobile parts, Nutrition
            Supplements. With the help of fully developed autonomous software
            and combination of advanced technologies such as blockchain, this
            system provides real-time verification and authentication of product
            authenticity. The system ensures that customer and manufacturer can
            preciously differentiate between genuine and fake products, this
            system will help in protecting brand integrity and will keep buyers
            trust as a priority. The unique part of this invention is the
            traceability of the QR code this feature in our system will help the
            customer to check the history of QR code that how many times this QR
            has been scanned, this feature will help to tell that this QR has
            been already scanned several, times this will trigger the warning to
            the user that this QR has been copied by the same product and has
            been pasted to the pirated product.
            <br /> Authenticity Verification System uses blockchain technology
            to create a secure and digital ledger for tracking the network of
            production, distribution, and sales of authentic products. Each
            product is assigned with a unique QR(quick response) code whose data
            will be stored on the block of the blockchain. By scanning this QR
            code with a particular app or a scanner, customer can verify whether
            the product is authentic or pirated. In addition to consumer use,
            the system can be used by retailers, manufacturers, and customer to
            streamline the detection of pirated or goods. The system target a
            wide range of industries including luxury antiques, pharmaceuticals,
            electronics, and food products, Nutrition Supplements manufacturers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Our Impact
          </h3>
          <p className="text-center">Still in Production phase...</p>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Manufacturer Registration
              </h4>
              <p className="text-gray-600">
                Brands/Manufacturer will register their products in our secure
                system with Products details and our desgined algorithm will
                genreate a unique QR code which will then further use for
                verification.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Consumer Verification
              </h4>
              <p className="text-gray-600">
                Customers scan or enter product codes to instantly verify
                authenticity.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Real-time Analytics
              </h4>
              <p className="text-gray-600">
                Get insights into verification patterns, potential
                counterfeiting attempts, and market trends.If the product is
                canned several times the system will alert the consumer.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-6 text-blue-100" />
          <h3 className="text-2xl font-bold mb-4">
            Ready to Protect Your Brand?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get in touch with us to safeguard your brand through our
            cutting-edge innovations.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Contact us...
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Contact Information
            </h2>
            <p className="text-gray-700 mb-2">
              Email:{" "}
              <a
                href="mailto:varundobhal33@gmail.com"
                className="text-blue-600"
              >
                varundobhal33@gmail.com
              </a>
            </p>
            <p className="text-gray-700 mb-2">
              Phone:{" "}
              <a href="tel:8272XXXX52" className="text-blue-600">
                +91 8272XXXX52
              </a>
            </p>
            <p className="text-gray-700 mb-4">
              Address: Graphic Era University, Dehradun
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
