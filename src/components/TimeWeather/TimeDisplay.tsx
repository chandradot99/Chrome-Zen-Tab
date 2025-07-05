import React, { useState, useEffect } from 'react';
import { Settings, Plus, X, Globe } from 'lucide-react';
import { STORAGE_KEYS } from '../../utils/constants';

interface Timezone {
  id: string;
  label: string;
  timezone: string;
  isLocal?: boolean;
}

interface TimeDisplayProps {
  onTimezoneUpdate?: (timezones: Timezone[]) => void;
}

// Declare chrome types
declare const chrome: any;

const TimeDisplay: React.FC<TimeDisplayProps> = ({ onTimezoneUpdate }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [localTimezone, setLocalTimezone] = useState<string>('');
  const [localCity, setLocalCity] = useState<string>('');
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Load timezones on mount
  useEffect(() => {
    loadTimezones();
  }, []);

  // Auto-detect user's timezone
  useEffect(() => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cityName = userTimezone.split('/').pop()?.replace(/_/g, ' ') || 'Local';
      
      setLocalTimezone(userTimezone);
      setLocalCity(cityName);
    } catch (error) {
      console.error('Error detecting timezone:', error);
      setLocalTimezone('Europe/London');
      setLocalCity('London');
    }
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Notify parent when timezones change
  useEffect(() => {
    if (onTimezoneUpdate && !isLoading) {
      onTimezoneUpdate(timezones);
    }
  }, [timezones, onTimezoneUpdate, isLoading]);

  const loadTimezones = async (): Promise<void> => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([STORAGE_KEYS.TIMEZONES], (result: any) => {
          if (result[STORAGE_KEYS.TIMEZONES]) {
            console.log('Loaded timezones from storage:', result[STORAGE_KEYS.TIMEZONES]);
            setTimezones(result[STORAGE_KEYS.TIMEZONES]);
          }
          setIsLoading(false);
        });
      } else {
        // Fallback for development environment
        const stored = localStorage.getItem(STORAGE_KEYS.TIMEZONES);
        if (stored) {
          const parsedTimezones = JSON.parse(stored);
          console.log('Loaded timezones from localStorage:', parsedTimezones);
          setTimezones(parsedTimezones);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading timezones:', error);
      setIsLoading(false);
    }
  };

  const saveTimezones = (timezonesToSave: Timezone[]): void => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [STORAGE_KEYS.TIMEZONES]: timezonesToSave }, () => {
          console.log('Timezones saved to Chrome storage:', timezonesToSave);
        });
      } else {
        // Fallback for development environment
        localStorage.setItem(STORAGE_KEYS.TIMEZONES, JSON.stringify(timezonesToSave));
        console.log('Timezones saved to localStorage:', timezonesToSave);
      }
    } catch (error) {
      console.error('Error saving timezones:', error);
    }
  };

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

  const addTimezone = (timezone: string, label: string) => {
    if (timezones.length >= 5) return; // Max 5 additional timezones
    
    const newTimezone: Timezone = {
      id: Date.now().toString(),
      label,
      timezone
    };
    
    const updatedTimezones = [...timezones, newTimezone];
    setTimezones(updatedTimezones);
    saveTimezones(updatedTimezones);
    setShowSettings(false);
  };

  const removeTimezone = (id: string) => {
    const updatedTimezones = timezones.filter(tz => tz.id !== id);
    setTimezones(updatedTimezones);
    saveTimezones(updatedTimezones);
  };

  const formatTimeForTimezone = (date: Date, timezone: string): string => {
    try {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: timezone
      });
    } catch (error) {
      console.error('Error formatting time for timezone:', timezone, error);
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
      console.error('Error getting time icon for timezone:', timezone, error);
      return '🕐';
    }
  };

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/25 rounded-2xl p-4 shadow-2xl w-48 h-32">
        <div className="relative h-full flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl"></div>
          <div className="relative text-center">
            <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/25 rounded-2xl p-4 shadow-2xl w-48 h-32 relative z-[100]">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl"></div>
      
      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-2 right-2 text-white/50 hover:text-white/80 transition-colors p-1 z-10"
        title="Manage timezones"
      >
        <Settings size={12} />
      </button>

      <div className="relative h-full flex flex-col justify-center">
        <div className="text-center">
          {/* Current Timezone Label */}
          <div className="text-xs text-white/60 drop-shadow-lg mb-1">
            {localCity}
          </div>
          
          {/* Main Time */}
          <div className="text-3xl font-thin text-white mb-1 tracking-wide drop-shadow-2xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
            {formatTime(currentTime)}
          </div>
          
          {/* Date */}
          <div className="text-sm text-white/90 font-light drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-full left-0 mt-2 w-72 backdrop-blur-xl bg-black border border-white/30 rounded-xl p-4 shadow-2xl z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              Additional Timezones
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Current Additional Timezones */}
          {timezones.length > 0 && (
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
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/70 text-sm">
                        {formatTimeForTimezone(currentTime, tz.timezone)}
                      </span>
                      <button
                        onClick={() => removeTimezone(tz.id)}
                        className="text-white/50 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Timezone */}
          {timezones.length < 5 && (
            <div>
              <div className="text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                {timezones.length === 0 ? 'Add Timezones' : 'Add More'}
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {popularTimezones
                  .filter(ptz => ptz.timezone !== localTimezone && !timezones.some(tz => tz.timezone === ptz.timezone))
                  .map((ptz, index) => (
                    <button
                      key={index}
                      onClick={() => addTimezone(ptz.timezone, ptz.label)}
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

          {/* Helper Text */}
          <div className="mt-3 text-center">
            <div className="text-white/40 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              {timezones.length === 0 
                ? 'Add timezones to show them above this section'
                : `${5 - timezones.length} more timezone${5 - timezones.length === 1 ? '' : 's'} can be added`
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;