import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function App() {
  const [loadedVoices, setLoadedVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [listeningLang, setIslisteningLang] = useState<string>("en-US");

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

    // if (interimTranscript !== "") {
    //   handleVoiceCommand(interimTranscript);
    // }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    isSpeaking,
    finalTranscript,
  ]);

  const startListening = () =>
    SpeechRecognition.startListening({
      continuous: true,
      language: listeningLang,
    });
  const stopListening = () => SpeechRecognition.stopListening();

  const handleVoiceCommand = (command: string) => {
    // simulation user answer or command

    if (
      command.toLowerCase().includes("stop") ||
      command.toLowerCase().includes("berhenti")
    ) {
      speakText("Listening stopped.");
      stopListening();
      setIsListening(false);
      resetTranscript();
    } else if (command.toLowerCase().includes("color")) {
      speakText("The color is light blue");
    } else if (command.toLowerCase().includes("warna")) {
      speakText("Warna nya adalah biru", "id");
    } else if (
      command.toLowerCase().includes("indonesia") ||
      command.toLowerCase().includes("indonesian")
    ) {
      speakText("Mengganti bahasa ke indonesia", "id");
      setIslisteningLang("id");
    } else if (command.toLowerCase().includes("english")) {
      speakText("Switch to english");
      setIslisteningLang("en-US");
    } else {
      speakText(`I didn't get you, could you say it again?`);
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
    setIsListening((prevState) => !prevState);
    // Reset the transcript when starting or stopping listening
    resetTranscript();
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
