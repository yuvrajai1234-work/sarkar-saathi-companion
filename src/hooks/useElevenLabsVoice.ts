import { useState, useRef, useCallback } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const langToSttCode: Record<string, string> = {
  en: "eng",
  hi: "hin",
  ta: "tam",
  mr: "mar",
  te: "tel",
};

const langToBcp47: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  ta: "ta-IN",
  mr: "mr-IN",
  te: "te-IN",
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

// ── Web Speech fallback helpers ──────────────────────────────────────────────

function webSpeechSpeak(text: string, lang: string): Promise<void> {
  return new Promise((resolve) => {
    window.speechSynthesis.cancel();
    const cleaned = cleanTextForTTS(text);
    if (!cleaned) { resolve(); return; }

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = langToBcp47[lang] || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const bcp = langToBcp47[lang] || "en";
    const match = voices.find(v => v.lang.startsWith(bcp.split("-")[0]));
    if (match) utterance.voice = match;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

function webSpeechListen(lang: string): Promise<string> {
  return new Promise((resolve) => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { resolve(""); return; }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = langToBcp47[lang] || "";

    let resolved = false;
    recognition.onresult = (event: any) => {
      resolved = true;
      resolve(event.results?.[0]?.[0]?.transcript || "");
    };
    recognition.onerror = () => { if (!resolved) { resolved = true; resolve(""); } };
    recognition.onend = () => { if (!resolved) { resolved = true; resolve(""); } };
    recognition.start();
  });
}

// ── Main hook ────────────────────────────────────────────────────────────────

export function useElevenLabsVoice(language: string = "en") {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const speakQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);
  const elevenLabsFailedRef = useRef(false); // sticky fallback flag

  // Core speak: tries ElevenLabs, falls back to Web Speech
  const speakOne = useCallback(async (text: string): Promise<void> => {
    const cleaned = cleanTextForTTS(text);
    if (!cleaned) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setSpeaking(true);

    // If ElevenLabs already failed this session, skip straight to fallback
    if (elevenLabsFailedRef.current) {
      await webSpeechSpeak(cleaned, language);
      setSpeaking(false);
      return;
    }

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

      if (!response.ok) {
        console.warn(`ElevenLabs TTS failed (${response.status}), falling back to Web Speech`);
        elevenLabsFailedRef.current = true;
        await webSpeechSpeak(cleaned, language);
        setSpeaking(false);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return new Promise<void>((resolve) => {
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

        audio.play().catch(async () => {
          // Playback failed, use fallback
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          await webSpeechSpeak(cleaned, language);
          setSpeaking(false);
          resolve();
        });
      });
    } catch (e) {
      console.warn("ElevenLabs TTS error, falling back to Web Speech:", e);
      elevenLabsFailedRef.current = true;
      await webSpeechSpeak(cleaned, language);
      setSpeaking(false);
    }
  }, [language]);

  // Process queue one by one
  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current) return;
    isProcessingQueueRef.current = true;

    while (speakQueueRef.current.length > 0) {
      const text = speakQueueRef.current.shift()!;
      await speakOne(text);
    }

    isProcessingQueueRef.current = false;
  }, [speakOne]);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;
    speakQueueRef.current.push(text);
    processQueue();
  }, [processQueue]);

  const speakSequentially = useCallback(async (texts: string[]) => {
    for (const t of texts) {
      if (t.trim()) speakQueueRef.current.push(t);
    }
    processQueue();
  }, [processQueue]);

  const stopSpeaking = useCallback(() => {
    speakQueueRef.current = [];
    window.speechSynthesis.cancel(); // stop Web Speech fallback too
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  // ── STT: ElevenLabs with Web Speech fallback ──────────────────────────────

  const startListening = useCallback(async (): Promise<void> => {
    // If ElevenLabs already failed, use Web Speech STT directly
    if (elevenLabsFailedRef.current) {
      setListening(true);
      return;
    }

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
      console.warn("Mic access error, will use Web Speech fallback:", e);
      elevenLabsFailedRef.current = true;
      setListening(true);
    }
  }, []);

  const stopListening = useCallback(async (): Promise<string> => {
    // Web Speech fallback path
    if (elevenLabsFailedRef.current) {
      setListening(false);
      try {
        return await webSpeechListen(language);
      } catch {
        return "";
      }
    }

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

          if (!response.ok) {
            console.warn(`ElevenLabs STT failed (${response.status}), falling back to Web Speech`);
            elevenLabsFailedRef.current = true;
            const fallbackText = await webSpeechListen(language);
            resolve(fallbackText);
            return;
          }

          const data = await response.json();
          resolve(data.text || "");
        } catch (e) {
          console.warn("ElevenLabs STT error, falling back to Web Speech:", e);
          elevenLabsFailedRef.current = true;
          const fallbackText = await webSpeechListen(language);
          resolve(fallbackText);
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
