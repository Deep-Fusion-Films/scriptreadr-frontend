import { checkAuthToken } from "../../util";
import { useToken } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ConfirmSideBarDeletePopUp({
  url,
  setUrl,
  setShowSideBarPopUp,
  setIsLoading,
  deleteAudio,
  setDeleteAudio,
  setError,
  setShowErrorModal
}) {
  const { setToken } = useToken();
  const navigate = useNavigate();

  const handleDeleteSelectedAudio = async (url) => {
    setIsLoading(true);
    setShowSideBarPopUp(false);
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
        `${import.meta.env.VITE_LOCAL}/audio/delete_single_audio/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_name: url }),
        }
      );

      const audio = await response.json();

      if (!response.ok) {
        setError(audio.error || "Audio could not be deleted, please try again")
        setShowErrorModal(true)
        setIsLoading(false);
        return;
      }
      setDeleteAudio(!deleteAudio);
      setIsLoading(false);
    } catch (err) {
      setError("Could not delete audio, please try again!")
      setShowErrorModal(true)
      setIsLoading(false);
      return;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 rounded-md">
        <div className=" fadeIn relative bg-white p-6 rounded-3xl shadow-lg text-center border-3 border-[#2E3A87]">
          <p className="mb-4 text-md font-semibold text-[#2E3A87]">
            Are you sure you want to delete?
          </p>
          <div className="flex gap-4 items-center justify-center">
            <button
              onClick={() => handleDeleteSelectedAudio(url)}
              className="text-md font-semibold border px-1 cursor-pointer rounded"
            >
              Yes
            </button>
            <button
              onClick={() => setShowSideBarPopUp(false)}
              className="text-md font-semibold border px-1 cursor-pointer rounded"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
