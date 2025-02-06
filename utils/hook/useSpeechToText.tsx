"use client";
import { useEffect, useRef, useState } from "react";

const useSpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    if (!recognitionRef.current) {
      console.log("SpeechRecognition is not available.");
      return;
    }
    setIsListening(true);
    recognitionRef.current.start();
  };
  const stopListening = ({ isClearResult }: { isClearResult?: boolean }) => {
    if (!recognitionRef.current) {
      console.log("SpeechRecognition is not available.");
      return;
    }
    setIsListening(false);
    if (isClearResult) {
      setTranscript("");
    }
    recognitionRef.current.stop();
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser");
      setError("This functionality is currently unavailable in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1][0].transcript;
      setTranscript(result);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Error occurred in recognition:", event.error);
    };

    // recognition.onend = () => {
    //   console.log("Speech recognition ended");
    // };

    recognition.onspeechend = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        // console.log("User stopped speaking, final text logged.");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const speakText = (text: string) => {
    if (!text) {
      console.log("No text to speak.");
      return;
    }
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    synth.speak(utterance);
  };

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
    setTranscript,
    speakText,
    error,
  };
};

export default useSpeechToText;
