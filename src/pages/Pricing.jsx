import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useToken } from "../store/AuthContext";
import { checkAuthToken } from "../util";
import { useNavigate } from "react-router-dom";
import PricePagePopUp from "../components/PricePagePopUp";
import RedirectToPaymentPopUp from "../components/RedirectToPaymentPopUp";
import RedirectToPaymentFailedPopUp from "../components/RedirectToPaymentFailedPopUp";

//icon
import { IoPricetagsOutline } from "react-icons/io5";

export default function Pricing() {
  const [isFree, setIsFree] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setToken } = useToken();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  //handle one_off subscription
  const handleOne_offSubscription = async () => {
    setIsLoadingPayment(true);

    try {
      const token = await checkAuthToken();
      if (!token) {
        setToken(null);
        setIsLoadingPayment(false);
        navigate("/signin");
        return;
      }

      setToken(token);

      const res = await fetch(
        `${import.meta.env.VITE_LOCAL}/subscription/one_off/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setIsLoadingPayment(false);
        setError(
          data.error ||
            "Sorry could'nt redirect you to one_off payment page, please try again"
        );
        return;
      }

      if (!data.sessionId) {
        setIsLoadingPayment(false);
        setError(
          "Could'nt redirect you to one_off payment page, please try again"
        );
        return;
      }

      const stripe = await stripePromise;
      setIsLoadingPayment(false);
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      setIsLoadingPayment(false);
      setError(
        "failed to redirect you to one_off payment page, please try again"
      );
      return;
    }
  };

  //handle starter subscription
  const handleStarterSubscription = async () => {
    setIsLoadingPayment(true);

    try {
      const token = await checkAuthToken();
      if (!token) {
        setIsLoadingPayment(false);
        navigate("/signin");
        return;
      }
      setToken(token);

      const res = await fetch(
        `${import.meta.env.VITE_LOCAL}/subscription/starter/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setIsLoadingPayment(false);
        setError(
          data.error ||
            "Sorry could'nt redirect you to Starter payment page, please try again"
        );
        return;
      }

      if (!data.sessionId) {
        setIsLoadingPayment(false);
        setError(
          data.error ||
            "Could'nt redirect you to Starter payment page, please try again"
        );
        return;
      }

      const stripe = await stripePromise;
      setIsLoadingPayment(false);
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      setIsLoadingPayment(false);
      setError(
        "Failed to redirect you to Starter payment page, please try again"
      );
      return;
    }
  };

  //handle pro subscription
  const handleProSubscription = async () => {
    setIsLoadingPayment(true);

    try {
      const token = await checkAuthToken();
      if (!token) {
        setIsLoadingPayment(false);
        navigate("/signin");
        return;
      }
      setToken(token);

      const res = await fetch(
        `${import.meta.env.VITE_LOCAL}/subscription/pro/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setIsLoadingPayment(false);
        setError(
          data.error ||
            "Sorry could'nt redirect you to Pro payment page, please try again"
        );
        return;
      }

      if (!data.sessionId) {
        setIsLoadingPayment(false);
        setError(
          data.error ||
            "Could'nt redirect you to Pro payment page, please try again"
        );
        return;
      }

      const stripe = await stripePromise;
      setIsLoadingPayment(false);
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      setIsLoadingPayment(false);
      setError("Failed redirect you to Pro payment page, please try again");
      return;
    }
  };

  //handle studio subscription
  const handleStudioSubscription = async () => {
    setIsLoadingPayment(true);

    try {
      const token = await checkAuthToken();
      if (!token) {
        setIsLoadingPayment(false);
        navigate("/signin");
        return;
      }
      setToken(token);

      const res = await fetch(
        `${import.meta.env.VITE_LOCAL}/subscription/studio/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setIsLoadingPayment(false);
        setError(
          data.error ||
            "Sorry could'nt redirect you to Studio payment page, please try again"
        );
        return;
      }

      if (!data.sessionId) {
        setIsLoadingPayment(false);
        setError(
          data.error ||
            "Could'nt redirect you to Studio payment page, please try again"
        );
        return;
      }

      const stripe = await stripePromise;
      setIsLoadingPayment(false);
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      setIsLoadingPayment(false);
      setError("Failed redirect you to Studio payment page, please try again");
      return;
    }
  };

  return (
    <main id="pricing">
      <section className="px-5 py-13 lg:py-20">
        {/* free subscription pop  up */}
        <PricePagePopUp
          isFree={isFree}
          setIsFree={setIsFree}
          text={"By registering you automatically are on free subscription"}
        />
        <RedirectToPaymentPopUp
          isLoadingPayment={isLoadingPayment}
          text={"Redirecting you to payment screen, please wait..."}
        />

        <RedirectToPaymentFailedPopUp error={error} setError={setError} />

        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center rounded-2xl w-50 py-1 px-3 gap-2">
            <IoPricetagsOutline className="text-2xl text-[#F59E0B]" />
            <p className="text-2xl font-bold text-[#2E3A87]">Pricing</p>
          </div>
        </div>

        <div className="text-xl lg:text-2xl pt-8 font-bold text-center text-[#2E3A87]">
          <h2>Choose Your Plan</h2>
          <p className="text-center text-sm">
            Our billing cycle is monthly but you can cancel your plan anytime
          </p>
        </div>
        {/* One-Off */}
        <div className="grid grid-cols-1 md:grid-cols-2 pt-8 gap-8 max-w-4xl mx-auto">
          <div className="border border-[#2E3A87]  rounded-xl shadow-md p-6 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#2E3A87] mb-2">
                One-off
              </h3>
              <p className="text-2xl font-bold mb-4 text-[#F59E0B] ">£29</p>
              <p className="text-sm text-gray-500 font-medium mb-2">
                What’s included:
              </p>
              <ul className="mb-6 space-y-2 text-gray-700 text-sm">
                <li>1 Single use</li>
                <li>Scripts: 140 pages max</li>
              </ul>
            </div>
            <button
              onClick={handleOne_offSubscription}
              className="mt-auto py-2 px-4 rounded transition bg-[#2E3A87] text-[#F59E0B] hover:text-white"
            >
              Pay for One-off
            </button>
          </div>

          {/* Starter subscription */}
          <div className="border border-[#2E3A87] rounded-xl shadow-md p-6 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#2E3A87] mb-2">
                Starter
              </h3>
              <p className="text-2xl font-bold mb-4 text-[#F59E0B] ">
                £99/month
              </p>
              <p className="text-sm text-gray-500 font-medium mb-2">
                What’s included:
              </p>
              <ul className="mb-6 space-y-2 text-gray-700 text-sm">
                <li>5 scripts</li>
                <li>Scripts: 140 pages max</li>
              </ul>
            </div>
            <button
              onClick={handleStarterSubscription}
              className="mt-auto py-2 px-4 rounded transition bg-[#2E3A87] text-[#F59E0B] hover:text-white"
            >
              Get Starter
            </button>
          </div>

          {/* Pro subscription */}
          <div className="border border-[#2E3A87] rounded-xl shadow-md p-6 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#2E3A87] mb-2">Pro</h3>
              <p className="text-2xl font-bold mb-4 text-[#F59E0B] ">
                £179/month
              </p>
              <p className="text-sm text-gray-500 font-medium mb-2">
                What’s included:
              </p>
              <ul className="mb-6 space-y-2 text-gray-700 text-sm">
                <li>10 scripts</li>
                <li>Scripts: 140 pages max</li>
              </ul>
            </div>
            <button
              onClick={handleProSubscription}
              className="mt-auto py-2 px-4 rounded transition bg-[#2E3A87] text-[#F59E0B] hover:text-white"
            >
              Get Pro
            </button>
          </div>

          {/* studio subscription */}
          <div className="border border-[#2E3A87] rounded-xl shadow-md p-6 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#2E3A87] mb-2">
                Studio
              </h3>
              <p className="text-2xl font-bold mb-4 text-[#F59E0B]">
                £399/month
              </p>
              <p className="text-sm text-gray-500 font-medium mb-2">
                What’s included:
              </p>
              <ul className="mb-6 space-y-2 text-gray-700 text-sm">
                <li>25 scripts</li>
                <li>Scripts: 140 pages max</li>
              </ul>
            </div>
            <button
              onClick={handleStudioSubscription}
              className="mt-auto py-2 px-4 rounded transition bg-[#2E3A87] text-[#F59E0B] hover:text-white"
            >
              Get Studio
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 hover:from-gray-400 hover:to-gray-600">
