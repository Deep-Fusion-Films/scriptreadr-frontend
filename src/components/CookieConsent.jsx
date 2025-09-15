import { main } from "framer-motion/client";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (value) => {
    localStorage.setItem("cookie_consent", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="cookie-consent"
      className="fixed bottom-0 left-0 right-0 bg-indigo-100
 px-6 py-13 flex flex-col md:flex-row justify-between items-center shadow-lg z-50"
    >
      <p className="text-sm mb-2 md:mb-0">
        We use cookies to enhance your experience. Read our{" "}
        <Link to="/privacypolicies" className="underline">
          Privacy Policy
        </Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleConsent("accepted")}
          className="bg-green-900 hover:bg-green-800 text-white px-4 py-1 rounded text-sm"
        >
          Accept
        </button>
        <button
          onClick={() => handleConsent("denied")}
          className="bg-red-900 hover:bg-red-800 text-white px-4 py-1 rounded text-sm"
        >
          Deny
        </button>
      </div>
    </div>
  );
}
