import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ErrorPopUp({ error, showErrorModal, setShowErrorModal, setHide }) {

  const handleCloseErrorPopUp = () => {
    setShowErrorModal(false)
    setHide(true)
  };

  return (
    <>
      {showErrorModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 rounded-md">
          <div className=" fadeIn relative bg-white p-6 rounded-3xl shadow-lg text-center w-150 border-3 border-[#2E3A87]">
            {/* Cancel Icon Button */}
            <button
              onClick={handleCloseErrorPopUp}
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Cancel"
            >
              <FiX />
            </button>

            <p className="mb-4 text-lg font-semibold text-[#2E3A87]">
             {error}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
