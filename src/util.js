import { jwtDecode } from "jwt-decode";

export async function checkAuthToken() {
    const accessToken = localStorage.getItem('access_token');


    
    //jwt decode function
    const isTokenValid = (token) => {
        try {
            const decode = jwtDecode(token);
            const now = Date.now() / 1000;
            return decode.exp > now;
        } catch(err) {
            return false;
        }
    };

    //check if access token in local storage and not expired
    if(accessToken && isTokenValid(accessToken)) {
        console.log("THis is the existing access token:", accessToken)
        return accessToken;
    }

    // no access token, then refresh accesstoken
    try {
        const res = await fetch(`${import.meta.env.VITE_LOCAL}/user/refresh/`,{
            method:"POST",
            credentials: "include"
        });


        const data = await res.json();
        if (!res.ok) {
            console.log("This is the failed refresh token attemp:", data)
            localStorage.removeItem("access_token")
            throw new Error(data.detail || "Failed to refresh token")
        }
        const newAccessToken = data.token
        console.log("this is the new accesstoken", newAccessToken)
        localStorage.setItem("access_token", newAccessToken);
        return newAccessToken
    } catch(err) {;
        console.log("fetching token error:", err)
    }
    return null

}



export async function logout(setToken) {
    //Remove access token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('isAuthenticated')
  
    //Call the backend to clear refresh cookie
    try {
      await fetch(`${import.meta.env.VITE_LOCAL}/user/logout/`, {
        method: "POST", // or GET, depending on how you define it
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
  
    // 3. Clear the token context
    setToken(null);
  }
  

  