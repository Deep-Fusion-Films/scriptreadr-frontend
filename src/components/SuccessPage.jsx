import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
        <CheckCircle size={72} className="text-green-600 mb-4" />
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Payment Successful!
        </h1>
        <p className="text-center max-w-md mb-6 text-green-800">
          Thank you for subscribing. Your payment was successful, and your
          subscription is now active.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-green-900 text-white rounded-full shadow hover:bg-green-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
