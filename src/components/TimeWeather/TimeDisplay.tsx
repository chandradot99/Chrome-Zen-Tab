import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { STORAGE_KEYS } from '../../utils/constants';
import TimezoneSettings from './TimezoneSettings';

interface Timezone {
  id: string;
  label: string;
  timezone: string;
  isLocal?: boolean;
}

interface TimeDisplayProps {
  onTimezoneUpdate?: (timezones: Timezone[]) => void;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ onTimezoneUpdate }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [localTimezone, setLocalTimezone] = useState<string>('');
  const [localCity, setLocalCity] = useState<string>('');
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleAddTimezone = (timezone: string, label: string) => {
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

  const handleRemoveTimezone = (id: string) => {
    const updatedTimezones = timezones.filter(tz => tz.id !== id);
    setTimezones(updatedTimezones);
    saveTimezones(updatedTimezones);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
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
          <div className="text-3xl font-medium text-white mb-1 tracking-wide drop-shadow-2xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
            {formatTime(currentTime)}
          </div>
          
          {/* Date */}
          <div className="text-sm text-white/90 font-light drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>

      {/* Timezone Settings Component */}
      <TimezoneSettings
        isVisible={showSettings}
        onClose={handleCloseSettings}
        timezones={timezones}
        localTimezone={localTimezone}
        currentTime={currentTime}
        onAddTimezone={handleAddTimezone}
        onRemoveTimezone={handleRemoveTimezone}
        maxTimezones={5}
      />
    </div>
  );
};

export default TimeDisplay;