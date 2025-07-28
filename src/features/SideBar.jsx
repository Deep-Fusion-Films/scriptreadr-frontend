import { Link } from "react-router-dom";
import { useSubscription } from "../store/SubcriptionContext";

export default function SideBar() {
  const { currentSubscription, isFetching, fetchError } = useSubscription();

  return (
    <>
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-gray-100 border-gray-300 shadow-sm border-r p-4 flex flex-col justify-between">
        <div>
          <nav className="space-y-4 text-gray-800 font-medium">
            <Link to="/userprofile" className="block hover:text-teal-600">
              Account
            </Link>
            <Link className="block hover:text-teal-600">Subscription</Link>
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
            className="block text-gray-700 hover:text-teal-600"
          >
            Support
          </Link>
          <button className="text-red-600 hover:underline">Sign Out</button>
        </div>
      </aside>
    </>
  );
}
