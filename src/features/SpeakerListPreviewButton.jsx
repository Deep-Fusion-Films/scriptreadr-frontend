import { useState } from "react";

import { checkAuthToken } from "../util";
import { useToken } from "../store/AuthContext";

export default function SpeakerListPreviewButton({
  speaker,
  speakerVoices,
  setError,
  setShowErrorModal,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useToken();

  const voiceId = speakerVoices[speaker];

  const handlePreviewVoice = async () => {
    setIsLoading(true);

    const token = await checkAuthToken();
    if (!token) {
      setToken(null);
      navigate("/signin");
      setIsLoading(false);
      return;
    }

    setToken(token);

    // check subscription and quotas before upload
    try {
      const subscription = await fetch(
        `${import.meta.env.VITE_LOCAL}/audio/subscription_preview/`,
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
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      setError("Could not check your subscription status, please try again.");
      setShowErrorModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCAL}/audio/preview/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voice_id: voiceId,
            text: `This is a preview of the selected voice for ${speaker}`,
          }),
        }
      );

      

      if (!response.ok) {
        const message = await response.json();
        setError(message.error || 'Failed to generate preview audio, please try again later.')
        setIsLoading(false)
        setShowErrorModal(true)
        return
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const previewAudio = new Audio(audioUrl);
      previewAudio.play();
    } catch (error) {
      setError('Failed to generate preview audio, please try again later.');
      setShowErrorModal(true)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePreviewVoice}
        disabled={isLoading}
        className=" gap-2 cursor-pointer py-1 px-2 border border-[#5C6BC0] bg-[#5C6BC0] text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Preview"}
      </button>
    </>
  );
}
