import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthToken } from "../util";
import { useToken } from "../store/AuthContext";
import { logout } from "../util";

export default function AccountDeleteConfirm() {
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useToken();

  const handleProceedDelete = async () => {
    // Redirect to final delete confirmation handler
    //do something
    setDeleting(true);
    const token = await checkAuthToken();
    if (!token) {
      setToken(null);
      navigate("/signin");
      return;
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
        await logout(setToken);
        setDeleting(false);
        navigate("/signin");
      } else {
        setDeleting(false);
        navigate("/accountdeletefailed");
      }
    } catch (err) {
      console.log(err);
      navigate("/accountdeletefailed");
    }
  };

  return (
    <main>
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

          <button
            onClick={handleProceedDelete}
            className="block w-full bg-red-600 text-white py-2 rounded-md text-center hover:bg-red-700 transition"
          >
            {deleting
              ? "Deleting Your Account..."
              : "Proceed to Delete Account"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="block w-full bg-gray-300 text-gray-800 py-2 rounded-md text-center hover:bg-gray-400 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
