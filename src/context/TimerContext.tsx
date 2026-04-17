import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNotification } from './NotificationContext';

interface TimerContextType {
  timeLeft: number;
  isActive: boolean;
  duration: number;
  startTimer: (seconds: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const { showNotification } = useNotification();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (seconds: number) => {
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setDuration(0);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          if (next === 0) {
            showNotification('Timer completato! Hai un\'azione in sospeso.', 'info');
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, showNotification]);

  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContext.Provider value={{ timeLeft, isActive, duration, startTimer, pauseTimer, resetTimer, formatTime }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
