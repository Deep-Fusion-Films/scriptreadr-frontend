import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { checkAuthToken } from "../util";

const TokenContext = createContext(null);

//create the context provider
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchToken = async () => {
      const newToken = await checkAuthToken();

      if (!newToken) {
        setToken(null);
      } else {
        setToken(newToken);
      }
    };

    fetchToken();
  
  }, [navigate]);

  return (
    <TokenContext.Provider value={{ token, setToken}}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
