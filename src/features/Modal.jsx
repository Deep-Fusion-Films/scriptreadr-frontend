import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ 
  progress,
  setProgress,
  isLoading, 
  abortController,
  setIsLoading,
  setError,
  setShowErrorModal,
  setHide
 }) {
  const [cancelling, setIsCancelling] = useState("");

  const cancelCeleryTask = async () => {
    setIsCancelling(true);

    const id = localStorage.getItem("audio_id");

    if (!id) {
      if (abortController) {
        abortController.abort();
      }
      setError(
        "You cancelled generating audio, please note that if audio generation already started, you audio quota might be deducted."
      );
      setIsLoading(false);
      setShowErrorModal(true);
      localStorage.removeItem("audio_id");
      console.log("NO id found");
      setIsCancelling(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/audio/cancel_audio_task/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task_id: id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail || "Could not cancel generating audio, please try again"
        );
        setHide(false);
        setShowErrorModal(true);
        console.error("Error concelling task:", data.detail);
        return;
      }

      abortController.abort();
      localStorage.removeItem("audio_id");
      setError(
        "You cancelled your audio generation, please note that if audio generation already started your audio quota might be deducted."
      );
      setProgress(0)
      setIsLoading(false);
      setShowErrorModal(true);

      console.log(data.detail);
    } catch (err) {
      setError("Could not cancel audio generation, please try again");
      setHide(false);
      setShowErrorModal(true);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className="relative bg-white p-6 border rounded-3xl border-3 border-[#2E3A87] shadow-lg text-center w-80">
            {/* Cancel Icon Button */}
            <button
              onClick={cancelCeleryTask}
              disabled={cancelling}
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Cancel"
            >
              {cancelling ? (
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <FiX className="text-[#2E3A87]" />
              )}
            </button>

            <p className="mb-4 text-md font-semibold">
              Generating audio, please wait...
            </p>
            <p className="text-md text-gray-700 mt-1 text-center">
              {progress}%
            </p>

            <div className="w-full mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
