import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSubscription } from "../store/SubcriptionContext";
import { motion, AnimatePresence } from "framer-motion";
import { TfiNewWindow } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { checkAuthToken } from "../util";
import { useToken } from "../store/AuthContext";
import ConfirmSideBarDeletePopUp from "../components/sideBar/ConfirmSideBarDeletePopUp";
import ErrorPopUp from "./ErrorPopUp";


export default function SideBar({
  showSideBar,
  setShowSideBar,
  setError,
  setShowErrorModal,
  setAudioUrl,
  triggerSideBarFetch,
  setAudioName,
}) {
  const { currentSubscription, isFetching, fetchError } = useSubscription();
  const [audioFiles, setAudioFiles] = useState([]);
  const [sideBarErrorMessage, setSideBarErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteAudio, setDeleteAudio] = useState(false);

  const [showSideBarPopUp, setShowSideBarPopUp] = useState(false);
  const [url, setUrl] = useState("");

  const { setToken } = useToken();
  const navigate = useNavigate();

  //handle get all audios
  useEffect(() => {
    const fetchAudios = async () => {
      setIsLoading(true);
      
      setSideBarErrorMessage("")

      const token = await checkAuthToken();
      if (!token) {
        setToken(null);
        navigate("/signin");
        setIsLoading(false);
        return;
      }

      setToken(token);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_LOCAL}/audio/user_audios/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const audio = await response.json();

        if (!response.ok) {
          setIsLoading(false);
          setSideBarErrorMessage(audio.error || "No audio Files");
          return;
        }
        setIsLoading(false)
        setAudioFiles(audio.data);
      } catch (err) {
        setIsLoading(false);
        setSideBarErrorMessage("Could not fetch previous audios.");
        return;
      }
    };
    fetchAudios();
  }, [triggerSideBarFetch, deleteAudio]);

  const handlePlaySelectedAudio = async (url) => {
    const token = await checkAuthToken();
    if (!token) {
      setToken(null);
      navigate("/signin");
      return;
    }

    setToken(token);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/audio/single_audio/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_name: url }),
        }
      );

      const audio = await response.json();

      if (!response.ok) {
        setError(audio.error || "Could not load audio, please try again!");
        setShowErrorModal(true)
        return;
      }

      setAudioUrl(audio.audio_url);
      setAudioName(audio.audio_name);

    } catch (err) {
      setError("Could not load audio, please try again!")
      setShowErrorModal(true)
      return;
    }
  };

  const sideBarContent = (
    <>
      <div className="overflow-y-auto overflow-x-hidden h-134">
        {showSideBarPopUp && (
          <ConfirmSideBarDeletePopUp
            url={url}
            setUrl={setUrl}
            setShowSideBarPopUp={setShowSideBarPopUp}
            setIsLoading={setIsLoading}
            deleteAudio={deleteAudio}
            setDeleteAudio={setDeleteAudio}
            setError={setError}
            setShowErrorModal={setShowErrorModal}
          />
        )}

        <ErrorPopUp />

        <nav className="text-gray-800 font-medium">
          <Link
            to="/userprofile"
            className="block hover:text-[#2E3A87] text-[#5C6BC0]"
          >
            <div className="flex items-center gap-2">
              <p>Account</p> <TfiNewWindow />
            </div>
          </Link>

          {/*subscription  */}
          <p className="block my-4 text-[#5C6BC0]">Subscription:</p>
          <div className="text-sm text-gray-600 ml-2">
            <p>Current Plan:</p>
            <div className="border rounded-lg py-1 text-center text-white bg-[#5C6BC0]">
              <p>
                {isFetching
                  ? "Fetching plan..."
                  : currentSubscription
                  ? `${currentSubscription.current_plan}`
                  : fetchError || "No subscription found."}
              </p>
            </div>
          </div>

          {currentSubscription &&
            currentSubscription.current_plan !== "Not Subscribed" && (
              <>
                {currentSubscription.current_plan == "one_off" ? (
                  ""
                ) : (
                  <div className="text-sm text-gray-600 ml-2">
                    <p>Expires at:</p>
                    <div className="border-b-2 rounded-lg py-1 text-center text-black">
                      <p>
                        {isFetching
                          ? "..."
                          : currentSubscription
                          ? `${new Date(
                              currentSubscription.current_period_end
                            ).toLocaleDateString()}`
                          : fetchError || "No remaining scripts."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600 ml-2">
                  <p>Scripts Remaining:</p>
                  <div className="border-b-2 rounded-lg py-1 text-center text-black">
                    <p>
                      {isFetching
                        ? "..."
                        : currentSubscription
                        ? `${currentSubscription.scripts_remaining}`
                        : fetchError || "No remaining scripts."}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 ml-2">
                  <p>Audio Remaining:</p>
                  <div className="border-b-2 rounded-lg py-1 text-center text-black">
                    <p>
                      {isFetching
                        ? "..."
                        : currentSubscription
                        ? `${currentSubscription.audio_remaining}`
                        : fetchError || "No remaining scripts."}
                    </p>
                  </div>
                </div>
              </>
            )}

          <div>
            <p className="mt-4 text-[#5C6BC0]">Previous Script Audios:</p>
            <p className="text-sm">Audios auto-delete in 7 days</p>
            <div
              className={`transition-all duration-500 ease-in-out ${
                isLoading ? "flex justify-center items-center mt-4" : ""
              } ${
                sideBarErrorMessage ? "flex justify-center items-center mt-4" : ""
              }`}
            >
              {isLoading ? (
                <p className="text-black">Loading...</p>
              ) : sideBarErrorMessage ? (
                <p className="text-black">{sideBarErrorMessage}</p>
              ) : (
                audioFiles?.map((audio, index) => {
                  return (
                    <div className="m-4" key={index}>
                      <p>{new Date(audio.uploaded_at).toLocaleString()}</p>
                      <div className="flex gap-4">
                        <p
                          className="truncate w-40 hover:cursor-pointer hover:bg-[#5C6BC0] hover:text-white hover:shadow-3xl px-4 rounded-lg"
                          title={audio.audio_name}
                          onClick={() => handlePlaySelectedAudio(audio.url)}
                        >
                          {audio.audio_name}
                        </p>

                        {isLoading ? (
                          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <RiDeleteBin6Line
                            onClick={() => {
                              setUrl(audio.url)
                              setShowSideBarPopUp(true);
                            }}
                            className="text-xl hover:cursor-pointer hover:text-red-800"
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </nav>
      </div>

      <div className="pt-1">
        <hr className="border-gray-300" />
        <Link
          to="/contact"
          className="block hover:text-[#2E3A87] text-[#5C6BC0]"
        >
          <div className="flex items-center gap-2">
            <p> Support</p> <TfiNewWindow />
          </div>
        </Link>

        {/* <button className="text-red-600 hover:underline">Sign Out</button> */}
      </div>
    </>
  );

  return (
    <>
      {/* desktop Sidebar */}
      <aside className="hidden lg:block w-80 bg-gray-100 border-gray-300 shadow-sm border-r p-4 flex flex-col justify-between">
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
