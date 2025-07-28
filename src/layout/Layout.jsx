import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { TokenProvider } from "../store/AuthContext";
import { SubscriptionProvider } from "../store/SubcriptionContext";
import CookieConsent from "../components/CookieConsent";

export default function Layout() {
  return (
      <>
      <TokenProvider>
      <SubscriptionProvider>
      <Header />
      <Outlet />
      <Footer />
      <CookieConsent />
      </SubscriptionProvider>
      </TokenProvider>
    </>
  );
}
