// src/store/SubscriptionContext.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { checkAuthToken } from "../util";
import { useToken } from "./AuthContext"; // your current context
import { useNavigate } from "react-router-dom";

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const { setToken } = useToken();

  const fetchSubscription = useCallback(async () => {
    setIsFetching(true);
    const token = await checkAuthToken();

    if (!token) {
      setToken(null);
      setIsFetching(false);
      return;
    }

    setToken(token);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/subscription/current_subscription/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentSubscription(data);
      } else {
        setFetchError(data.detail);
      }
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsFetching(false);
    }
  }, [setToken]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        currentSubscription,
        isFetching,
        fetchError,
        refetch: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
