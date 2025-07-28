import { useState } from "react";

export default function PreviewButton({ selectedVoice }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePreviewVoice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL}/audio/preview/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice_id: selectedVoice,
          text: "This is a priview of the selected voice.",
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
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePreviewVoice}
        disabled={isLoading}
        className="cursor-pointer py-1 px-2 border border-[#5C6BC0] hover:bg-[#3F4C9A] bg-[#5C6BC0] text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-t-transparent border-teal-500 rounded-full animate-spin" />
        ) : (
          "Preview"
        )}
      </button>
    </>
  );
}
