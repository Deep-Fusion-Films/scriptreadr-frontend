import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleRegister({setResponse}) {

const navigate = useNavigate()

const login = useGoogleLogin({
  onSuccess: async (codeResponse) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL}/user/googleregister/`, {
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
      navigate("/signin");
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
        onClick={login}
        type="button"
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-gray-100 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google icon"
          className="w-5 h-5"
        />
        <span className="text-sm text-gray-700 font-medium">
          Register with Google
        </span>
      </button>
    </>
  );
}
