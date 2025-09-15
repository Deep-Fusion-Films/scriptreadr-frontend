export default function AutoAssignVoicesButton({
  setSpeakerVoices,
  voices,
  speakers,
}) {
  function handleAutoAssingVoices() {
    setSpeakerVoices(() => {
      const newAssignments = {};
      speakers.forEach((speaker, index) => {
        // Assign voices in sequence, if fewer voices leave blank
        const voice = voices[index];
        newAssignments[speaker] = voice?.id || "";
      });
      return newAssignments;
    });
  }

  return (
    <>
      <button
        className="transform active:scale-95 transition-transform duration-100 border-b-2 border-[#2E3A87]  hover:border-[#1F2A70] text-[#2E3A87] shadow-lg hover:cursor-pointer"
        onClick={handleAutoAssingVoices}
      >
        Auto Assign Voices
      </button>
    </>
  );
}
