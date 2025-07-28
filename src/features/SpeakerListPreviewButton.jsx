import { useState } from "react";

export default function SpeakerListPreviewButton({ speaker, speakerVoices }) {
  const [isLoading, setIsLoading] = useState(false);

  const voiceId = speakerVoices[speaker];

  const handlePreviewVoice = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL}/audio/preview/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice_id: voiceId,
          text: `This is a priview of the selected voice for ${speaker}`,
        }),
      });

      if (!response.ok) {
        throw new Error("failed to fetch voice preview");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const previewAudio = new Audio(audioUrl);
      previewAudio.play();
    } catch (error) {
      console.error("Voice preview error:", error);
    } finally {
        setIsLoading(false)
    }
  };

  return (
    <>
       
       <button
      onClick={handlePreviewVoice}
      disabled={isLoading}
      className=" gap-2 cursor-pointer py-1 px-2 border border-[#5C6BC0] bg-[#5C6BC0] text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50"
    >
      {isLoading ? (
        "Loading..."
      ) : (
        "Preview"
      )}
    </button>
  
    </>
  )
  
}
