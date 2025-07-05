import React, { useState } from 'react';
import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';

export interface Timezone {
  id: string;
  label: string;
  timezone: string;
  isLocal?: boolean;
}

const TimezoneDisplay: React.FC<{ timezones: Timezone[] }> = ({ timezones }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timezone: string): string => {
    try {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: timezone
      });
    } catch (error) {
      return '--:--';
    }
  };

  const getTimeIcon = (date: Date, timezone: string) => {
    try {
      const hour = parseInt(date.toLocaleTimeString([], { 
        hour: '2-digit', 
        hour12: false,
        timeZone: timezone 
      }));
      
      if (hour >= 6 && hour < 12) return '🌅';
      if (hour >= 12 && hour < 18) return '☀️';
      if (hour >= 18 && hour < 22) return '🌆';
      return '🌙';
    } catch (error) {
      return '🕐';
    }
  };

  return (
    <div className="flex items-center justify-center space-x-3 overflow-x-auto pb-2 px-4">
      {timezones.map((tz) => (
        <div
          key={tz.id}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 shadow-lg min-w-[90px] flex-shrink-0"
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <span className="text-sm">
                {getTimeIcon(currentTime, tz.timezone)}
              </span>
              <div className="text-xs text-white/70 drop-shadow-lg font-medium">
                {tz.label}
              </div>
            </div>
            <div className="text-lg font-medium text-white drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              {formatTime(currentTime, tz.timezone)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimezoneDisplay;