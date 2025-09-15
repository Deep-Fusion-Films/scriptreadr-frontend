import React from "react";
import { Link } from "react-router-dom";

export default function SubscriptionCancelFailed() {
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-red-600">
            Cancellation Failed
          </h1>
          <p className="text-center text-gray-600">
            We were unable to cancel your subscription.
          </p>
          <p className="text-center text-gray-600">
            This may be due to a network issue or a problem with your account.
          </p>
          <p className="text-center text-gray-600">
            Please try again or contact{" "}
            <Link to="/contact">
              <span className="text-[#2E3A87] underline">support</span>
            </Link>{" "}
            if the issue persists.
          </p>

          <Link
            to="/dashboard"
            className="block w-full bg-[#2E3A87] text-white py-2 rounded-md text-center hover:bg-blue-700 transition"
          >
            Try Again
          </Link>

          <Link
            to="/"
            className="block w-full bg-gray-300 text-gray-800 py-2 rounded-md text-center hover:bg-gray-400 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
