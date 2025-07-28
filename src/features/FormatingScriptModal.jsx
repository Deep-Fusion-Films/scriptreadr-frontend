import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({
  progress,
  isFormating,
  abortController,
  setIsFormating,
}) {

  const [cancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

const cancelCeleryTask = async () => {
  setIsCancelling(true);
  setError("");

  const id = localStorage.getItem("task_id");

  if (!id) {
    abortController.abort()
    setIsFormating(false)
    localStorage.removeItem("task_id");
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
  localStorage.removeItem("task_id")
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
      {isFormating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className="relative bg-white p-6 rounded shadow-lg text-center w-80">
            {/* Cancel Icon Button */}
            <button
              onClick={cancelCeleryTask}
              disabled={cancelling}
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Cancel"
            >
              {cancelling ? "cancelling..." :  <FiX /> }
             
            </button>

            <p className="mb-4 text-lg font-semibold">
              Formating Script, please wait...
            </p>
            <p className="text-md text-gray-700 mt-1 text-center">
              {progress}%
            </p>
            <div className="h-12 w-12 mx-auto mb-2 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </>
  );
}
