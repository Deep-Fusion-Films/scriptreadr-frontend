import { Link } from 'react-router-dom';

export default function CancelSubscription() {
 
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">Subscription Cancelled</h1>
                <p className="text-center text-gray-600">
                    Your subscription has been successfully cancelled.
                </p>
    
                <Link
                    to="/pricing"
                    className="block w-full bg- bg-[#2E3A87] text-white py-2 rounded-md text-center transition"
                >
                    Resubscribe
                </Link>

                <Link
                    to="/"
                    className="block w-full bg-gray-300 text-gray-800 py-2 rounded-md text-center hover:bg-gray-400 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
