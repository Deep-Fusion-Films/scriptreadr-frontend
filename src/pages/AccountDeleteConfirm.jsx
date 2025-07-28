import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthToken } from "../util";
import { useToken } from "../store/AuthContext";
import {logout} from "../util";

export default function AccountDeleteConfirm() {
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useToken();

  const handleFeedbackSubmit = () => {
    // Replace with actual API call if needed
    console.log("Feedback submitted:", feedback);
    setSubmitted(true);
  };

  const handleProceedDelete = async () => {
    // Redirect to final delete confirmation handler
    //do something
    setDeleting(true)
    const token = await checkAuthToken();
    if (!token) {
      setToken(null);
      navigate("/signin");
      return
    }

    setToken(token);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCAL}/user/delete_user/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        await logout(setToken)
        setDeleting(false)
        navigate("/signin")
      } else {
        setDeleting(false)
        navigate("/accountdeletefailed");
      }
    } catch (err) {
      console.log(err);
      navigate("/accountdeletefailed")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Ready to Delete Your Account?
        </h1>

        <p className="text-center text-red-600 font-semibold">
          Please ensure you have cancelled any active subscriptions before
          proceeding to avoid future charges.
        </p>

        <div className="space-y-2 text-gray-700">
          <p className="font-medium">
            If you proceed, the following will be permanently deleted:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Your account and login credentials</li>
            <li>All your saved scripts</li>
            <li>All essential cookies</li>
            <li>Associated personal data in our systems</li>
          </ul>
          <p className="text-sm text-gray-600">
            This action is irreversible. Please be sure before proceeding.
          </p>
        </div>

        {!submitted ? (
          <div className="space-y-3">
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-gray-700"
            >
              We’d love your feedback before you leave (optional):
            </label>
            <textarea
              id="feedback"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Let us know why you are deleting your account..."
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
          <p className="text-green-600 text-center">
            Thank you for your feedback!
          </p>
        )}

        <button
          onClick={handleProceedDelete}
          className="block w-full bg-red-600 text-white py-2 rounded-md text-center hover:bg-red-700 transition"
        >
          {deleting ? "Deleting Your Account..."
          :"Proceed to Delete Account"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="block w-full bg-gray-300 text-gray-800 py-2 rounded-md text-center hover:bg-gray-400 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
