import React, { useState, useEffect } from 'react';
import { Plus, Settings, X, Globe } from 'lucide-react';

interface Timezone {
  id: string;
  label: string;
  timezone: string;
  isLocal?: boolean;
}

const TimezoneClocks: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [timezones, setTimezones] = useState<Timezone[]>([]);

  // Popular timezone options
  const popularTimezones = [
    { label: 'New York', timezone: 'America/New_York' },
    { label: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { label: 'London', timezone: 'Europe/London' },
    { label: 'Paris', timezone: 'Europe/Paris' },
    { label: 'Tokyo', timezone: 'Asia/Tokyo' },
    { label: 'Sydney', timezone: 'Australia/Sydney' },
    { label: 'Dubai', timezone: 'Asia/Dubai' },
    { label: 'Singapore', timezone: 'Asia/Singapore' },
    { label: 'Mumbai', timezone: 'Asia/Kolkata' },
    { label: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
    { label: 'Berlin', timezone: 'Europe/Berlin' },
    { label: 'Toronto', timezone: 'America/Toronto' },
    { label: 'São Paulo', timezone: 'America/Sao_Paulo' },
    { label: 'Mexico City', timezone: 'America/Mexico_City' },
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timezone: string): string => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone
    });
  };

  const getTimeIcon = (date: Date, timezone: string) => {
    const hour = parseInt(date.toLocaleTimeString([], { 
      hour: '2-digit', 
      hour12: false,
      timeZone: timezone 
    }));
    
    if (hour >= 6 && hour < 12) return '🌅'; // Morning
    if (hour >= 12 && hour < 18) return '☀️'; // Afternoon  
    if (hour >= 18 && hour < 22) return '🌆'; // Evening
    return '🌙'; // Night
  };

  const addTimezone = (timezone: string, label: string) => {
    if (timezones.length >= 5) return; // Max 5 timezones including local
    
    const newTimezone: Timezone = {
      id: Date.now().toString(),
      label,
      timezone
    };
    setTimezones([...timezones, newTimezone]);
  };

  const removeTimezone = (id: string) => {
    setTimezones(timezones.filter(tz => tz.id !== id && !tz.isLocal));
  };

  return (
    <div className="relative mb-6">
      {/* Timezone Clocks Row */}
      <div className="flex items-center justify-center space-x-3 overflow-x-auto pb-2">
        {timezones.map((tz) => (
          <div
            key={tz.id}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 shadow-lg min-w-[100px] group relative flex-shrink-0"
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-sm">
                  {getTimeIcon(currentTime, tz.timezone)}
                </span>
                <div className="text-xs text-white/70 drop-shadow-lg font-medium">
                  {tz.label}
                  {tz.isLocal && (
                    <span className="ml-1 text-green-400">•</span>
                  )}
                </div>
              </div>
              <div className="text-lg font-medium text-white drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                {formatTime(currentTime, tz.timezone)}
              </div>
            </div>
            
            {!tz.isLocal && (
              <button
                onClick={() => removeTimezone(tz.id)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center text-xs"
              >
                <X size={8} />
              </button>
            )}
          </div>
        ))}
        
        {/* Add More Button */}
        {timezones.length < 5 && (
          <button
            onClick={() => setShowSettings(true)}
            className="backdrop-blur-xl bg-white/5 border border-white/20 border-dashed rounded-xl p-3 shadow-lg min-w-[100px] flex-shrink-0 flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-300"
          >
            <Plus size={16} className="text-white/60 mb-1" />
            <span className="text-xs text-white/60">Add Zone</span>
          </button>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 backdrop-blur-xl bg-black/90 border border-white/30 rounded-xl p-4 shadow-2xl z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              Manage Timezones
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Current Timezones */}
          <div className="mb-4">
            <div className="text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              Active Timezones ({timezones.length}/5)
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {timezones.map((tz) => (
                <div
                  key={tz.id}
                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {getTimeIcon(currentTime, tz.timezone)}
                    </span>
                    <span className="text-white text-sm font-medium">
                      {tz.label}
                    </span>
                    {tz.isLocal && (
                      <span className="text-xs text-green-400 bg-green-400/20 px-1 py-0.5 rounded">
                        Local
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/70 text-sm">
                      {formatTime(currentTime, tz.timezone)}
                    </span>
                    {!tz.isLocal && (
                      <button
                        onClick={() => removeTimezone(tz.id)}
                        className="text-white/50 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Timezone */}
          {timezones.length < 5 && (
            <div>
              <div className="text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                Add Timezone
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {popularTimezones
                  .filter(ptz => !timezones.some(tz => tz.timezone === ptz.timezone))
                  .map((ptz, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        addTimezone(ptz.timezone, ptz.label);
                        setShowSettings(false);
                      }}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white text-xs transition-all duration-200 flex items-center space-x-2"
                    >
                      <Globe size={10} />
                      <span className="truncate">{ptz.label}</span>
                    </button>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimezoneClocks;