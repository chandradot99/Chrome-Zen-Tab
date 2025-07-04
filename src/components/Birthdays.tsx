import React, { useState, useEffect } from 'react';
import { useBirthdayNotifications } from '../hooks/useBirthdayNotifications';

interface Birthday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  days: number;
  color: string;
}

// Chrome storage helper
const BIRTHDAY_STORAGE_KEY = 'zenTab_birthdays';

// Declare chrome types
declare const chrome: any;

const BirthdayManager: React.FC = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    month: '',
    day: ''
  });

  // Initialize notifications
  const { requestNotificationPermission } = useBirthdayNotifications(birthdays);

  const colors = [
    'bg-gradient-to-r from-pink-500 to-rose-500',
    'bg-gradient-to-r from-purple-500 to-indigo-500',
    'bg-gradient-to-r from-blue-500 to-cyan-500',
    'bg-gradient-to-r from-green-500 to-emerald-500',
    'bg-gradient-to-r from-yellow-500 to-orange-500',
    'bg-gradient-to-r from-red-500 to-pink-500',
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load birthdays and check notification permission on component mount
  useEffect(() => {
    loadBirthdays();
    checkNotificationPermission();
  }, []);

  // Recalculate days until birthday daily
  useEffect(() => {
    const updateDays = () => {
      setBirthdays(prev => 
        prev.map(birthday => ({
          ...birthday,
          days: calculateDaysUntilBirthday(birthday.date)
        })).sort((a, b) => a.days - b.days)
      );
    };

    if (birthdays.length > 0) {
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
  }, [birthdays.length]);

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

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  };

  const loadBirthdays = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([BIRTHDAY_STORAGE_KEY], (result: any) => {
          if (result[BIRTHDAY_STORAGE_KEY]) {
            const loadedBirthdays = result[BIRTHDAY_STORAGE_KEY].map((birthday: Birthday) => ({
              ...birthday,
              days: calculateDaysUntilBirthday(birthday.date)
            })).sort((a: Birthday, b: Birthday) => a.days - b.days);
            setBirthdays(loadedBirthdays);
          }
          setIsLoading(false);
        });
      } else {
        // Fallback to localStorage for development
        const stored = localStorage.getItem(BIRTHDAY_STORAGE_KEY);
        if (stored) {
          const loadedBirthdays = JSON.parse(stored).map((birthday: Birthday) => ({
            ...birthday,
            days: calculateDaysUntilBirthday(birthday.date)
          })).sort((a: Birthday, b: Birthday) => a.days - b.days);
          setBirthdays(loadedBirthdays);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading birthdays:', error);
      setIsLoading(false);
    }
  };

  const saveBirthdays = (birthdaysToSave: Birthday[]) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [BIRTHDAY_STORAGE_KEY]: birthdaysToSave });
      } else {
        localStorage.setItem(BIRTHDAY_STORAGE_KEY, JSON.stringify(birthdaysToSave));
      }
    } catch (error) {
      console.error('Error saving birthdays:', error);
    }
  };

  const getDaysInMonth = (month: number) => {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return Array.from({ length: daysInMonth[month] }, (_, i) => i + 1);
  };

  const calculateDaysUntilBirthday = (dateString: string): number => {
    const today = new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    
    let birthdayThisYear = new Date(today.getFullYear(), month - 1, day);
    
    // If birthday already passed this year, calculate for next year
    if (birthdayThisYear < today) {
      birthdayThisYear = new Date(today.getFullYear() + 1, month - 1, day);
    }
    
    const diffTime = birthdayThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.month || !formData.day) {
      return;
    }

    const monthIndex = months.indexOf(formData.month) + 1;
    const dateString = `2024-${monthIndex.toString().padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
    const daysUntil = calculateDaysUntilBirthday(dateString);
    
    const newBirthday: Birthday = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      date: dateString,
      days: daysUntil,
      color: colors[birthdays.length % colors.length]
    };

    const updatedBirthdays = [...birthdays, newBirthday].sort((a, b) => a.days - b.days);
    setBirthdays(updatedBirthdays);
    saveBirthdays(updatedBirthdays);

    // Reset form
    setFormData({ name: '', month: '', day: '' });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updatedBirthdays = birthdays.filter(birthday => birthday.id !== id);
    setBirthdays(updatedBirthdays);
    saveBirthdays(updatedBirthdays);
  };

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${months[month - 1]} ${day}`;
  };

  const getUpcomingBirthdaysCount = () => {
    return birthdays.filter(b => b.days <= 30).length;
  };

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60">Loading birthdays...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-xl mr-3">
            🎂
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Birthdays</h2>
            {getUpcomingBirthdaysCount() > 0 && (
              <div className="text-white/60 text-xs">
                {getUpcomingBirthdaysCount()} coming up this month
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          {birthdays.length > 0 && (
            <div className="text-white/60 text-sm mb-1">
              {birthdays.length} saved
            </div>
          )}
          {!notificationsEnabled && (
            <button
              onClick={handleEnableNotifications}
              className="text-yellow-400 hover:text-yellow-300 text-xs transition-colors"
              title="Enable birthday notifications"
            >
              🔔 Enable alerts
            </button>
          )}
          {notificationsEnabled && (
            <div className="text-green-400 text-xs flex items-center">
              ✅ Alerts on
            </div>
          )}
        </div>
      </div>

      {/* Birthday List */}
      <div className="space-y-3 mb-4">
        {birthdays.length > 0 ? (
          birthdays.map((birthday) => (
            <div key={birthday.id} className="group">
              <div className={`backdrop-blur-sm bg-white/5 border rounded-xl p-4 hover:bg-white/10 transition-all duration-300 ${
                birthday.days === 0 
                  ? 'border-yellow-400/50 bg-yellow-400/10' 
                  : birthday.days <= 7 
                    ? 'border-orange-400/30 bg-orange-400/5'
                    : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 ${birthday.color} rounded-full mr-3`}></div>
                    <div>
                      <div className="text-white font-medium">{birthday.name}</div>
                      <div className="text-white/60 text-sm">{formatDisplayDate(birthday.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`font-semibold text-sm ${
                        birthday.days === 0 
                          ? 'text-yellow-400' 
                          : birthday.days <= 7 
                            ? 'text-orange-400'
                            : 'text-white/90'
                      }`}>
                        {birthday.days === 0 ? 'Today! 🎉' : birthday.days}
                      </div>
                      {birthday.days > 0 && (
                        <div className="text-white/50 text-xs">
                          {birthday.days === 1 ? 'day' : 'days'}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(birthday.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 transition-all duration-200 p-1"
                      title="Delete birthday"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-white/40 text-sm mb-2">No birthdays added yet</div>
            <div className="text-white/30 text-xs">Add some to get started!</div>
          </div>
        )}
      </div>

      {/* Add Form */}
      {showAddForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                  required
                  autoFocus
                />
              </div>

              {/* Date Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value, day: '' })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                    required
                  >
                    <option value="" className="bg-gray-800">Select month</option>
                    {months.map((month) => (
                      <option key={month} value={month} className="bg-gray-800">
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Day</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                    required
                    disabled={!formData.month}
                  >
                    <option value="" className="bg-gray-800">Select day</option>
                    {formData.month && getDaysInMonth(months.indexOf(formData.month)).map((day) => (
                      <option key={day} value={day.toString()} className="bg-gray-800">
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 mt-4">
              <button
                type="submit"
                disabled={!formData.name.trim() || !formData.month || !formData.day}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Birthday
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', month: '', day: '' });
                }}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 px-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300"
        >
          <span className="mr-2">+</span> Add Birthday
        </button>
      )}
    </div>
  );
};

export default BirthdayManager;