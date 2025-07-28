// import { useState, useEffect, useCallback } from "react";
// import { checkAuthToken } from "../util";
// import { useToken } from "../store/AuthContext";



// export default function useSubscription() {

// const [currentSubscription, setCurrentSubscription] = useState("");
// const [fetchError, setFetchError] = useState("");
// const [isFetching, setIsFetching] = useState(false); 

// const [updateCount, setUpdateCount] = useState(0);
// const { setToken } = useToken();

// const refetch = () => setUpdateCount((prev) => prev + 1)

// useEffect(() => {
//   const fetchSubscription = async () => {
//     setIsFetching(true);
//     const token = await checkAuthToken();

//     if (!token) {
//       setToken(null);
//       return
//     }

//     setToken(token);
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_LOCAL}/subscription/current_subscription/`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         console.log(data);
//         setCurrentSubscription(data);
//       } else {
//         setFetchError(data.detail);
//         console.log(data.detail);
//       }
//     } catch (err) {
//       setFetchError(err.message);
//     } finally {
//       setIsFetching(false);
//     }
//   };
//   fetchSubscription();
// }, [updateCount, setToken]);

// return { currentSubscription, isFetching, fetchError, refetch}
// }

