import React, { useState, useEffect } from 'react';
import DateForm from './DateForm';
import ImportExportPanel from './ImportExportPanel';
import DatesList from './DatesList';
import { STORAGE_KEYS } from '../../utils/constants';
import { Calendar } from 'lucide-react';

interface ImportantDate {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  type: 'birthday' | 'anniversary' | 'other';
  days: number;
  color: string;
}

interface DateFormData {
  name: string;
  month: string;
  day: string;
  type: 'birthday' | 'anniversary' | 'other';
}

// Declare chrome types
declare const chrome: any;

const MyDates: React.FC = () => {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const colors = [
    'bg-gradient-to-r from-pink-500 to-rose-500',
    'bg-gradient-to-r from-purple-500 to-indigo-500',
    'bg-gradient-to-r from-blue-500 to-cyan-500',
    'bg-gradient-to-r from-green-500 to-emerald-500',
    'bg-gradient-to-r from-yellow-500 to-orange-500',
    'bg-gradient-to-r from-red-500 to-pink-500',
    'bg-gradient-to-r from-indigo-500 to-purple-500',
    'bg-gradient-to-r from-cyan-500 to-blue-500',
    'bg-gradient-to-r from-emerald-500 to-green-500',
    'bg-gradient-to-r from-orange-500 to-red-500',
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load dates and check notification permission on component mount
  useEffect(() => {
    loadDates();
    checkNotificationPermission();
  }, []);

  // Recalculate days until date daily
  useEffect(() => {
    const updateDays = () => {
      setDates(prev => 
        prev.map(date => ({
          ...date,
          days: calculateDaysUntilDate(date.date)
        })).sort((a, b) => a.days - b.days)
      );
    };

    if (dates.length > 0) {
      updateDays();

      // Set up daily update at midnight
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      
      const timeoutId = setTimeout(() => {
        updateDays();
        // Then set up daily interval
        const intervalId = setInterval(updateDays, 24 * 60 * 60 * 1000);
        return () => clearInterval(intervalId);
      }, msUntilMidnight);

      return () => clearTimeout(timeoutId);
    }
  }, [dates.length]);

  const checkNotificationPermission = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.notifications) {
        setNotificationsEnabled(true);
      } else if ('Notification' in window) {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.notifications) {
        setNotificationsEnabled(true);
        return true;
      } else if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        setNotificationsEnabled(granted);
        return granted;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
    return false;
  };

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
  };

  const loadDates = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([STORAGE_KEYS.IMPORTANT_DATES], (result: any) => {
          if (result[STORAGE_KEYS.IMPORTANT_DATES]) {
            const loadedDates = result[STORAGE_KEYS.IMPORTANT_DATES].map((date: ImportantDate) => ({
              ...date,
              days: calculateDaysUntilDate(date.date)
            })).sort((a: ImportantDate, b: ImportantDate) => a.days - b.days);
            setDates(loadedDates);
          }
          setIsLoading(false);
        });
      } else {
        // Fallback to in-memory storage for development
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading dates:', error);
      setIsLoading(false);
    }
  };

  const saveDates = (datesToSave: ImportantDate[]) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [STORAGE_KEYS.IMPORTANT_DATES]: datesToSave });
      }
      // Note: No localStorage fallback as per artifact requirements
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  const calculateDaysUntilDate = (dateString: string): number => {
    const today = new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    
    let dateThisYear = new Date(today.getFullYear(), month - 1, day);
    
    // If date already passed this year, calculate for next year
    if (dateThisYear < today) {
      dateThisYear = new Date(today.getFullYear() + 1, month - 1, day);
    }
    
    const diffTime = dateThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const handleFormSubmit = (formData: DateFormData) => {
    const monthIndex = months.indexOf(formData.month) + 1;
    const dateString = `2024-${monthIndex.toString().padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
    const daysUntil = calculateDaysUntilDate(dateString);
    
    const newDate: ImportantDate = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      date: dateString,
      type: formData.type,
      days: daysUntil,
      color: colors[dates.length % colors.length]
    };

    const updatedDates = [...dates, newDate].sort((a, b) => a.days - b.days);
    setDates(updatedDates);
    saveDates(updatedDates);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updatedDates = dates.filter(date => date.id !== id);
    setDates(updatedDates);
    saveDates(updatedDates);
  };

  const handleImport = (newDates: ImportantDate[]) => {
    const updatedDates = [...dates, ...newDates].sort((a, b) => a.days - b.days);
    setDates(updatedDates);
    saveDates(updatedDates);
  };

  const getUpcomingDatesCount = () => {
    return dates.filter(d => d.days <= 30).length;
  };

  const getTypeCounts = () => {
    const counts = { birthday: 0, anniversary: 0, other: 0 };
    dates.forEach(date => {
      counts[date.type]++;
    });
    return counts;
  };

  const typeCounts = getTypeCounts();

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-4 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            Loading important dates...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              My Dates
            </h2>
            {getUpcomingDatesCount() > 0 ? (
              <div className="text-white/60 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                {getUpcomingDatesCount()} coming up this month
              </div>
            ) : dates.length > 0 ? (
              <div className="text-white/60 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                {typeCounts.birthday > 0 && `${typeCounts.birthday} 🎂`}
                {typeCounts.birthday > 0 && typeCounts.anniversary > 0 && ' • '}
                {typeCounts.anniversary > 0 && `${typeCounts.anniversary} 💕`}
                {(typeCounts.birthday > 0 || typeCounts.anniversary > 0) && typeCounts.other > 0 && ' • '}
                {typeCounts.other > 0 && `${typeCounts.other} ⭐`}
              </div>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          {dates.length > 0 && (
            <div className="text-white/60 text-sm mb-1 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              {dates.length} saved
            </div>
          )}
          {dates.length === 0 && (
            <div className="text-white/60 text-sm mb-1 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              0 saved
            </div>
          )}
          {!notificationsEnabled && (
            <button
              onClick={handleEnableNotifications}
              className="text-yellow-400 hover:text-yellow-300 text-xs transition-colors drop-shadow-lg"
              title="Enable date notifications"
            >
              🔔 Enable alerts
            </button>
          )}
          {notificationsEnabled && (
            <div className="text-green-400 text-xs flex items-center drop-shadow-lg">
              ✅ Alerts on
            </div>
          )}
        </div>
      </div>

      {/* Dates List */}
      <DatesList dates={dates} onDelete={handleDelete} />

      {/* Add Form or Add Button */}
      {showAddForm ? (
        <DateForm onSubmit={handleFormSubmit} onCancel={() => setShowAddForm(false)} />
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 px-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300 shadow-lg drop-shadow-lg"
          >
            <span className="mr-2 drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">+</span> 
            <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Add Date</span>
          </button>
        </div>
      )}

      {/* Import/Export Panel */}
      {!showAddForm && (
        <ImportExportPanel
          dates={dates}
          onImport={handleImport}
          colors={colors}
          calculateDaysUntilDate={calculateDaysUntilDate}
        />
      )}
    </div>
  );
};

export default MyDates;