/**
 * VoiceSOSContext
 * ================
 * Single shared context that owns ONE SpeechRecognition instance.
 * Both VoiceSOSSection (dashboard) and VoiceSOSIndicator (global FAB)
 * read state from here instead of each creating their own mic instance,
 * which previously caused the SOS to fire twice per keyword.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { type SOSKeyword, type VoiceSOSState, SOS_KEYWORDS } from "./use-voice-sos";

type VoiceSOSContextValue = {
  state: VoiceSOSState;
  lastKeyword: SOSKeyword | null;
  errorMessage: string | null;
  start: () => void;
  stop: () => void;
  toggle: () => void;
};

const VoiceSOSCtx = createContext<VoiceSOSContextValue | null>(null);

type SpeechRecognitionCtor = typeof window.SpeechRecognition;

function getSR(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  return (
    (window as typeof window & { SpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ??
    (window as typeof window & { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition ??
    null
  );
}

export function VoiceSOSProvider({
  children,
  onKeywordDetected,
}: {
  children: ReactNode;
  onKeywordDetected: (keyword: SOSKeyword) => void | Promise<void>;
}) {
  const [state, setState] = useState<VoiceSOSState>(() =>
    getSR() ? "idle" : "unsupported"
  );
  const [lastKeyword, setLastKeyword] = useState<SOSKeyword | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(null);
  const stateRef = useRef<VoiceSOSState>(state);
  const onKeywordRef = useRef(onKeywordDetected);

  // Keep refs in sync
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { onKeywordRef.current = onKeywordDetected; }, [onKeywordDetected]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setState("idle");
  }, []);

  const start = useCallback(() => {
    const SR = getSR();
    if (!SR) { setState("unsupported"); return; }
    if (stateRef.current === "listening" || stateRef.current === "detected") return;

    setState("requesting");

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setState("listening");
      setErrorMessage(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        for (let j = 0; j < result.length; j++) {
          const transcript = result[j].transcript.toLowerCase().trim();
          for (const keyword of SOS_KEYWORDS) {
            if (transcript.includes(keyword)) {
              setState("detected");
              setLastKeyword(keyword);
              recognition.stop();
              void onKeywordRef.current(keyword);
              return;
            }
          }
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const msg =
        event.error === "not-allowed"
          ? "Microphone access denied. Please allow mic permissions."
          : event.error === "no-speech"
          ? "No speech detected. Try again."
          : `Voice error: ${event.error}`;
      setErrorMessage(msg);
      setState("error");
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (stateRef.current === "listening") {
        try { recognition.start(); } catch { /* already stopped */ }
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      setErrorMessage(`Failed to start voice recognition: ${String(err)}`);
      setState("error");
    }
  }, []);

  const toggle = useCallback(() => {
    if (stateRef.current === "listening") stop();
    else start();
  }, [start, stop]);

  // Cleanup on unmount
  useEffect(() => () => { recognitionRef.current?.stop(); }, []);

  return (
    <VoiceSOSCtx.Provider value={{ state, lastKeyword, errorMessage, start, stop, toggle }}>
      {children}
    </VoiceSOSCtx.Provider>
  );
}

export function useVoiceSOSContext(): VoiceSOSContextValue {
  const ctx = useContext(VoiceSOSCtx);
  if (!ctx) throw new Error("useVoiceSOSContext must be used within VoiceSOSProvider");
  return ctx;
}
