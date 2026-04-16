import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, Pause, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { useTimer } from '../context/TimerContext';

export default function TimerWidget() {
  const { timeLeft, isActive, startTimer, pauseTimer, resetTimer, formatTime } = useTimer();
  const [isPicking, setIsPicking] = useState(false);
  const [pickedMinutes, setPickedMinutes] = useState(5);

  const handleStart = () => {
    if (timeLeft === 0) {
      startTimer(pickedMinutes * 60);
    } else {
      // Resume or start new? If it was paused, it resumes in context logic
      // But my context startTimer resets it. Let's fix context later if needed.
      // For now, if timeLeft > 0, we just toggle isActive in context.
      // Actually, let's just use startTimer for new and toggle for pause.
      startTimer(timeLeft || pickedMinutes * 60);
    }
    setIsPicking(false);
  };

  return (
    <div className="relative">
      <motion.div 
        layout
        className={`bento-card p-4 flex items-center gap-4 border-2 ${isActive ? 'border-accent shadow-[0_0_15px_rgba(198,255,0,0.2)]' : 'border-outline/30'} transition-all duration-500`}
      >
        <div 
          className="cursor-pointer flex items-center gap-3"
          onClick={() => !isActive && setIsPicking(!isPicking)}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-accent text-on-accent animate-pulse' : 'bg-surface-container-high text-primary'}`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-outline">Timer Promemoria</p>
            <p className="text-lg font-mono font-black tracking-tighter">
              {timeLeft > 0 ? formatTime(timeLeft) : `${pickedMinutes}:00`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {timeLeft > 0 && (
            <button 
              onClick={resetTimer}
              className="p-2 hover:bg-surface-container-highest rounded-full transition-colors text-outline hover:text-error"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          
          <button 
            onClick={isActive ? pauseTimer : handleStart}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${isActive ? 'bg-surface-container-highest text-on-surface' : 'bg-primary text-on-primary shadow-lg shadow-primary/20'}`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
        </div>
      </motion.div>

      {/* Scrolling Picker Popover */}
      <AnimatePresence>
        {isPicking && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bento-card p-6 shadow-2xl border-2 border-primary/20 bg-surface-container-lowest"
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-center mb-6 text-primary">Imposta Durata</h4>
            
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => setPickedMinutes(m => Math.min(120, m + 1))}
                  className="p-2 hover:bg-surface-container rounded-full transition-colors"
                >
                  <ChevronUp className="w-6 h-6 text-outline" />
                </button>
                <div className="text-5xl font-black tracking-tighter text-on-surface w-16 text-center">
                  {pickedMinutes}
                </div>
                <button 
                  onClick={() => setPickedMinutes(m => Math.max(1, m - 1))}
                  className="p-2 hover:bg-surface-container rounded-full transition-colors"
                >
                  <ChevronDown className="w-6 h-6 text-outline" />
                </button>
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-outline-variant">Minuti</div>
            </div>

            <button 
              onClick={handleStart}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent hover:text-on-accent transition-all"
            >
              Conferma e Avvia
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
