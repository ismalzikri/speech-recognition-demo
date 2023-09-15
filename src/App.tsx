import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

/*
  - create simulation for multiple languange, specific english & indonesia
  - improve interactivity responses

  const questions = ['who','what','when','where','why','how','can', 'could']
*/

function App() {
  const [loadedVoices, setLoadedVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setisListening] = useState<boolean>(false);

  const {
    transcript,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert(
        `Sorry, seems like your browser doesn't support SpeechRecognition API`
      );
    }

    if (!isMicrophoneAvailable) {
      alert(
        "Sorry, seems like you not give the microphone permission, reload and allow when the app asking you!"
      );
    }

    if (finalTranscript !== "") {
      handleVoiceCommand(finalTranscript);
    }

    const initializeVoices = () => {
      const voices = speechSynthesis.getVoices();
      setLoadedVoices(voices);
    };

    const handleVoicesChanged = () => {
      initializeVoices();
    };

    // Check if voices are already loaded
    if (speechSynthesis.getVoices().length > 0) {
      initializeVoices();
    } else {
      speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    isSpeaking,
    finalTranscript,
  ]);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  const stopListening = () => SpeechRecognition.stopListening();

  const handleVoiceCommand = (command: string) => {
    // simulation user answer or command
    const confirmCheckWords = ["yes", "yeah", "course", "I do"];
    const confirmChecked = confirmCheckWords.some((word) =>
      command.toLowerCase().includes(word)
    );

    if (confirmChecked) {
      handleResponseCommand(
        "okay then, now you can ask me related question about color"
      );
    } else if (command.toLowerCase().includes("stop")) {
      speakText("Listening stopped.");
      stopListening();
      setisListening(false);
      resetTranscript();
    } else if (command.toLowerCase().includes("color")) {
      handleResponseCommand("The color is light blue");
    } else {
      handleResponseCommand(`I didn't get you, could you say it again?`);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      // If currently listening, stop listening
      stopListening();
    } else {
      // If not listening, start listening and speak a message
      startListening();
      setIsSpeaking(true);
      speakText("start listening..");
    }
    // Toggle the isListening state
    setisListening((prevState) => !prevState);
    // Reset the transcript when starting or stopping listening
    resetTranscript();
  };

  const handleResponseCommand = (response: string) => {
    speakText(response);
  };

  const speakText = (text: string, targetLanguage: string = "") => {
    const voices = loadedVoices;
    let desiredVoice = null;

    if (targetLanguage === "") {
      desiredVoice = voices.find((voice) => voice.lang === "en-GB");
    }

    if (targetLanguage === "id") {
      desiredVoice = voices.find((voice) => voice.lang === "id-ID");
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = desiredVoice || null;
    utterance.rate = 0.9;
    utterance.pitch = 1.2;

    utterance.onend = () => {
      if (finalTranscript.toLowerCase().includes("stop")) return;
      setIsSpeaking(false);
      startListening();
      resetTranscript();
    };

    speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div className="p-6 flex flex-col items-center">
        <span className="mb-4 font-bold text-xl">
          Ask something related about color
        </span>
        <p className="text-center italic text-sm">
          example: what kind of color in front of me right now?
        </p>
        <p className="w-full text-center mb-5">{transcript}</p>
        <p className="w-full text-center text-xs font-bold">
          Note: for better voice recognition response, please use your earphone
          or headset.
        </p>
        <button
          onClick={toggleListening}
          className="fixed bottom-8 border-2 border-white p-2 rounded-full"
        >
          <img
            width={32}
            height={32}
            src={
              isListening
                ? "/icons/microphone.png"
                : "/icons/microphone-mute.png"
            }
            alt="microphone-icon"
          />
        </button>
      </div>
    </>
  );
}

export default App;
