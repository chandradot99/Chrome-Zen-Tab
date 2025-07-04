import React from 'react';

interface TimeWeatherProps {
  currentTime: Date;
}

const TimeWeather: React.FC<TimeWeatherProps> = ({ currentTime }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex justify-between items-start mb-8">
      {/* Time Display */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-7xl font-thin text-white mb-2 tracking-wide">
          {formatTime(currentTime)}
        </div>
        <div className="text-xl text-white/80 font-light">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Weather Widget */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
        <div className="text-5xl mb-3">☀️</div>
        <div className="text-3xl font-light text-white mb-1">24°</div>
        <div className="text-sm text-white/70 uppercase tracking-wide">Sunny</div>
        <div className="text-xs text-white/60 mt-2">Mumbai, India</div>
      </div>
    </div>
  );
};

export default TimeWeather;
