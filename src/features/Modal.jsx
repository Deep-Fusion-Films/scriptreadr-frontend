import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ progress, isLoading, abortController }) {
const [cancelling, setIsCancelling] = useState("");
const [error, setError] = useState("");



const cancelCeleryTask = async () => {
  setIsCancelling(true);
  setError("");

  const id = localStorage.getItem("audio_id");

  if (!id) {
    abortController.abort()
    setIsFormating(false)
    localStorage.removeItem("audio_id");
    setIsCancelling(false);
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_LOCAL}/fileupload/cancel_task/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({task_id: id})
  });

  const data = await response.json()

  if (!response.ok) {
    setError(data.detail)
    console.error("Error concelling task:", data.detail);
  }

  abortController.abort()
  localStorage.removeItem("audio_id")
  setIsFormating(false);

  } catch (err) {
    console.error("Error cancelling task:", err.message);
    setError(err.message)
    abortController.abort();
    setIsFormating(false);
  } finally {
    setIsCancelling(false)
  }
  
}


  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className="relative bg-white p-6 rounded shadow-lg text-center w-80">
            {/* Cancel Icon Button */}
            <button
              onClick={() => {
                if (abortController) {
                  abortController.abort(); // abort the request
                }
              }}
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Cancel"
            >
              <FiX />
            </button>
            <p className="text-md text-gray-700 mt-1 text-center">
              {progress}%
            </p>
            <p className="mb-4 text-lg font-semibold">
              Generating audio, please wait...
            </p>
            <div className="h-12 w-12 mx-auto mb-2 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </>
  );
}
