import React from 'react';
import { X, Globe } from 'lucide-react';

interface Timezone {
  id: string;
  label: string;
  timezone: string;
  isLocal?: boolean;
}

interface TimezoneSettingsProps {
  isVisible: boolean;
  onClose: () => void;
  timezones: Timezone[];
  localTimezone: string;
  currentTime: Date;
  onAddTimezone: (timezone: string, label: string) => void;
  onRemoveTimezone: (id: string) => void;
  maxTimezones?: number;
}

const TimezoneSettings: React.FC<TimezoneSettingsProps> = ({
  isVisible,
  onClose,
  timezones,
  localTimezone,
  currentTime,
  onAddTimezone,
  onRemoveTimezone,
  maxTimezones = 5
}) => {
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
    { label: 'Chicago', timezone: 'America/Chicago' },
    { label: 'Denver', timezone: 'America/Denver' },
    { label: 'Phoenix', timezone: 'America/Phoenix' },
    { label: 'Seattle', timezone: 'America/Los_Angeles' },
    { label: 'Vancouver', timezone: 'America/Vancouver' },
    { label: 'Montreal', timezone: 'America/Montreal' },
    { label: 'Madrid', timezone: 'Europe/Madrid' },
    { label: 'Rome', timezone: 'Europe/Rome' },
    { label: 'Amsterdam', timezone: 'Europe/Amsterdam' },
    { label: 'Stockholm', timezone: 'Europe/Stockholm' },
    { label: 'Zurich', timezone: 'Europe/Zurich' },
    { label: 'Moscow', timezone: 'Europe/Moscow' },
    { label: 'Istanbul', timezone: 'Europe/Istanbul' },
    { label: 'Cairo', timezone: 'Africa/Cairo' },
    { label: 'Johannesburg', timezone: 'Africa/Johannesburg' },
    { label: 'Lagos', timezone: 'Africa/Lagos' },
    { label: 'Tel Aviv', timezone: 'Asia/Jerusalem' },
    { label: 'Bangkok', timezone: 'Asia/Bangkok' },
    { label: 'Jakarta', timezone: 'Asia/Jakarta' },
    { label: 'Manila', timezone: 'Asia/Manila' },
    { label: 'Seoul', timezone: 'Asia/Seoul' },
    { label: 'Taipei', timezone: 'Asia/Taipei' },
    { label: 'Shanghai', timezone: 'Asia/Shanghai' },
    { label: 'Melbourne', timezone: 'Australia/Melbourne' },
    { label: 'Perth', timezone: 'Australia/Perth' },
    { label: 'Auckland', timezone: 'Pacific/Auckland' },
  ];

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

  const handleAddTimezone = (timezone: string, label: string) => {
    onAddTimezone(timezone, label);
  };

  const availableTimezones = popularTimezones.filter(
    ptz => ptz.timezone !== localTimezone && !timezones.some(tz => tz.timezone === ptz.timezone)
  );

  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-80 backdrop-blur-xl bg-black/90 border border-white/30 rounded-xl p-4 shadow-2xl z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-sm drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
          Additional Timezones
        </h3>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Current Additional Timezones */}
      {timezones.length > 0 && (
        <div className="mb-4">
          <div className="text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            Active Timezones ({timezones.length}/{maxTimezones})
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
                    onClick={() => onRemoveTimezone(tz.id)}
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
      {timezones.length < maxTimezones && (
        <div>
          <div className="text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            {timezones.length === 0 ? 'Add Timezones' : 'Add More'}
          </div>
          
          {/* Search/Filter could be added here in the future */}
          
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {availableTimezones.map((ptz, index) => (
              <button
                key={index}
                onClick={() => handleAddTimezone(ptz.timezone, ptz.label)}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white text-xs transition-all duration-200 flex items-center space-x-2"
              >
                <Globe size={10} />
                <span className="truncate">{ptz.label}</span>
              </button>
            ))}
          </div>
          
          {availableTimezones.length === 0 && (
            <div className="text-center py-4 text-white/50 text-xs">
              All popular timezones have been added
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-3 text-center">
        <div className="text-white/40 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          {timezones.length === 0 
            ? 'Add timezones to show them above this section'
            : timezones.length >= maxTimezones
              ? 'Maximum timezones reached'
              : `${maxTimezones - timezones.length} more timezone${maxTimezones - timezones.length === 1 ? '' : 's'} can be added`
          }
        </div>
      </div>
    </div>
  );
};

export default TimezoneSettings;