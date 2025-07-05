import React, { useState, useEffect } from 'react';
import { X, Globe, Search } from 'lucide-react';

interface Timezone {
  id: string;
  label: string;
  timezone: string;
  isLocal?: boolean;
}

interface TimezoneOption {
  label: string;
  timezone: string;
  region: string;
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
  maxTimezones = 8
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTimezones, setFilteredTimezones] = useState<TimezoneOption[]>([]);

  // Comprehensive list of all major timezones
  const allTimezones: TimezoneOption[] = [
    // Americas
    { label: 'New York', timezone: 'America/New_York', region: 'Americas' },
    { label: 'Los Angeles', timezone: 'America/Los_Angeles', region: 'Americas' },
    { label: 'Chicago', timezone: 'America/Chicago', region: 'Americas' },
    { label: 'Denver', timezone: 'America/Denver', region: 'Americas' },
    { label: 'Phoenix', timezone: 'America/Phoenix', region: 'Americas' },
    { label: 'Anchorage', timezone: 'America/Anchorage', region: 'Americas' },
    { label: 'Honolulu', timezone: 'Pacific/Honolulu', region: 'Americas' },
    { label: 'Toronto', timezone: 'America/Toronto', region: 'Americas' },
    { label: 'Vancouver', timezone: 'America/Vancouver', region: 'Americas' },
    { label: 'Montreal', timezone: 'America/Montreal', region: 'Americas' },
    { label: 'Mexico City', timezone: 'America/Mexico_City', region: 'Americas' },
    { label: 'Guadalajara', timezone: 'America/Mexico_City', region: 'Americas' },
    { label: 'Cancun', timezone: 'America/Cancun', region: 'Americas' },
    { label: 'Guatemala City', timezone: 'America/Guatemala', region: 'Americas' },
    { label: 'San Salvador', timezone: 'America/El_Salvador', region: 'Americas' },
    { label: 'Tegucigalpa', timezone: 'America/Tegucigalpa', region: 'Americas' },
    { label: 'Managua', timezone: 'America/Managua', region: 'Americas' },
    { label: 'San José', timezone: 'America/Costa_Rica', region: 'Americas' },
    { label: 'Panama City', timezone: 'America/Panama', region: 'Americas' },
    { label: 'Havana', timezone: 'America/Havana', region: 'Americas' },
    { label: 'Kingston', timezone: 'America/Jamaica', region: 'Americas' },
    { label: 'Port-au-Prince', timezone: 'America/Port-au-Prince', region: 'Americas' },
    { label: 'Santo Domingo', timezone: 'America/Santo_Domingo', region: 'Americas' },
    { label: 'San Juan', timezone: 'America/Puerto_Rico', region: 'Americas' },
    { label: 'Caracas', timezone: 'America/Caracas', region: 'Americas' },
    { label: 'Bogotá', timezone: 'America/Bogota', region: 'Americas' },
    { label: 'Lima', timezone: 'America/Lima', region: 'Americas' },
    { label: 'Quito', timezone: 'America/Guayaquil', region: 'Americas' },
    { label: 'La Paz', timezone: 'America/La_Paz', region: 'Americas' },
    { label: 'Santiago', timezone: 'America/Santiago', region: 'Americas' },
    { label: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', region: 'Americas' },
    { label: 'São Paulo', timezone: 'America/Sao_Paulo', region: 'Americas' },
    { label: 'Rio de Janeiro', timezone: 'America/Sao_Paulo', region: 'Americas' },
    { label: 'Brasília', timezone: 'America/Sao_Paulo', region: 'Americas' },
    { label: 'Montevideo', timezone: 'America/Montevideo', region: 'Americas' },
    { label: 'Asunción', timezone: 'America/Asuncion', region: 'Americas' },
    
    // Europe
    { label: 'London', timezone: 'Europe/London', region: 'Europe' },
    { label: 'Dublin', timezone: 'Europe/Dublin', region: 'Europe' },
    { label: 'Paris', timezone: 'Europe/Paris', region: 'Europe' },
    { label: 'Berlin', timezone: 'Europe/Berlin', region: 'Europe' },
    { label: 'Rome', timezone: 'Europe/Rome', region: 'Europe' },
    { label: 'Madrid', timezone: 'Europe/Madrid', region: 'Europe' },
    { label: 'Barcelona', timezone: 'Europe/Madrid', region: 'Europe' },
    { label: 'Amsterdam', timezone: 'Europe/Amsterdam', region: 'Europe' },
    { label: 'Brussels', timezone: 'Europe/Brussels', region: 'Europe' },
    { label: 'Vienna', timezone: 'Europe/Vienna', region: 'Europe' },
    { label: 'Zurich', timezone: 'Europe/Zurich', region: 'Europe' },
    { label: 'Prague', timezone: 'Europe/Prague', region: 'Europe' },
    { label: 'Warsaw', timezone: 'Europe/Warsaw', region: 'Europe' },
    { label: 'Budapest', timezone: 'Europe/Budapest', region: 'Europe' },
    { label: 'Stockholm', timezone: 'Europe/Stockholm', region: 'Europe' },
    { label: 'Oslo', timezone: 'Europe/Oslo', region: 'Europe' },
    { label: 'Copenhagen', timezone: 'Europe/Copenhagen', region: 'Europe' },
    { label: 'Helsinki', timezone: 'Europe/Helsinki', region: 'Europe' },
    { label: 'Athens', timezone: 'Europe/Athens', region: 'Europe' },
    { label: 'Istanbul', timezone: 'Europe/Istanbul', region: 'Europe' },
    { label: 'Moscow', timezone: 'Europe/Moscow', region: 'Europe' },
    { label: 'St. Petersburg', timezone: 'Europe/Moscow', region: 'Europe' },
    { label: 'Kiev', timezone: 'Europe/Kiev', region: 'Europe' },
    { label: 'Bucharest', timezone: 'Europe/Bucharest', region: 'Europe' },
    { label: 'Sofia', timezone: 'Europe/Sofia', region: 'Europe' },
    { label: 'Belgrade', timezone: 'Europe/Belgrade', region: 'Europe' },
    { label: 'Zagreb', timezone: 'Europe/Zagreb', region: 'Europe' },
    { label: 'Ljubljana', timezone: 'Europe/Ljubljana', region: 'Europe' },
    { label: 'Bratislava', timezone: 'Europe/Bratislava', region: 'Europe' },
    { label: 'Tallinn', timezone: 'Europe/Tallinn', region: 'Europe' },
    { label: 'Riga', timezone: 'Europe/Riga', region: 'Europe' },
    { label: 'Vilnius', timezone: 'Europe/Vilnius', region: 'Europe' },
    { label: 'Minsk', timezone: 'Europe/Minsk', region: 'Europe' },
    { label: 'Reykjavik', timezone: 'Atlantic/Reykjavik', region: 'Europe' },
    
    // Asia
    { label: 'Tokyo', timezone: 'Asia/Tokyo', region: 'Asia' },
    { label: 'Seoul', timezone: 'Asia/Seoul', region: 'Asia' },
    { label: 'Beijing', timezone: 'Asia/Shanghai', region: 'Asia' },
    { label: 'Shanghai', timezone: 'Asia/Shanghai', region: 'Asia' },
    { label: 'Hong Kong', timezone: 'Asia/Hong_Kong', region: 'Asia' },
    { label: 'Singapore', timezone: 'Asia/Singapore', region: 'Asia' },
    { label: 'Bangkok', timezone: 'Asia/Bangkok', region: 'Asia' },
    { label: 'Jakarta', timezone: 'Asia/Jakarta', region: 'Asia' },
    { label: 'Manila', timezone: 'Asia/Manila', region: 'Asia' },
    { label: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', region: 'Asia' },
    { label: 'Ho Chi Minh City', timezone: 'Asia/Ho_Chi_Minh', region: 'Asia' },
    { label: 'Hanoi', timezone: 'Asia/Ho_Chi_Minh', region: 'Asia' },
    { label: 'Yangon', timezone: 'Asia/Yangon', region: 'Asia' },
    { label: 'Dhaka', timezone: 'Asia/Dhaka', region: 'Asia' },
    { label: 'Colombo', timezone: 'Asia/Colombo', region: 'Asia' },
    { label: 'Mumbai', timezone: 'Asia/Kolkata', region: 'Asia' },
    { label: 'Delhi', timezone: 'Asia/Kolkata', region: 'Asia' },
    { label: 'Kolkata', timezone: 'Asia/Kolkata', region: 'Asia' },
    { label: 'Chennai', timezone: 'Asia/Kolkata', region: 'Asia' },
    { label: 'Bangalore', timezone: 'Asia/Kolkata', region: 'Asia' },
    { label: 'Hyderabad', timezone: 'Asia/Kolkata', region: 'Asia' },
    { label: 'Karachi', timezone: 'Asia/Karachi', region: 'Asia' },
    { label: 'Islamabad', timezone: 'Asia/Karachi', region: 'Asia' },
    { label: 'Lahore', timezone: 'Asia/Karachi', region: 'Asia' },
    { label: 'Kabul', timezone: 'Asia/Kabul', region: 'Asia' },
    { label: 'Tehran', timezone: 'Asia/Tehran', region: 'Asia' },
    { label: 'Dubai', timezone: 'Asia/Dubai', region: 'Asia' },
    { label: 'Abu Dhabi', timezone: 'Asia/Dubai', region: 'Asia' },
    { label: 'Doha', timezone: 'Asia/Qatar', region: 'Asia' },
    { label: 'Kuwait City', timezone: 'Asia/Kuwait', region: 'Asia' },
    { label: 'Riyadh', timezone: 'Asia/Riyadh', region: 'Asia' },
    { label: 'Jeddah', timezone: 'Asia/Riyadh', region: 'Asia' },
    { label: 'Baghdad', timezone: 'Asia/Baghdad', region: 'Asia' },
    { label: 'Amman', timezone: 'Asia/Amman', region: 'Asia' },
    { label: 'Beirut', timezone: 'Asia/Beirut', region: 'Asia' },
    { label: 'Damascus', timezone: 'Asia/Damascus', region: 'Asia' },
    { label: 'Jerusalem', timezone: 'Asia/Jerusalem', region: 'Asia' },
    { label: 'Tel Aviv', timezone: 'Asia/Jerusalem', region: 'Asia' },
    { label: 'Yerevan', timezone: 'Asia/Yerevan', region: 'Asia' },
    { label: 'Baku', timezone: 'Asia/Baku', region: 'Asia' },
    { label: 'Tbilisi', timezone: 'Asia/Tbilisi', region: 'Asia' },
    { label: 'Tashkent', timezone: 'Asia/Tashkent', region: 'Asia' },
    { label: 'Almaty', timezone: 'Asia/Almaty', region: 'Asia' },
    { label: 'Bishkek', timezone: 'Asia/Bishkek', region: 'Asia' },
    { label: 'Dushanbe', timezone: 'Asia/Dushanbe', region: 'Asia' },
    { label: 'Ashgabat', timezone: 'Asia/Ashgabat', region: 'Asia' },
    { label: 'Ulaanbaatar', timezone: 'Asia/Ulaanbaatar', region: 'Asia' },
    { label: 'Kathmandu', timezone: 'Asia/Kathmandu', region: 'Asia' },
    { label: 'Thimphu', timezone: 'Asia/Thimphu', region: 'Asia' },
    { label: 'Taipei', timezone: 'Asia/Taipei', region: 'Asia' },
    
    // Africa
    { label: 'Cairo', timezone: 'Africa/Cairo', region: 'Africa' },
    { label: 'Lagos', timezone: 'Africa/Lagos', region: 'Africa' },
    { label: 'Nairobi', timezone: 'Africa/Nairobi', region: 'Africa' },
    { label: 'Johannesburg', timezone: 'Africa/Johannesburg', region: 'Africa' },
    { label: 'Cape Town', timezone: 'Africa/Johannesburg', region: 'Africa' },
    { label: 'Casablanca', timezone: 'Africa/Casablanca', region: 'Africa' },
    { label: 'Tunis', timezone: 'Africa/Tunis', region: 'Africa' },
    { label: 'Algiers', timezone: 'Africa/Algiers', region: 'Africa' },
    { label: 'Accra', timezone: 'Africa/Accra', region: 'Africa' },
    { label: 'Abidjan', timezone: 'Africa/Abidjan', region: 'Africa' },
    { label: 'Dakar', timezone: 'Africa/Dakar', region: 'Africa' },
    { label: 'Bamako', timezone: 'Africa/Bamako', region: 'Africa' },
    { label: 'Ouagadougou', timezone: 'Africa/Ouagadougou', region: 'Africa' },
    { label: 'Niamey', timezone: 'Africa/Niamey', region: 'Africa' },
    { label: 'Conakry', timezone: 'Africa/Conakry', region: 'Africa' },
    { label: 'Freetown', timezone: 'Africa/Freetown', region: 'Africa' },
    { label: 'Monrovia', timezone: 'Africa/Monrovia', region: 'Africa' },
    { label: 'Bissau', timezone: 'Africa/Bissau', region: 'Africa' },
    { label: 'Praia', timezone: 'Atlantic/Cape_Verde', region: 'Africa' },
    { label: 'Malabo', timezone: 'Africa/Malabo', region: 'Africa' },
    { label: 'Libreville', timezone: 'Africa/Libreville', region: 'Africa' },
    { label: 'Brazzaville', timezone: 'Africa/Brazzaville', region: 'Africa' },
    { label: 'Kinshasa', timezone: 'Africa/Kinshasa', region: 'Africa' },
    { label: 'Bangui', timezone: 'Africa/Bangui', region: 'Africa' },
    { label: 'N\'Djamena', timezone: 'Africa/Ndjamena', region: 'Africa' },
    { label: 'Khartoum', timezone: 'Africa/Khartoum', region: 'Africa' },
    { label: 'Addis Ababa', timezone: 'Africa/Addis_Ababa', region: 'Africa' },
    { label: 'Asmara', timezone: 'Africa/Asmara', region: 'Africa' },
    { label: 'Djibouti', timezone: 'Africa/Djibouti', region: 'Africa' },
    { label: 'Mogadishu', timezone: 'Africa/Mogadishu', region: 'Africa' },
    { label: 'Kampala', timezone: 'Africa/Kampala', region: 'Africa' },
    { label: 'Kigali', timezone: 'Africa/Kigali', region: 'Africa' },
    { label: 'Bujumbura', timezone: 'Africa/Bujumbura', region: 'Africa' },
    { label: 'Dar es Salaam', timezone: 'Africa/Dar_es_Salaam', region: 'Africa' },
    { label: 'Dodoma', timezone: 'Africa/Dar_es_Salaam', region: 'Africa' },
    { label: 'Lusaka', timezone: 'Africa/Lusaka', region: 'Africa' },
    { label: 'Harare', timezone: 'Africa/Harare', region: 'Africa' },
    { label: 'Gaborone', timezone: 'Africa/Gaborone', region: 'Africa' },
    { label: 'Maseru', timezone: 'Africa/Maseru', region: 'Africa' },
    { label: 'Mbabane', timezone: 'Africa/Mbabane', region: 'Africa' },
    { label: 'Maputo', timezone: 'Africa/Maputo', region: 'Africa' },
    { label: 'Antananarivo', timezone: 'Indian/Antananarivo', region: 'Africa' },
    { label: 'Port Louis', timezone: 'Indian/Mauritius', region: 'Africa' },
    { label: 'Victoria', timezone: 'Indian/Mahe', region: 'Africa' },
    
    // Oceania
    { label: 'Sydney', timezone: 'Australia/Sydney', region: 'Oceania' },
    { label: 'Melbourne', timezone: 'Australia/Melbourne', region: 'Oceania' },
    { label: 'Brisbane', timezone: 'Australia/Brisbane', region: 'Oceania' },
    { label: 'Perth', timezone: 'Australia/Perth', region: 'Oceania' },
    { label: 'Adelaide', timezone: 'Australia/Adelaide', region: 'Oceania' },
    { label: 'Darwin', timezone: 'Australia/Darwin', region: 'Oceania' },
    { label: 'Hobart', timezone: 'Australia/Hobart', region: 'Oceania' },
    { label: 'Canberra', timezone: 'Australia/Sydney', region: 'Oceania' },
    { label: 'Auckland', timezone: 'Pacific/Auckland', region: 'Oceania' },
    { label: 'Wellington', timezone: 'Pacific/Auckland', region: 'Oceania' },
    { label: 'Suva', timezone: 'Pacific/Fiji', region: 'Oceania' },
    { label: 'Port Moresby', timezone: 'Pacific/Port_Moresby', region: 'Oceania' },
    { label: 'Honiara', timezone: 'Pacific/Guadalcanal', region: 'Oceania' },
    { label: 'Port Vila', timezone: 'Pacific/Efate', region: 'Oceania' },
    { label: 'Noumea', timezone: 'Pacific/Noumea', region: 'Oceania' },
    { label: 'Papeete', timezone: 'Pacific/Tahiti', region: 'Oceania' },
    { label: 'Apia', timezone: 'Pacific/Apia', region: 'Oceania' },
    { label: 'Nuku\'alofa', timezone: 'Pacific/Tongatapu', region: 'Oceania' },
    { label: 'Funafuti', timezone: 'Pacific/Funafuti', region: 'Oceania' },
    { label: 'Tarawa', timezone: 'Pacific/Tarawa', region: 'Oceania' },
    { label: 'Majuro', timezone: 'Pacific/Majuro', region: 'Oceania' },
    { label: 'Palikir', timezone: 'Pacific/Chuuk', region: 'Oceania' },
    { label: 'Ngerulmud', timezone: 'Pacific/Palau', region: 'Oceania' },
    { label: 'Yaren', timezone: 'Pacific/Nauru', region: 'Oceania' },
  ];

  // Filter timezones based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTimezones(allTimezones);
    } else {
      const filtered = allTimezones.filter(tz => 
        tz.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tz.timezone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tz.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTimezones(filtered);
    }
  }, [searchQuery]);

  // Initialize filtered timezones
  useEffect(() => {
    setFilteredTimezones(allTimezones);
  }, []);

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
    setSearchQuery(''); // Clear search when adding
  };

  // Group filtered timezones by region
  const groupedTimezones = filteredTimezones.reduce((acc, tz) => {
    if (!acc[tz.region]) {
      acc[tz.region] = [];
    }
    acc[tz.region].push(tz);
    return acc;
  }, {} as Record<string, TimezoneOption[]>);

  // Get available timezones (excluding local and already added ones)
  const availableTimezones = filteredTimezones.filter(
    ptz => ptz.timezone !== localTimezone && !timezones.some(tz => tz.timezone === ptz.timezone)
  );

  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-96 backdrop-blur-xl bg-black border border-white/30 rounded-xl p-4 shadow-2xl z-50 max-h-[550px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-sm drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
          Manage Timezones
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
        <div className="mb-4 flex-shrink-0">
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
        <div className="flex-1 flex flex-col min-h-0">
          <div className="text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            {timezones.length === 0 ? 'Add Timezones' : 'Add More'}
          </div>
          
          {/* Search Form */}
          <div className="relative mb-3 flex-shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search cities, countries, or regions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
            />
          </div>

          {/* Timezone List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {Object.entries(groupedTimezones).map(([region, regionTimezones]) => (
              <div key={region} className="mb-3">
                <div className="text-white/50 text-xs font-medium mb-1 px-1 sticky top-0 bg-black/80 backdrop-blur-sm py-1">
                  {region}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {regionTimezones
                    .filter(ptz => ptz.timezone !== localTimezone && !timezones.some(tz => tz.timezone === ptz.timezone))
                    .map((ptz, index) => (
                      <button
                        key={`${region}-${index}`}
                        onClick={() => handleAddTimezone(ptz.timezone, ptz.label)}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white text-xs transition-all duration-200 flex items-center space-x-2 text-left"
                      >
                        <Globe size={10} className="flex-shrink-0" />
                        <span className="truncate">{ptz.label}</span>
                      </button>
                    ))
                  }
                </div>
              </div>
            ))}
            
            {availableTimezones.length === 0 && (
              <div className="text-white/50 text-sm text-center py-4">
                {searchQuery ? `No timezones found matching "${searchQuery}"` : 'All timezones have been added'}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 pt-3 border-t border-white/10 flex-shrink-0">
            <div className="text-white/50 text-xs font-medium mb-2">
              Quick Add Popular
            </div>
            <div className="flex flex-wrap gap-1">
              {[
                { label: 'NYC', timezone: 'America/New_York' },
                { label: 'LA', timezone: 'America/Los_Angeles' },
                { label: 'London', timezone: 'Europe/London' },
                { label: 'Tokyo', timezone: 'Asia/Tokyo' },
                { label: 'Dubai', timezone: 'Asia/Dubai' },
                { label: 'Sydney', timezone: 'Australia/Sydney' }
              ]
                .filter(popular => popular.timezone !== localTimezone && !timezones.some(tz => tz.timezone === popular.timezone))
                .map((popular, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddTimezone(popular.timezone, popular.label)}
                    className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded text-blue-300 text-xs transition-all duration-200"
                  >
                    {popular.label}
                  </button>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-3 text-center flex-shrink-0">
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
