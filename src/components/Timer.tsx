import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // Duration in minutes
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        
        // Set warning when less than 5 minutes remain
        if (newTime <= 300 && !isWarning) {
          setIsWarning(true);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp, isWarning]);

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Calculate the progress percentage
  const progressPercentage = (timeLeft / (duration * 60)) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className={`w-5 h-5 ${isWarning ? 'text-red-500' : 'text-blue-500'}`} />
          <span className={`font-mono text-lg font-semibold ${isWarning ? 'text-red-500' : 'text-gray-700'}`}>
            {formattedTime}
          </span>
        </div>
        
        <div className="text-sm font-medium text-gray-500">
          অবশিষ্ট সময়
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1 mt-2">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${isWarning ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;