import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useToken } from "../store/AuthContext";
import ModalPopUp from "../components/ModalPopUp";
import GoogleLogin from "./GoogleLogin";
import ResponseMessage from "../components/ResponseMessage";

export default function Sign() {
const navigate = useNavigate()
const {setToken} = useToken();
const [response, setResponse] = useState("")
const [isLoading, setIsloading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  //handle form change
 const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
 }

 //handle submit form
 const handleSubmit = async (e) => {
  e.preventDefault()

  setIsloading(true)

  const payLoad = {
    email: formData.email,
    password: formData.password
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_LOCAL}/user/login/`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify(payLoad),
      credentials: "include"
    })

    const data = await response.json()

    if(!response.ok) {
      setResponse(data.detail || "Login failed")
      return
    }
    //store the access token in localstorage
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("isAuthenticated", "true")
      setToken(data.token)
      navigate("/dashboard")
      
  } catch(error) {
    setResponse("An error occured please try again later")
  } finally {
    setIsloading(false)
  }
 }
 
  return (
    <div className="min-h-screen flex items-center justify-center px-4 mb-20">
      <ModalPopUp isLoading={isLoading} text={"Signing you in please wait..."} />
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#2E3A87]">
          Sign in
        </h2>
        <ResponseMessage response={response} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className=" text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <Link
              to="/forgotpassword"
              className="absolute right-0 text-sm text-[#2E3A87] hover:underline"
            >
              Forgot Password?
            </Link>

            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E3A87]"
            />
          </div>
            <button
              type="submit"
              className="w-full bg-[#2E3A87] text-white py-2 rounded-md hover:bg-[#1e2e6f] transition duration-300 hover:cursor-pointer"
            >
              Sign In
            </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#2E3A87] hover:underline">
            Register for free
          </Link>
        </p>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">
            Or sign in with Google
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

       <GoogleLogin setResponse={setResponse} />
      </div>
    </div>
  );
}
