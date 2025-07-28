import { useNavigate } from "react-router-dom";
import { useToken } from "../store/AuthContext";

import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";

export default function GoogleLogin({setResponse}) {

const navigate = useNavigate()
const {setToken} = useToken();

const login = useGoogleLogin({
  onSuccess: async (codeResponse) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL}/user/googlesignin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeResponse.code }),
        credentials: "include",
      });

        const data = await response.json()
      if (!response.ok) {
        setResponse(data.detail)
        return;
      }

      localStorage.setItem("access_token", data.token);
      localStorage.setItem("isAuthenticated", "true")
      setToken(data.token)
      navigate("/dashboard");
    } catch (err) {
      setResponse("An unexpected error occurred. Please try again.");
    }
  },
  onError: (error) => console.error("login failed:", error),
  flow: "auth-code",
});

  return (
    <>
      <button
        onClick={async () => login()}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition hover:cursor-pointer"
      >
        <FaGoogle className="text-red-500" />
        <span className="text-sm font-medium text-gray-700">
          Sign in with Google
        </span>
      </button>
    </>
  );
}
