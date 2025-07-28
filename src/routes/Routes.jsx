import { createBrowserRouter } from "react-router-dom";

import Layout from "../layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Pricing from "../pages/Pricing";
import Contact from "../pages/Contact";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import TermsOfUse from "../pages/TermsOfUse";
import Disclaimer from "../pages/Dislclaimer";
import PrivacyPolicies from "../pages/PrivacyPolicies";
import Faq from "../pages/Faq";
import UserProfile from "../features/UserProfile";
import Dashboard from "../features/Dashboard";
import ResetPassword from "../pages/ResetPassword";
import {protectedRouteLoader} from "../loaders/loader";
import SuccessPage from "../components/SuccessPage";
import FailurePage from "../components/FailurePage";
import CancelPage from "../components/CancelPage";
import CancelSubscription from "../components/CancelSubscription";
import SubscriptionCancelFailed from "../components/SubscriptionCancelFailed";
import AccountDeleteConfirm from "../pages/AccountDeleteConfirm";
import AccountDeleteFailed from "../pages/AccountDeleteFailed";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/termsofuse",
        element: <TermsOfUse />,
      },
      {
        path: "/disclaimer",
        element: <Disclaimer />,
      },
      {
        path: "/privacypolicies",
        element: <PrivacyPolicies />,
      },
      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/resetpassword/:token",
        element: <ResetPassword />,
      },
      {
        path: "/userprofile",
        element: <UserProfile />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        loader: protectedRouteLoader,
      },
      {
        path: "/success",
        element: <SuccessPage />
      },
      {
        path: "/cancel",
        element: <CancelPage />
      },
      {
        path: "/failure",
        element: <FailurePage />
      },
      {
        path: "/cancelsubscription",
        element: <CancelSubscription />
      },
      {
        path:"/subscriptioncancelfailed",
        element: <SubscriptionCancelFailed />
      },
      {
        path: "/accountdeleteconfirm",
        element: <AccountDeleteConfirm />
      },
      {
        path: "/accountdeletefailed",
        element: <AccountDeleteFailed />
      }
    ],
  },
]);

export default Router;
