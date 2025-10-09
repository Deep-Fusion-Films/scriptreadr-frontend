export default function AutoAssignVoicesButton({
  setSpeakerVoices,
  voices,
  speakers,
}) {

  function handleAutoAssignVoices() {
  setSpeakerVoices(() => {
    const newAssignments = {};
    const usedVoices = new Set();

    speakers.forEach(({ speaker, gender }) => {
      let chosenVoice = null;

      // First, try to assign a voice with matching gender that's unused
      chosenVoice = voices.find(
        (voice) => voice.labels === gender && !usedVoices.has(voice.id)
      );

      // If no match, and speaker is "unknown", try neutral voices
      if (!chosenVoice && gender === "unknown") {
        chosenVoice = voices.find(
          (voice) => voice.labels === "neutral" && !usedVoices.has(voice.id)
        );
      }

      // If still nothing, fallback to any unused voice
      if (!chosenVoice) {
        chosenVoice = voices.find((voice) => !usedVoices.has(voice.id));
      }

      // Assign if found
      if (chosenVoice) {
        newAssignments[speaker] = chosenVoice.id;
        usedVoices.add(chosenVoice.id);
      } else {
        newAssignments[speaker] = "";
      }
    });

    return newAssignments;
  });
}

  return (
    <>
      <button
        title="Automatcially assign voices to speaker based on their percieved gender"
        className="transform active:scale-95 transition-transform duration-100 border-b-2 border-[#2E3A87]  hover:border-[#1F2A70] text-[#2E3A87] shadow-lg hover:cursor-pointer"
        onClick={handleAutoAssignVoices}
      >
        Auto Assign Voices
      </button>
    </>
  );
}
