import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ModalPopUp from "../components/ModalPopUp";
import GoogleRegister from "./GoogleRegister";
import ResponseMessage from "../components/ResponseMessage";

export default function Signup() {
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/user/register/`,
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
        setResponse(data.detail);
        return;
      }
      //redirect to sign in page
      navigate("/signin");
    } catch (error) {
      setResponse("An error occured, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-20 mb-20">
        {/* Modal popup  */}
        <ModalPopUp
          isLoading={isLoading}
          text={"Signing you up please wait..."}
        />
        <h2 className="text-2xl font-bold text-center text-[#2E3A87]">
          Create Your Account
        </h2>
        <p className="text-center text-sm text-gray-600 mt-1">
          Register with your email
        </p>
        {/* Error message */}
        <ResponseMessage response={response} />
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="userFirstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="userFirstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
              />
            </div>
            <div>
              <label
                htmlFor="userLastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="userLastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="userEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="userEmail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="userPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="userPassword"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="userConfirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="userConfirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
            />
          </div>

          {/* Terms */}
          <p className="text-sm text-gray-600">
            By creating an account, you agree to our{" "}
            <Link
              to="/termsofuse"
              className="text-[#2E3A87] underline cursor-pointer"
            >
              Terms and Conditions
            </Link>
          </p>

          {/* Register button */}
          <button aria-label="register-button" className="block text-center w-full bg-[#2E3A87] text-white py-2 rounded-md hover:bg-[#1f2d6f] transition">
            Register
          </button>

          {/* Sign in link */}
          <p className="text-sm text-center mt-2 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-[#2E3A87] underline cursor-pointer"
            >
              Sign in
            </Link>
          </p>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">or register with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google button */}
          <GoogleRegister setResponse={setResponse} />
        </form>
      </div>
    </main>
  );
}
