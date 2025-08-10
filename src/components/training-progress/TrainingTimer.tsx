import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

interface TrainingTimerProps {
  initialDuration: number; // in seconds
  isPaused: boolean;
  onTick: (timeLeft: number) => void;
}

const TrainingTimer = ({ initialDuration, isPaused, onTick }: TrainingTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isOvertime, setIsOvertime] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime < 0) {
          setIsOvertime(true);
          onTick(newTime);
          return newTime;
        }
        onTick(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPaused, onTick]);

  const formatTime = (time: number) => {
    const absTime = Math.abs(time);
    const minutes = Math.floor(absTime / 60);
    const seconds = absTime % 60;
    const sign = time < 0 ? '+' : '';
    return `${sign}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const progress = useMemo(() => {
    if (isOvertime) return 100;
    return ((initialDuration - timeLeft) / initialDuration) * 100;
  }, [timeLeft, initialDuration, isOvertime]);

  const timerColor = isOvertime ? 'text-red-500' : 'text-sky-500';

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex items-center justify-center space-x-4 p-4 rounded-lg bg-white/50 shadow-sm mb-4"
    >
      <div className="relative w-20 h-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <motion.circle
            className={timerColor}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${timerColor}`}>
          <Timer className="w-8 h-8" />
        </div>
      </div>
      <div className="text-left">
        <p className={`text-lg font-semibold transition-colors duration-300 ${isOvertime ? 'text-red-700' : 'text-gray-600'}`}>
          {isOvertime ? '초과 시간' : '남은 시간'}
        </p>
        <p className={`text-4xl font-bold transition-colors duration-300 ${isOvertime ? 'text-red-600' : 'text-sky-800'}`}>
          {formatTime(timeLeft)}
        </p>
      </div>
    </motion.div>
  );
};

export default TrainingTimer;
