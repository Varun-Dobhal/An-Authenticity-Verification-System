import React from "react";
import { Link } from "react-router-dom";

const LoginForm: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Welcome back
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Content */}
        <form className="px-6 py-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Footer */}
          <div className="space-y-4 pt-4">
            <button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
            >
              Sign in
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full h-11 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link
                to={"/signup"}
                className="font-medium text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
