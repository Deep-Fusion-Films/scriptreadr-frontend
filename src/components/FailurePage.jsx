import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function FailurePage() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4">
        <XCircle size={72} className="text-red-600 mb-4" />
        <h1 className="text-3xl font-bold text-red-700 mb-2">Payment Failed</h1>
        <p className="text-center max-w-md mb-6 text-red-800">
          Unfortunately, your payment could not be processed. Please try again
          or use a different payment method.
        </p>
        <Link
          to="/pricing"
          className="px-6 py-3 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
        >
          Retry Payment
        </Link>
      </div>
    </main>
  );
}
