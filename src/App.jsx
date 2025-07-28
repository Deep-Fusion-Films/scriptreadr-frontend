import { RouterProvider } from "react-router-dom";
import Router from "./routes/Routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  const clientId =
    "135799665008-nqh5inpkv6u736uapau9p236h06nh2rm.apps.googleusercontent.com";

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
          <RouterProvider router={Router} />
      </GoogleOAuthProvider>
    </>
  );
}
