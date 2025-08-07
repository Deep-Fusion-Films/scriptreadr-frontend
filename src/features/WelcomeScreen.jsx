import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

export default function WelcomeScreen({ showWelcome, setShowWelcome, isFormating }) {

  useEffect(() => {
    const hasSeenWelcome = Cookies.get("has_seen_welcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
    if (isFormating) {
      setShowWelcome(false)
    }
  }, []);

  const handleHideWelcome = () => {
    // Set cookie for 1 year
    Cookies.set("has_seen_welcome", "true", { expires: 365 });
    setShowWelcome(false);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false)
  }

  return (
    <>
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className=" fadeIn relative bg-white p-6 rounded-3xl shadow-lg text-center w-150 border-3 border-[#2E3A87]">
            {/* Cancel Icon Button */}
            <button
              onClick={handleCloseWelcome}
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Cancel"
            >
              <FiX />
            </button>

            {/* ⭐⭐⭐ */}
            <div className="flex justify-center mb-2">
              <span className="text-[#2E3A87] text-xl">⭐️ ⭐️ ⭐️</span>
            </div>

            <p className="mb-4 text-lg font-semibold text-[#2E3A87]">
              Welcome to ScriptReadr
            </p>
            <p className="mb-4">
              In order to use this service you will need an active{" "}
              <Link to="/pricing">
                <span className="text-[#2E3A87]">subscription</span>
              </Link>
            </p>
            <p className="mb-4">
              Also, for ease of use, we advice that you go through the quick{" "}
              <Link to="/">
                <span className="text-[#2E3A87]">tutorial</span>
              </Link>{" "}
              on how to use ScriptReadr
            </p>
            <p>If you don't want to see this welcome screen again click: <button onClick={handleHideWelcome} className="text-[#2E3A87] hover:cursor-pointer">Don't Show again</button></p>
          </div>
        </div>
      )}
    </>
  );
}
