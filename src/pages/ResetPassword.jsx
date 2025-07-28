import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import ModalPopUp from "../components/ModalPopUp";
import ResponseMessage from "../components/ResponseMessage";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const {token} = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const payload = {
      new_password: formData.newPassword,
      confirm_password: formData.confirmPassword,
      token: token
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL}/user/reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-40 mb-20">
      <ModalPopUp isLoading={isLoading} text={"Reseting password..."} />
      <h2 className="text-2xl font-bold text-center text-[#2E3A87]">
        Reset Your Speaker Password
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email input */}
        <div>
          {/* Error message */}
          <ResponseMessage response={response} />
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            onChange={handleChange}
            value={formData.newPassword}
            type="password"
            id="password"
            name="newPassword"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            onChange={handleChange}
            value={formData.confirmPassword}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
          />
        </div>

        {/* Continue button */}
        <button
          type="submit"
          className="w-full bg-[#2E3A87] text-white py-2 rounded-md hover:bg-[#1f2d6f] transition"
        >
          Reset Password
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
  );
}
