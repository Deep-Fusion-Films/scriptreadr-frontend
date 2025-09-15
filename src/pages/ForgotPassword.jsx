import { useState } from "react";
import { Link } from "react-router-dom";

import ModalPopUp from "../components/ModalPopUp";
import ResponseMessage from "../components/ResponseMessage";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: [e.target.value],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const payload = {
      email: formData.email,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/user/forgot/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("error", data);
        setResponse(data.detail || "failed to send email try again later");
        throw new Error(data);
      }
      //set success message
      setResponse(data.message);
    } catch (err) {
      console.log("data", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-40 mb-20">
        <ModalPopUp isLoading={isLoading} text={"Sending email..."} />
        <h2 className="text-2xl font-bold text-center text-[#2E3A87]">
          Reset Your Speaker Password
        </h2>

        <p className="text-sm text-center text-gray-600 mt-2">
          We’ll send you an email to reset your password
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email input */}
          <div>
            {/* Error message */}
            <ResponseMessage response={response} />
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              onChange={handleChange}
              value={formData.email}
              type="email"
              id="email"
              name="email"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
            />
          </div>

          {/* Continue button */}
          <button
            type="submit"
            className="w-full bg-[#2E3A87] text-white py-2 rounded-md hover:bg-[#1f2d6f] transition"
          >
            Continue
          </button>

          {/* Back to sign in */}
          <Link
            to="/signin"
            className="block text-center mt-2 text-sm text-[#2E3A87] hover:underline cursor-pointer"
          >
            Back to Sign In
          </Link>
        </form>
      </div>
    </main>
  );
}
