import { useState, useEffect, useCallback } from 'react';

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  seconds: number;
  startedAt: Date | null;
  stoppedAt: Date | null;
}

interface UseTimerResult {
  isRunning: boolean;
  isPaused: boolean;
  seconds: number;
  formattedTime: string;
  startTime: string | null;
  endTime: string | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  setCustomDuration: (seconds: number) => void;
}

/**
 * Custom hook for managing timer functionality in driving lessons
 * @param initialSeconds - Initial duration in seconds
 * @returns Timer control methods and state
 */
export const useTimer = (initialSeconds = 0): UseTimerResult => {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    seconds: initialSeconds,
    startedAt: null,
    stoppedAt: null,
  });

  // Format seconds as HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  };

  // Format time for data (HH:MM)
  const formatTimeForData = (date: Date | null): string | null => {
    if (!date) return null;
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Timer increment effect
  useEffect(() => {
    let interval: number | null = null;
    
    if (state.isRunning && !state.isPaused) {
      interval = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          seconds: prev.seconds + 1
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.isPaused]);

  // Start timer
  const start = useCallback(() => {
    const now = new Date();
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startedAt: prev.startedAt || now,
      stoppedAt: null
    }));
  }, []);

  // Pause timer
  const pause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: true
    }));
  }, []);

  // Resume timer
  const resume = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: false
    }));
  }, []);

  // Stop timer
  const stop = useCallback(() => {
    const now = new Date();
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      stoppedAt: now
    }));
  }, []);

  // Reset timer
  const reset = useCallback(() => {
    setState({
      isRunning: false,
      isPaused: false,
      seconds: 0,
      startedAt: null,
      stoppedAt: null
    });
  }, []);

  // Set custom duration
  const setCustomDuration = useCallback((seconds: number) => {
    setState(prev => {
      // If timer is or was running, recalculate startedAt time
      let startedAt = prev.startedAt;
      if (startedAt) {
        const now = new Date();
        startedAt = new Date(now.getTime() - (seconds * 1000));
      }
      
      return {
        ...prev,
        seconds,
        startedAt
      };
    });
  }, []);

  return {
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    seconds: state.seconds,
    formattedTime: formatTime(state.seconds),
    startTime: formatTimeForData(state.startedAt),
    endTime: formatTimeForData(state.stoppedAt),
    start,
    pause,
    resume,
    stop,
    reset,
    setCustomDuration
  };
};

export default useTimer; 