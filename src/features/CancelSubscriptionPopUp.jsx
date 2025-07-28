import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthToken } from "../util";
import { useToken } from "../store/AuthContext";

export default function handleCancelSubscriptionPopUp({
  cancelPopUp,
  setCancelPopUP,
}) {
  const [isCancelling, setIsCancelling] = useState(false);
  const { setToken } = useToken();
  const navigate = useNavigate();

  const handleCancelSubscription = async () => {
    //do something
    setIsCancelling(true);
    const token = await checkAuthToken();
    if (!token) {
      setToken(null);
      navigate("/signin");
    }

    setToken(token);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCAL}/subscription/cancel_subscription/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setIsCancelling(false);
        setCancelPopUP(false);
        navigate("/cancelsubscription");
      } else {
        setIsCancelling(false);
        navigate("/subscriptioncancelfailed");
      }
    } catch (err) {
      setIsCancelling(false);
      navigate("/subscriptioncancelfailed");
      console.log(err);
    }
  };

  const handleCloseCancelSubscriptionPopUp = () => {
    setCancelPopUP(false);
  };

  return (
    <>
      {cancelPopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className=" fadeIn relative bg-white p-6 rounded-3xl shadow-lg text-center w-150 border-3 border-[#2E3A87]">
            <p className="mb-4 text-md font-semibold text-[#2E3A87]">
              We'd really hate see you go, are you sure you want to cancel your
              subscription?
            </p>
            <div>
              {isCancelling ? (
                <p className="border rounded-2xl text-white bg-[#2E3A87] ">
                  Cancelling Subscription...
                </p>
              ) : (
                <div className="flex gap-4 items-center justify-center">
                  <button
                    className="text-md font-semibold border px-1 cursor-pointer rounded"
                    onClick={handleCancelSubscription}
                  >
                    Yes
                  </button>
                  <button
                    className="text-md font-semibold border px-1 cursor-pointer rounded"
                    onClick={handleCloseCancelSubscriptionPopUp}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
