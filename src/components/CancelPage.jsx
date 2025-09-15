import { Link } from "react-router-dom";
import { Ban } from "lucide-react";

export default function CancelPage() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 px-4">
        <Ban size={72} className="text-yellow-600 mb-4" />
        <h1 className="text-3xl font-bold text-yellow-700 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-center max-w-md mb-6 text-yellow-800">
          You cancelled the payment process. If this was a mistake, you can
          return and complete your subscription anytime.
        </p>
        <Link
          to="/pricing"
          className="px-6 py-3 bg-yellow-900 text-white rounded-full shadow hover:bg-yellow-700 transition"
        >
          Return to Pricing
        </Link>
      </div>
    </main>
  );
}
