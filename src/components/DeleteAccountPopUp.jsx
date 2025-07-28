import { useNavigate } from "react-router-dom";


export default function DeleteAccountPopUp({ deletePopUp, setDeletePopUp }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
   navigate('/accountdeleteconfirm')
  };

  const handleCloseDeletePopUp = () => {
    setDeletePopUp(false);
  };

  return (
    <>
      {deletePopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
          <div className=" fadeIn relative bg-white p-6 rounded-3xl shadow-lg text-center w-150 border-3 border-[#2E3A87]">
            <p className="mb-4 text-md font-semibold text-red-500">
              Please Note: Cancel your subscription before deleting your account
              to stop recurring billing.
            </p>
            <p className="mb-4 text-md font-semibold text-[#2E3A87]">
              We'd really hate see you go, are you sure you want to delete your
              account
            </p>
            <div className="flex gap-4 items-center justify-center">
              <button
                className="text-md font-semibold border px-1 cursor-pointer rounded"
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className="text-md font-semibold border px-1 cursor-pointer rounded"
                onClick={handleCloseDeletePopUp}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
