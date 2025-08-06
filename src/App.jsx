import { RouterProvider } from "react-router-dom";
import Router from "./routes/Routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
          <RouterProvider router={Router} />
      </GoogleOAuthProvider>
    </>
  );
}
