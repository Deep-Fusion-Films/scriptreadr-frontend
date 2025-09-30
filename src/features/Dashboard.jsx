import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//icons
import { FiSave, FiMusic } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaArrowAltCircleRight } from "react-icons/fa";

import SideBar from "./SideBar";
import Modal from "./Modal";
import AudioPlayer from "./AudioPlayer";
import PreviewButton from "./PreviewButton";
import SpeakerListPreviewButton from "./SpeakerListPreviewButton";
import FormatingScriptModal from "./FormatingScriptModal";
import WelcomeScreen from "./WelcomeScreen";
import ErrorPopUp from "./ErrorPopUp";
import { redirect } from "react-router-dom";
import { checkAuthToken } from "../util";
import { useToken } from "../store/AuthContext";
import { useSubscription } from "../store/SubcriptionContext";
import { div } from "framer-motion/client";
import AutoAssignVoicesButton from "./AutoAssignVoicesButton";

export default function Dashboard() {
  const { setToken } = useToken();
  const { refetch } = useSubscription();

  const navigate = useNavigate();

  const [showWelcome, setShowWelcome] = useState(false);

  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);

  const [abortController, setAbortController] = useState(null);

  //check if audio file is loading
  const [isLoading, setIsLoading] = useState(false);

  //display when script is formating
  const [isFormating, setIsFormating] = useState(false);

  //get available voices
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  //state for playing, pausing and stopping the audio
  const [audioUrl, setAudioUrl] = useState(null);

  //state for showing the sidebar in small screen sizes
  const [showSideBar, setShowSideBar] = useState(false);

  const [speakers, setSpeakers] = useState([]);
  const [speakerVoices, setSpeakerVoices] = useState({});

  const [progress, setProgress] = useState(0);

  const [error, setError] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);

  //this state variable handles conditionally rendering the 'saving...' message in the save audio button
  const [saving, setSaving] = useState(false);

  //we use this state to temporarily hide the formatingScriptModal, when canceling the formating fails
  const [hide, setHide] = useState(true);

  //this state triggers the side bar previous audio section to fetch the updated audios
  const [triggerSideBarFetch, setTriggerSideBarFetch] = useState(false);

  //this state holds the name of the uploaded file
  const [displayFileName, setDisplayFileName] = useState("");

  const [audioName, setAudioName] = useState("");


  //handle upload files
  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    setIsFormating(true);

    const file = event.target.files[0];

    if (!file) {
      setIsFormating(false);
      return;
    }

    event.target.value = "";
    setFileName(file.name);

    const token = await checkAuthToken();
    if (!token) {
      setToken(null);
      navigate("/signin");
      setIsFormating(false);
      return;
    }

    setToken(token);

    // check subscription and quotas before upload
    try {
      const subscription = await fetch(
        `${import.meta.env.VITE_LOCAL}/file/subscription_status/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const status = await subscription.json();

      if (!subscription.ok) {
        setError(status.error);
        setIsFormating(false);
        setShowErrorModal(true);
        return;
      }
    } catch (err) {
      setError("Could not check your subscription status, please try again.");
      setIsFormating(false);
      setShowErrorModal(true);
      return;
    }

    //read the file or upload it
    const formData = new FormData();
    formData.append("file", file);
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/file/upload/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          signal: controller.signal,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setIsFormating(false);
        setShowErrorModal(true);
        return;
      }
      localStorage.setItem("task_id", data.task_id);
      startPolling(data.task_id);
    } catch (error) {
      if (error.name === "AbortError") {
        setError(
          "You cancelled formatting your script, please note that if formatting already started your script quota will be deducted"
        );
        setIsFormating(false);
        setShowErrorModal(true);
        return;
      }

      setError(
        "We couldn't upload your file. Please ensure you have an active subscription and try again."
      );
      setIsFormating(false);
      setShowErrorModal(true);
      return;
    } finally {
      setAbortController(null);
    }
  };

  //polling task function
  const startPolling = (taskId) => {
    const intervalId = setInterval(async () => {
      try {
        const token = await checkAuthToken();
        if (!token) {
          clearInterval(intervalId);
          navigate("/signin");
          return;
        }

        const controller = new AbortController();
        setAbortController(controller);

        const response = await fetch(
          `${import.meta.env.VITE_LOCAL}/file/task-status/${taskId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          clearInterval(intervalId);
          localStorage.removeItem("task_id");
          setError(data.error);
          setIsFormating(false);
          setShowErrorModal(true);
          return;
        }

        if (data.status === "PROGRESS" && typeof data.progress === "number") {
          setProgress(data.progress);
        }

        if (data.status === "FAILURE" || data.error) {
          clearInterval(intervalId);
          localStorage.removeItem("task_id");
          setError(
            data.error || "Error formatting Script, please try again later"
          );
          setIsFormating(false);
          setProgress(0);
          setShowErrorModal(true);
          return;
        }

        if (data.status === "success") {
          clearInterval(intervalId);
          localStorage.removeItem("task_id"); // clean up
          const res = await fetch(
            `${import.meta.env.VITE_LOCAL}/file/script/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const info = await res.json();

          if (!res.ok) {
            setError(info.error);
            setIsFormating(false);
            setProgress(0);
            setShowErrorModal(true);
            return;
          }

          console.log(info);
          setDisplayFileName(info.file_name);
          setText(info.content.script);
          setSpeakers(info.content.speakers); // update UI
          setIsFormating(false);
          setProgress(0);
          refetch();
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Upload was cancelled by user during polling");
          clearInterval(intervalId);
          localStorage.removeItem("task_id");
          setError(
            "You cancelled formatting your script, please note that if formatting already started your script quota will be deducted."
          );
          setIsFormating(false);
          setProgress(0);
          setShowErrorModal(true);
          return;
        }

        clearInterval(intervalId);
        localStorage.removeItem("task_id");
        setError("Could not format your script, please refresh or try again.");
        setIsFormating(false);
        setProgress(0);
        setShowErrorModal(true);
        return;
      }
    }, 3000); // check every 3 seconds
  };

  //fetch subscription data on mount
  useEffect(() => {
    refetch();
  }, []);

  //fetch Script on component mount
  useEffect(() => {
    const fetchScript = async () => {
      try {
        const token = await checkAuthToken();
        if (!token) {
          setToken(null);
          navigate("/signin");
          return;
        }

        setToken(token);
        const response = await fetch(
          `${import.meta.env.VITE_LOCAL}/file/script/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
        }

        setDisplayFileName(data.file_name);
        setText(data.content.script);
        setSpeakers(data.content.speakers);
      } catch (error) {
        setError("Could not fetch script");
        return;
      }
    };

    const existingTaskId = localStorage.getItem("task_id");
    if (existingTaskId) {
      setIsFormating(true);
      startPolling(existingTaskId);
    } else {
      fetchScript();
    }
  }, []);

  //get available voices on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_LOCAL}/audio/tts/`
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }
        setVoices(data);
      } catch (err) {
        setError("Could not get script audio");
        return;
      }
    };

    fetchVoices();
  }, []);

  //handle play script
  const handlePlayScript = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const token = await checkAuthToken();
    if (!token) {
      setToken(null);
      navigate("/signin");
      return;
    }

    setToken(token);

    //stop play script request
    const controller = new AbortController();
    setAbortController(controller);

    //check if there is no text
    if (!text) {
      setError("You need to upload a script to generate audio");
      setIsLoading(false);
      setShowErrorModal(true);
      return;
    }

    //check subscription and quotas before upload
    try {
      const subscription = await fetch(
        `${import.meta.env.VITE_LOCAL}/audio/subscription_audio/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const status = await subscription.json();

      if (!subscription.ok) {
        setError(status.error);
        setIsLoading(false);
        setShowErrorModal(true);
        return;
      }
    } catch (err) {
      setError("Could not check your subscription status, please try again.");
      setIsLoading(false);
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL}/audio/tts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayFileName,
          text,
          voice_id: selectedVoice,
          speaker_voices: speakerVoices,
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setIsLoading(false);
        setShowErrorModal(true);
        setAbortController(null);
        return;
      }

      localStorage.setItem("audio_id", data.task_id);
      polling(data.task_id);
    } catch (err) {
      if (err.name === "AbortError") {
        setError(
          "You cancelled generating audio, please note that if formatting already started your audio quota s will be deducted"
        );
        setIsLoading(false);
        setShowErrorModal(true);
        return;
      }

      setError(
        "We couldn't generate your audio, please ensure you have an active subscription and try again."
      );
      setIsLoading(false);
      setShowErrorModal(true);
    } finally {
      setAbortController(null);
    }
  };

  //handle audio polling logic
  const polling = (audio_id) => {
    const intervalid = setInterval(async () => {
      try {
        const token = await checkAuthToken();
        if (!token) {
          clearInterval(intervalid);
          navigate("/signin");
          return;
        }

        const controller = new AbortController();
        setAbortController(controller);

        const response = await fetch(
          `${import.meta.env.VITE_LOCAL}/audio/task-status/${audio_id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          clearInterval(intervalid);
          localStorage.removeItem("audio_id");
          setError(data.error);
          setIsLoading(false);
          setShowErrorModal(true);
          return;
        }

        if (data.status === "PROGRESS" && typeof data.progress === "number") {
          setProgress(data.progress);
        }

        if (data.status === "FAILURE" || data.error) {
          localStorage.removeItem("audio_id");
          clearInterval(intervalid);

          setError(data.error || "audio generation failed, please try again");
          setIsLoading(false);
          setProgress(0);
          setShowErrorModal(true);
          return;
        }

        if (data.status === "success") {
          clearInterval(intervalid);
          localStorage.removeItem("audio_id");

          const res = await fetch(
            `${import.meta.env.VITE_LOCAL}/audio/processed_audio/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const info = await res.json();
          if (!res.ok) {
            setError(info.error || "audio generation failed, please try again");
            setIsLoading(false);
            setProgress(0);
            setShowErrorModal(true);
            return;
          }

          const signedUrl = info.audio_url;

          setAudioName(info.audio_name);
          setAudioUrl(signedUrl);
          setIsLoading(false);
          setTriggerSideBarFetch(!triggerSideBarFetch);
          setProgress(0);
          refetch();
        }
      } catch (error) {
        if (error.name === "AbortError") {
          clearInterval(intervalid);
          localStorage.removeItem("audio_id");
          setError(
            "You cancelled generating your script audio, please note that if generating the audio already started your audio quota will be deducted."
          );
          setIsLoading(false);
          setProgress(0);
          setShowErrorModal(true);
          return;
        }

        clearInterval(intervalid);
        localStorage.removeItem("audio_id");
        setError(
          "An unexpected error occured while generating audio, please try again."
        );
        setIsLoading(false);
        setProgress(0);
        setShowErrorModal(true);
        return;
      }
    }, 3000);
  };

  //fetch processed audio on mount or continue polling
  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const token = await checkAuthToken();
        if (!token) {
          setToken(null);
          navigate("/signin");
        }

        setToken(token);

        const response = await fetch(
          `${import.meta.env.VITE_LOCAL}/audio/processed_audio/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const signedUrl = data.audio_url;
        setAudioName(data.audio_name);
        setAudioUrl(signedUrl);
      } catch (error) {
        return;
      }
    };

    const existingTaskId = localStorage.getItem("audio_id");
    if (existingTaskId) {
      setIsLoading(true); // show loading UI
      polling(existingTaskId);
    } else {
      fetchAudio();
    }
  }, []);

  //handle savescript as file and audio
  const handleSaveScript = async (type) => {
    setOpen(false);

    if (type === "file") {
    } else if (type === "audio") {
      if (audioUrl) {
        setSaving(true);

        try {
          // Fetch the audio data as a Blob
          const response = await fetch(audioUrl);
          if (!response.ok) {
            setSaving(false);
            throw new Error("Failed to fetch audio file.");
          }

          const blob = await response.blob();
          // Create downloadable URL from Blob
          const url = URL.createObjectURL(blob);

          // Create anchor element for download
          const a = document.createElement("a");
          a.href = url;
          a.download = "script.mp3";
          document.body.appendChild(a);

          // Programmatically trigger download
          a.click();

          // Clean up
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading audio:", error);
          setSaving(false);
          console.log(error.message);
          alert("An error occurred while downloading the audio.");
        } finally {
          setSaving(false);
        }
      } else {
        setError("No audio available to download yet.");
        setShowErrorModal(true);
      }
    }
  };

  //handle setShowSideBar
  const handleSetShowSideBar = () => {
    setShowSideBar(true);
  };

  return (
    <>
      <main>
        <div className="flex flex-col">
          <ErrorPopUp
            error={error}
            setShowErrorModal={setShowErrorModal}
            showErrorModal={showErrorModal}
            setHide={setHide}
          />

          <WelcomeScreen
            showWelcome={showWelcome}
            setShowWelcome={setShowWelcome}
            isFormating={isFormating}
            isLoading={isLoading}
          />

          <div className="flex flex-1">
            <SideBar
              showSideBar={showSideBar}
              setShowSideBar={setShowSideBar}
              error={error} 
              setError={setError}
              showErrorModal={showErrorModal} 
              setShowErrorModal={setShowErrorModal}
              setAudioUrl={setAudioUrl}
              audioUrl={audioUrl}
              triggerSideBarFetch={triggerSideBarFetch}
              setAudioName={setAudioName}
              setHide={setHide}
            />

            {/* Main Content Area */}

            {/*Modal which contains the cancel button  */}
            {hide && (
              <Modal
                progress={progress}
                setProgress={setProgress}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                abortController={abortController}
                setError={setError}
                setShowErrorModal={setShowErrorModal}
                setHide={setHide}
              />
            )}

            {hide && (
              <FormatingScriptModal
                progress={progress}
                setProgress={setProgress}
                isFormating={isFormating}
                setIsFormating={setIsFormating}
                abortController={abortController}
                setError={setError}
                setShowErrorModal={setShowErrorModal}
                setHide={setHide}
              />
            )}

            <div className="flex-1 p-6 bg-white">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div
                  placeholder="Type or paste your script here..."
                  className=" relative flex items-center justify-center shadow-sm lg:w-2/3 h-[75vh]  border border-gray-300 p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <div
                    onClick={handleSetShowSideBar}
                    className="hover:cursor-pointer"
                  >
                    <FaArrowAltCircleRight className="absolute left-4 top-5 text-2xl text-[#5C6BC0] lg:hidden" />
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2">
                    {/* handle fil change, it's not shown */}
                    <input
                      type="file"
                      accept=".txt,.pdf,.docx" // adjust based on what you want to allow
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {/* upload icon */}
                    <FaFileCirclePlus className="text-8xl text-[#5C6BC0]" />
                    <p>upload your scripts, txt, doc, pdf.</p>
                    <p>Max file Size is 2MB</p>

                    {fileName && <p>{fileName}</p>}

                    <button
                      onClick={handleClick}
                      className="flex items-center justify-center gap-2 py-1 px-3  bg-[#5C6BC0] text-white rounded-lg shadow-sm hover:bg-[#3F4C9A] transition"
                    >
                      <FiUpload />
                      Load Script
                    </button>
                  </div>
                </div>

                <div className="relative shadow-sm border border-gray-300 rounded-lg">
                  <div className="flex justify-between bg-[#2E3A87] text-white p-4 rounded-lg">
                    <p>Audio:</p>
                    <p>{audioName.substring(0, audioName.lastIndexOf("."))}</p>
                  </div>

                  <div className="flex rounded-lg gap-4 p-4 align-center">
                    <AudioPlayer audioUrl={audioUrl} />

                    <button
                      onClick={() => handleSaveScript("audio")}
                      className="whitespace-nowrap inline-flex items-center rounded-lg shadow-sm gap-2 py-1 px-3 bg-[#5C6BC0] text-white rounded hover:bg-[#3F4C9A] transition"
                    >
                      <FiSave />
                      {saving ? "Saving..." : "Save audio"}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="flex justify-between bg-[#2E3A87] rounded-lg text-white p-4">
                      <p>Speaker List:</p>
                      <p>
                        {displayFileName?.substring(
                          0,
                          displayFileName.lastIndexOf(".")
                        )}
                      </p>
                    </div>

                    <div className=" space-y-4 p-4 max-h-75 overflow-y-auto">
                      {!text && (
                        <div>
                          <p className="text-black lg:absolute lg:top-4/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 text-center">
                            Speakers and voice selection will appear here once
                            you upload a file
                          </p>
                        </div>
                      )}

                      {/* auto assing speaker voicess */}
                      {text && (
                        <AutoAssignVoicesButton
                          setSpeakerVoices={setSpeakerVoices}
                          voices={voices}
                          speakers={speakers}
                        />
                      )}

                      {speakers?.map((speaker) => (
                        <div key={speaker} className="flex items-end space-x-4">
                          <div className="flex flex-col">
                            <p className="font-semibold mb-1">{speaker}</p>

                            <select
                              className="w-full max-w-xs py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                              value={speakerVoices[speaker] || ""}
                              onChange={(e) =>
                                setSpeakerVoices((prev) => ({
                                  ...prev,
                                  [speaker]: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select Voice</option>
                              {voices.map((voice) => (
                                <option key={voice.id} value={voice.id}>
                                  {voice.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <SpeakerListPreviewButton
                            speaker={speaker}
                            speakerVoices={speakerVoices}
                            setError={setError}
                            setShowErrorModal={setShowErrorModal}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex lg:absolute rounded-lg bottom-0 left-0 border p-2   bg-[#2E3A87] text-white w-full">
                    <button
                      onClick={handlePlayScript}
                      className="flex rounded-lg cursor-pointer border border-[#5C6BC0] items-center gap-2 py-1 px-4 py-2 bg-[#5C6BC0] text-white rounded hover:bg-[#3F4C9A] transition"
                    >
                      Generate Audio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
