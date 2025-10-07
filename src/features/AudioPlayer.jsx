import { useState, useRef } from "react";

export default function AudioPlayer({ audioUrl }) {
const [isLoading, setIsLoading] = useState(false);
const minTimer = useRef(null);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    // keep pulsing for at least 2 seconds
    clearTimeout(minTimer.current);
    minTimer.current = setTimeout(() => setIsLoading(false), 3000);
  };

  const handlePlay = () => {
    clearTimeout(minTimer.current);
    setIsLoading(false); // stop pulse immediately on play
  };

  return (
    <div className="w-full max-w-full overflow-hidden ">
      <audio
        className={`max-w-full transition-all duration-500 ease-in-out ${isLoading ? "animate-pulse" : ""}`}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        controls
        key={audioUrl}
      >
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
