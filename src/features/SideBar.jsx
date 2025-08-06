import { Link } from "react-router-dom";
import { useSubscription } from "../store/SubcriptionContext";
import { motion, AnimatePresence } from "framer-motion";
import { TfiNewWindow } from "react-icons/tfi";

export default function SideBar({ showSideBar, setShowSideBar }) {
  const { currentSubscription, isFetching, fetchError } = useSubscription();

  const sideBarContent = (
    <>
      <div>
        <nav className="space-y-4 text-gray-800 font-medium">
          <Link
            to="/userprofile"
            className="block hover:text-[#2E3A87] text-[#5C6BC0]"
          >
            <div className="flex items-center gap-2">
              <p>Account</p> <TfiNewWindow />
            </div>
          </Link>
          <p className="block">Subscription:</p>
          <div className="text-sm text-gray-600 mt-2 ml-2">
            <p>Your current Plan:</p>
            <div className="border rounded-3xl m-6 py-1 text-center text-white bg-[#5C6BC0] shadow-2xl">
              <p>
                {isFetching
                  ? "Fetching plan..."
                  : currentSubscription
                  ? `${currentSubscription.current_plan}`
                  : fetchError || "No subscription found."}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600 mt-2 ml-2">
            <p>Scripts Remaining:</p>
            <div className="border rounded-3xl m-6 py-1 text-center text-white bg-[#5C6BC0] shadow-2xl">
              <p>
                {isFetching
                  ? "Fetching Remaining Scripts..."
                  : currentSubscription
                  ? `${currentSubscription.scripts_remaining}`
                  : fetchError || "No remaining scripts."}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600 mt-2 ml-2">
            <p>Audio Remaining:</p>
            <div className="border rounded-3xl m-6 py-1 text-center text-white bg-[#5C6BC0] shadow-2xl">
              <p>
                {isFetching
                  ? "Fetching Remaining audio..."
                  : currentSubscription
                  ? `${currentSubscription.audio_remaining}`
                  : fetchError || "No remaining scripts."}
              </p>
            </div>
          </div>
        </nav>
      </div>

      <div className="space-y-4">
        <hr className="border-gray-300" />
        <Link
          to="/contact"
          className="block hover:text-[#2E3A87] text-[#5C6BC0]"
        >
          <div className="flex items-center gap-2">
            <p> Support</p> <TfiNewWindow />
          </div>
        </Link>

        <button className="text-red-600 hover:underline">Sign Out</button>
      </div>
    </>
  );

  return (
    <>
      {/* desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-gray-100 border-gray-300 shadow-sm border-r p-4 flex flex-col justify-between">
        {sideBarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSideBar && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setShowSideBar(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-64 bg-gray-100 border-gray-300 shadow-md p-4 flex flex-col justify-between z-50 lg:hidden"
            >
              {sideBarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
