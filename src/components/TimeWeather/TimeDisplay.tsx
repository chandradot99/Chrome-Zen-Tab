import React, { useState, useEffect } from 'react';

const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/25 rounded-2xl p-4 shadow-2xl w-48 h-32">
      <div className="relative h-full flex flex-col justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl"></div>
        <div className="relative text-center">
          <div className="text-3xl font-thin text-white mb-1 tracking-wide drop-shadow-2xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-white/90 font-light drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;