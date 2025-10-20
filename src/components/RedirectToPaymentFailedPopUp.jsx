import { FiX } from "react-icons/fi";

export default function RedirectToPaymentFailedPopUp({ error, setError }) {
  const handleClosePopUp = () => {
    setError("");
  };

  return (
    <>
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className="bg-white p-5 rounded shadow-lg text-center rounded-2xl w-80">
            <div className="flex justify-end">
              <FiX
                onClick={handleClosePopUp}
                className="text-[#2E3A87] mb-1 text-2xl text-red-800 border hover:cursor-pointer "
              />
            </div>

            <p className="mb-4 text-md font-semibold">{error}</p>
          </div>
        </div>
      )}
    </>
  );
}
