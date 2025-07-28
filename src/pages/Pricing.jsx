import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useToken } from "../store/AuthContext";
import { checkAuthToken } from "../util";
import { useNavigate } from "react-router-dom";
import PricePagePopUp from "../components/PricePagePopUp";
import RedirectToPaymentPopUp from "../components/RedirectToPaymentPopUp";

export default function Pricing() {
  const [isFree, setIsFree] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const navigate = useNavigate();
  const { setToken } = useToken();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);




  //handle starter subscription
  const handleOne_offSubscription = async () => {
    setIsLoadingPayment(true)

    try {
      const token = await checkAuthToken();
      if (!token) {
        setToken(null)
        navigate("/signin");
        throw new Error("No valid access token");
      }
      
      setToken(token);

      const res = await fetch(`${import.meta.env.VITE_LOCAL}/subscription/one_off/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"

        },
      });

      const data = await res.json();

      if(!res.ok) {
        throw new Error(data.error || "failed to create stripe session");
      }

      if(!data.sessionId) {
        throw new Error("No sessionId returned from backend");
      }

      const stripe = await stripePromise;
      setIsLoadingPayment(false)
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.log(err);
    }
  };



  //handle starter subscription
  const handleStarterSubscription = async () => {
    setIsLoadingPayment(true)

    try {
      const token = await checkAuthToken();
      if (!token) {
        navigate("/signin");
        throw new Error("No valid access token");
      }
      setToken(token);

      const res = await fetch(`${import.meta.env.VITE_LOCAL}/subscription/starter/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"

        },
      });

      const data = await res.json();

      if(!res.ok) {
        throw new Error(data.error || "failed to create stripe session");
      }

      if(!data.sessionId) {
        throw new Error("No sessionId returned from backend");
      }

      const stripe = await stripePromise;
      setIsLoadingPayment(false)
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.log(err);
    } 
  };


  
  //handle starter subscription
  const handleProSubscription = async () => {
    setIsLoadingPayment(true)

    try {
      const token = await checkAuthToken();
      if (!token) {
        navigate("/signin");
        throw new Error("No valid access token");
      }
      setToken(token);

      const res = await fetch(`${import.meta.env.VITE_LOCAL}/subscription/pro/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"

        },
      });

      const data = await res.json();

      if(!res.ok) {
        throw new Error(data.error || "failed to create stripe session");
      }

      if(!data.sessionId) {
        throw new Error("No sessionId returned from backend");
      }

      const stripe = await stripePromise;
      setIsLoadingPayment(false)
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.log(err);
    }
  };


  
  //handle starter subscription
  const handleStudioSubscription = async () => {
    setIsLoadingPayment(true)

    try {
      const token = await checkAuthToken();
      if (!token) {
        navigate("/signin");
        throw new Error("No valid access token");
      }
      setToken(token);

      const res = await fetch(`${import.meta.env.VITE_LOCAL}/subscription/studio/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"

        },
      });

      const data = await res.json();

      if(!res.ok) {
        throw new Error(data.error || "failed to create stripe session");
      }

      if(!data.sessionId) {
        throw new Error("No sessionId returned from backend");
      }

      const stripe = await stripePromise;
      setIsLoadingPayment(false)
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <section className="py-16 px-4 mb-20">
      {/* free subscription pop  up */}
      <PricePagePopUp isFree={isFree} setIsFree={setIsFree} text={"By registering you automatically are on free subscription"}  />
      <RedirectToPaymentPopUp isLoadingPayment={isLoadingPayment} text={"Redirecting you to payment screen, please wait..."} />
      <div className="text-3xl font-bold text-center mb-12 text-[#2E3A87]">
        <h2>Choose Your Plan</h2>
        <p className="text-center text-sm text-white mt-1">
          Our billing cycle is monthly but you can cancel your plan anytime
        </p>
      </div>
      {/* One-Off */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="border rounded-xl shadow-md p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-[#2E3A87] mb-2">One-off</h3>
            <p className="text-2xl font-bold mb-4"> £29</p>
            <p className="text-sm text-gray-500 font-medium mb-2">
              What’s included:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm">
              <li>1 Single use</li>
              <li>Scripts: 140 pages max</li>
            </ul>
          </div>
          <button onClick={handleOne_offSubscription} className="mt-auto py-2 px-4 rounded transition bg-[#2E3A87] hover:bg-gray-600 text-white">
            Pay for One-off
          </button>
        </div>

        {/* Starter subscription */}
        <div className="border rounded-xl shadow-md p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-[#2E3A87] mb-2">
              Starter
            </h3>
            <p className="text-2xl font-bold mb-4">£99/month</p>
            <p className="text-sm text-gray-500 font-medium mb-2">
              What’s included:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm">
              <li>5 scripts</li>
              <li>Scripts: 140 pages max</li>
            </ul>
          </div>
          <button onClick={handleStarterSubscription} className='className="mt-auto py-2 px-4 rounded bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 "'>
            Get Starter
          </button>
        </div>

      {/* Pro subscription */}
        <div className="border rounded-xl shadow-md p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-[#2E3A87] mb-2">
              Pro
            </h3>
            <p className="text-2xl font-bold mb-4">£179/month</p>
            <p className="text-sm text-gray-500 font-medium mb-2">
              What’s included:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm">
              <li>10 scripts</li>
              <li>Scripts: 140 pages max</li>
            </ul>
          </div>
          <button onClick={handleProSubscription} className='className="mt-auto py-2 px-4 rounded bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 "'>
            Get Pro
          </button>
        </div>

        {/* studio subscription */}
        <div className="border rounded-xl shadow-md p-6 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-[#2E3A87] mb-2">
              Studio
            </h3>
            <p className="text-2xl font-bold mb-4">£399/month</p>
            <p className="text-sm text-gray-500 font-medium mb-2">
              What’s included:
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm">
              <li>25 scripts</li>
              <li>Scripts: 140 pages max</li>
            </ul>
          </div>
          <button onClick={handleStudioSubscription} className='className="mt-auto py-2 px-4 rounded bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 "'>
            Get Studio
          </button>
        </div>
      </div>
    </section>
  );
}

// "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 hover:from-gray-400 hover:to-gray-600">
