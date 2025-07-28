import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CancelSubscription() {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleFeedbackSubmit = () => {
        // Replace with actual API call if needed
        console.log('Feedback submitted:', feedback);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">Subscription Cancelled</h1>
                <p className="text-center text-gray-600">
                    Your subscription has been successfully cancelled.
                </p>
                <p className="text-center text-gray-600">
                    Your access will remain until <strong>31st July 2025</strong>.
                </p>

                {!submitted ? (
                    <div className="space-y-3">
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                            We'd love your feedback (optional):
                        </label>
                        <textarea
                            id="feedback"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="Let us know why you decided to cancel..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={4}
                        />
                        <button
                            onClick={handleFeedbackSubmit}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Submit Feedback
                        </button>
                    </div>
                ) : (
                    <p className="text-green-600 text-center">Thank you for your feedback!</p>
                )}

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
