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

  const formatTime = (date: Date, timezone: string): { time: string; period: string } => {
    try {
      const time12 = date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: timezone
      });
      
      const [time, period] = time12.split(' ');
      return { time, period: period || '' };
    } catch (error) {
      return { time: '--:--', period: '' };
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

  const getHour24 = (date: Date, timezone: string): number => {
    try {
      return parseInt(date.toLocaleTimeString([], { 
        hour: '2-digit', 
        hour12: false,
        timeZone: timezone 
      }));
    } catch (error) {
      return 0;
    }
  };

  // Sort timezones by time (working hours first, then others)
  const sortedTimezones = React.useMemo(() => {
    return [...timezones].sort((a, b) => {
      const hourA = getHour24(currentTime, a.timezone);
      const hourB = getHour24(currentTime, b.timezone);
      
      // Define working hours (6 AM to 10 PM)
      const isWorkingHourA = hourA >= 6 && hourA <= 22;
      const isWorkingHourB = hourB >= 6 && hourB <= 22;
      
      // Prioritize working hours
      if (isWorkingHourA && !isWorkingHourB) return -1;
      if (!isWorkingHourA && isWorkingHourB) return 1;
      
      // Within the same category (working/non-working), sort by time
      return hourA - hourB;
    });
  }, [timezones, currentTime]);

  if (timezones.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-3 overflow-x-auto pb-2 px-4">
      {sortedTimezones.map((tz) => {
        const { time, period } = formatTime(currentTime, tz.timezone);
        const hour = getHour24(currentTime, tz.timezone);
        const isWorkingHours = hour >= 9 && hour <= 17; // Business hours
        const isAsleep = hour >= 22 || hour <= 6; // Likely sleeping hours
        
        return (
          <div
            key={tz.id}
            className={`backdrop-blur-xl border rounded-xl p-3 shadow-lg min-w-[100px] flex-shrink-0 transition-all duration-300 ${
              isWorkingHours 
                ? 'bg-green-500/10 border-green-400/30' // Green tint for business hours
                : isAsleep 
                  ? 'bg-blue-500/10 border-blue-400/20' // Blue tint for night time
                  : 'bg-white/10 border-white/20' // Default
            }`}
          >
            <div className="text-center">
              {/* Icon and Location */}
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-sm">
                  {getTimeIcon(currentTime, tz.timezone)}
                </span>
                <div className="text-xs text-white/70 drop-shadow-lg font-medium truncate">
                  {tz.label}
                </div>
              </div>
              
              {/* Time */}
              <div className="flex items-baseline justify-center space-x-1 mb-1">
                <div className="text-lg font-medium text-white drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                  {time}
                </div>
                {period && (
                  <div className="text-xs text-white/60 font-light">
                    {period.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimezoneDisplay;