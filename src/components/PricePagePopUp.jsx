import { FiX } from "react-icons/fi";

export default function PricePagePopUp({ isFree, setIsFree, text }) {
  const handleCloseFreeSubscription = () => {
    setIsFree(false);
  };

  return (
    <>
      {isFree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className="relative bg-white p-6 rounded shadow-lg text-center w-80">
            {/* Cancel Icon Button */}
            <button
              onClick={handleCloseFreeSubscription}
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Cancel"
            >
              <FiX />
            </button>

            <p className="mb-4 text-lg font-semibold">{text}</p>
          </div>
        </div>
      )}
    </>
  );
}
