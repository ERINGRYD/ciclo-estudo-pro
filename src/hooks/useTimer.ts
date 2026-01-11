import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerReturn {
  totalSeconds: number;
  questionSeconds: number;
  formattedTotal: string;
  formattedQuestion: string;
  resetQuestionTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  isPaused: boolean;
}

export const useTimer = (): UseTimerReturn => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
        setQuestionSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const resetQuestionTimer = useCallback(() => {
    setQuestionSeconds(0);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {
    totalSeconds,
    questionSeconds,
    formattedTotal: formatTime(totalSeconds),
    formattedQuestion: formatTime(questionSeconds),
    resetQuestionTimer,
    pauseTimer,
    resumeTimer,
    isPaused,
  };
};
