import { useEffect, useState } from "react";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const recognition = new window.webkitSpeechRecognition();

  useEffect(() => {
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript =
        event.results[event.results.length - 1][0].transcript;
      setRecognizedText(`${currentTranscript} ?`);
      handleVoiceCommand(currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      speakText(event.message);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleVoiceCommand = (command: string) => {
    // simulation user answer or command
    const confirmCheckWords = ["yes", "yeah", "course", "I do"];
    const anyWordIncluded = confirmCheckWords.some((word) =>
      command.toLowerCase().includes(word)
    );

    if (anyWordIncluded) {
      handleResponseCommand(
        "okay then, now you can ask me related question about color"
      );
    } else if (command.toLowerCase().includes("stop")) {
      stopListening();
      speakText("Listening stopped.");
    } else if (command.toLowerCase().includes("color")) {
      handleResponseCommand("The color is light blue");
    } else {
      handleResponseCommand(`I didn't get you, could you say it again?`);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setRecognizedText("");
  };

  const toggleListening = () => {
    setIsListening((prevState) => !prevState);
    setRecognizedText("");
  };

  const handleResponseCommand = (response: string) => {
    speakText(response);
  };

  const speakText = (text: string, targetLanguage: string = "") => {
    const voices = speechSynthesis.getVoices();

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

    speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div className="p-6 h-screen flex flex-col items-center">
        <span className="mb-4 font-bold text-xl">
          Ask something related about color
        </span>
        <p className="text-center italic text-sm">
          example: what kind of color in front of me right now?
        </p>
        <p className="w-full text-center">{recognizedText}</p>
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
