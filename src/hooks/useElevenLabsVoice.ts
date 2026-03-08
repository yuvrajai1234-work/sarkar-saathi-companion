import { useState, useRef, useCallback } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Map app language codes to ElevenLabs/ISO 639 language codes
const langToSttCode: Record<string, string> = {
  en: "eng",
  hi: "hin",
  ta: "tam",
  mr: "mar",
  te: "tel",
};

function cleanTextForTTS(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*_~`>]/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
}

export function useElevenLabsVoice(language: string = "en") {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const speakQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);

  // Core speak function - returns a promise that resolves when audio finishes
  const speakOne = useCallback(async (text: string): Promise<void> => {
    const cleaned = cleanTextForTTS(text);
    if (!cleaned) return;

    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setSpeaking(true);

    return new Promise<void>(async (resolve) => {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({ text: cleaned }),
        });

        if (!response.ok) throw new Error(`TTS failed: ${response.status}`);

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          setSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          resolve();
        };

        await audio.play();
      } catch (e) {
        console.error("ElevenLabs TTS error:", e);
        setSpeaking(false);
        resolve();
      }
    });
  }, []);

  // Process the queue one by one
  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current) return;
    isProcessingQueueRef.current = true;

    while (speakQueueRef.current.length > 0) {
      const text = speakQueueRef.current.shift()!;
      await speakOne(text);
    }

    isProcessingQueueRef.current = false;
  }, [speakOne]);

  // Public speak: queues text and processes sequentially
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;
    speakQueueRef.current.push(text);
    processQueue();
  }, [processQueue]);

  // Speak multiple texts sequentially
  const speakSequentially = useCallback(async (texts: string[]) => {
    for (const t of texts) {
      if (t.trim()) speakQueueRef.current.push(t);
    }
    processQueue();
  }, [processQueue]);

  const stopSpeaking = useCallback(() => {
    speakQueueRef.current = []; // Clear queue
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  const startListening = useCallback(async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setListening(true);
    } catch (e) {
      console.error("Mic access error:", e);
      setListening(false);
    }
  }, []);

  const stopListening = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        setListening(false);
        resolve("");
        return;
      }

      recorder.onstop = async () => {
        setListening(false);
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        recorder.stream.getTracks().forEach((t) => t.stop());

        if (audioBlob.size < 1000) {
          resolve("");
          return;
        }

        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");
          const sttLang = langToSttCode[language] || "eng";
          formData.append("language", sttLang);

          const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-stt`, {
            method: "POST",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
            body: formData,
          });

          if (!response.ok) throw new Error(`STT failed: ${response.status}`);

          const data = await response.json();
          resolve(data.text || "");
        } catch (e) {
          console.error("ElevenLabs STT error:", e);
          resolve("");
        }
      };

      recorder.stop();
    });
  }, [language]);

  return {
    speaking,
    listening,
    voiceEnabled,
    setVoiceEnabled,
    speak,
    speakSequentially,
    stopSpeaking,
    startListening,
    stopListening,
  };
}
