import { Link } from 'react-router-dom';

export default function AccountDeleteFailed() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6 text-center">
                <h1 className="text-2xl font-bold text-red-600">Account Deletion Failed</h1>
                
                <p className="text-gray-700">
                    We encountered an issue while trying to delete your account.
                </p>

                <p className="text-gray-700">
                    Please try again later or contact support if the issue persists.
                </p>

                <Link
                    to="/accountdeleteconfirm"
                    className="block w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition"
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
    );
}
