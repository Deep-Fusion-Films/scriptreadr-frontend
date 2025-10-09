import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({
  progress,
  setProgress,
  isFormating,
  abortController,
  setIsFormating,
  setError,
  setShowErrorModal,
  setHide,
}) {
  const [cancelling, setIsCancelling] = useState(false);

  const cancelCeleryTask = async () => {
    setIsCancelling(true);

    const id = localStorage.getItem("task_id");

    if (!id) {
      if (abortController) {
        abortController.abort();
      }
      setError("You cancelled formatting your script, please note that if formatting already started your script quota will be deducted");
      setIsFormating(false);
      setShowErrorModal(true);
      localStorage.removeItem("task_id");
      setIsCancelling(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/file/cancel_task/`,
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
        setError("Could not cancel task, please try again.");
        setHide(false);
        setShowErrorModal(true);
        return;
      }

      abortController.abort();
      localStorage.removeItem("task_id");
      setError("You cancelled formatting your script, please note that if formatting already started your script quota will be deducted");
      setProgress(0)
      setIsFormating(false);
      setShowErrorModal(true);

    } catch (err) {
      setError("Your task could not be cancelled right now, please try again later.");
      setHide(false);
      setShowErrorModal(true);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      {isFormating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className="relative border rounded-3xl border-3 border-[#2E3A87] bg-white p-6 rounded shadow-lg text-center w-80">
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
              {/* {error ? { error } : "Formating Script, please wait..."} */}
              Formating Script, please wait...
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
