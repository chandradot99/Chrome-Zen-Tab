import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, Heart, Star, Download, Upload, FileText } from 'lucide-react';

interface ImportantDate {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  type: 'birthday' | 'anniversary' | 'other';
  days: number;
  color: string;
}

// Chrome storage helper
const DATES_STORAGE_KEY = 'zenTab_importantDates';

// Declare chrome types
declare const chrome: any;

const ImportantDatesManager: React.FC = () => {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [importData, setImportData] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    month: '',
    day: '',
    type: 'birthday' as 'birthday' | 'anniversary' | 'other'
  });

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

  const dateTypes = [
    { value: 'birthday', label: 'Birthday', icon: '🎂', emoji: '🎂', shortLabel: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary', icon: '💕', emoji: '💕', shortLabel: 'Anniversary' },
    { value: 'other', label: 'Important Date', icon: '⭐', emoji: '⭐', shortLabel: 'Other' }
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
        chrome.storage.sync.get([DATES_STORAGE_KEY], (result: any) => {
          if (result[DATES_STORAGE_KEY]) {
            const loadedDates = result[DATES_STORAGE_KEY].map((date: ImportantDate) => ({
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
        chrome.storage.sync.set({ [DATES_STORAGE_KEY]: datesToSave });
      }
      // Note: No localStorage fallback as per artifact requirements
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  const getDaysInMonth = (month: number) => {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return Array.from({ length: daysInMonth[month] }, (_, i) => i + 1);
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

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.month || !formData.day) {
      return;
    }

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

    // Reset form
    setFormData({ name: '', month: '', day: '', type: 'birthday' });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updatedDates = dates.filter(date => date.id !== id);
    setDates(updatedDates);
    saveDates(updatedDates);
  };

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${months[month - 1]} ${day}`;
  };

  const getUpcomingDatesCount = () => {
    return dates.filter(d => d.days <= 30).length;
  };

  const getTypeEmoji = (type: string) => {
    const typeInfo = dateTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.emoji : '📅';
  };

  const getTypeCounts = () => {
    const counts = { birthday: 0, anniversary: 0, other: 0 };
    dates.forEach(date => {
      counts[date.type]++;
    });
    return counts;
  };

  const exportToCSV = () => {
    if (dates.length === 0) {
      alert('No dates to export!');
      return;
    }

    const headers = ['Name', 'Type', 'Month', 'Day', 'Date'];
    const csvData = dates.map(date => {
      const [year, month, day] = date.date.split('-').map(Number);
      return [
        `"${date.name.replace(/"/g, '""')}"`, // Escape quotes in names
        date.type,
        months[month - 1],
        day,
        date.date
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `important-dates-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = () => {
    if (!importData.trim()) {
      alert('Please paste CSV data first!');
      return;
    }

    try {
      const lines = importData.trim().split('\n');
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
      
      const nameIndex = headers.findIndex(h => h.includes('name'));
      const typeIndex = headers.findIndex(h => h.includes('type'));
      const monthIndex = headers.findIndex(h => h.includes('month'));
      const dayIndex = headers.findIndex(h => h.includes('day'));
      const dateIndex = headers.findIndex(h => h.includes('date') && !h.includes('update'));

      if (nameIndex === -1) {
        alert('CSV must contain a "Name" column!');
        return;
      }

      const newDates: ImportantDate[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1'));
        
        if (row.length < 2) continue; // Skip empty rows
        
        const name = row[nameIndex]?.trim();
        if (!name) continue;

        let dateString = '';
        let type: 'birthday' | 'anniversary' | 'other' = 'other';

        // Get type
        if (typeIndex !== -1 && row[typeIndex]) {
          const typeValue = row[typeIndex].toLowerCase().trim();
          if (['birthday', 'anniversary', 'other'].includes(typeValue)) {
            type = typeValue as any;
          }
        }

        // Get date - prefer full date, fall back to month/day
        if (dateIndex !== -1 && row[dateIndex]) {
          dateString = row[dateIndex].trim();
        } else if (monthIndex !== -1 && dayIndex !== -1 && row[monthIndex] && row[dayIndex]) {
          const month = row[monthIndex].trim();
          const day = parseInt(row[dayIndex].trim());
          
          const monthNum = months.findIndex(m => m.toLowerCase().startsWith(month.toLowerCase())) + 1;
          if (monthNum > 0 && day >= 1 && day <= 31) {
            dateString = `2024-${monthNum.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          }
        }

        if (dateString && name) {
          // Validate date format
          if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            console.warn(`Invalid date format for ${name}: ${dateString}`);
            continue;
          }

          const newDate: ImportantDate = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name,
            type,
            date: dateString,
            days: calculateDaysUntilDate(dateString),
            color: colors[newDates.length % colors.length]
          };
          
          newDates.push(newDate);
        }
      }

      if (newDates.length === 0) {
        alert('No valid dates found in the CSV data!');
        return;
      }

      // Ask for confirmation
      const confirmImport = confirm(`Import ${newDates.length} dates? This will add to your existing dates.`);
      if (!confirmImport) return;

      const updatedDates = [...dates, ...newDates].sort((a, b) => a.days - b.days);
      setDates(updatedDates);
      saveDates(updatedDates);
      setImportData('');
      setShowImportPanel(false);
      
      alert(`Successfully imported ${newDates.length} dates!`);
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing CSV data. Please check the format and try again.');
    }
  };

  const getCSVTemplate = () => {
    return `Name,Type,Month,Day,Date
"John Doe",birthday,January,15,2024-01-15
"Wedding Anniversary",anniversary,June,20,2024-06-20
"Important Meeting",other,March,10,2024-03-10`;
  };

  // Get displayed dates (top 5 or all)
  const displayedDates = showAll ? dates : dates.slice(0, 5);
  const hasMoreDates = dates.length > 5;
  const typeCounts = getTypeCounts();

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Loading important dates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl mr-3">
            📅
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">Dates</h2>
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

      {/* Import Panel */}
      {showImportPanel && (
        <div className="mb-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_50%)]">
              Import CSV Data
            </h3>
            <button
              onClick={() => setShowImportPanel(false)}
              className="text-white/50 hover:text-white/80 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste CSV data here...

Format:
Name,Type,Month,Day,Date
&quot;John Doe&quot;,birthday,January,15,2024-01-15
&quot;Anniversary&quot;,anniversary,June,20,2024-06-20"
              className="w-full h-28 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 text-sm outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300 resize-none"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleImportCSV}
                disabled={!importData.trim()}
                className="flex-1 py-2 px-3 bg-blue-500/80 hover:bg-blue-600/80 disabled:bg-gray-500/50 text-white text-sm rounded-lg transition-colors disabled:cursor-not-allowed shadow-lg border border-white/20"
              >
                <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Import CSV</span>
              </button>
              <button
                onClick={() => {
                  const template = getCSVTemplate();
                  setImportData(template);
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-lg hover:bg-white/20 transition-colors shadow-lg"
              >
                <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Load Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Panel */}
      {showExportPanel && (
        <div className="mb-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_50%)]">
              Export CSV Data
            </h3>
            <button
              onClick={() => setShowExportPanel(false)}
              className="text-white/50 hover:text-white/80 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-white/70 text-sm drop-shadow-lg">
              Export {dates.length} dates to CSV file for backup or sharing
            </div>
            <button
              onClick={exportToCSV}
              className="w-full py-2 px-3 bg-green-500/80 hover:bg-green-600/80 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg border border-white/20"
            >
              <Download size={14} />
              <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Download CSV File</span>
            </button>
          </div>
        </div>
      )}

      {/* Dates List */}
      <div className="mb-4">
        {dates.length > 0 ? (
          <>
            {/* Top 5 or All Dates */}
            <div className="space-y-3">
              {displayedDates.map((date) => (
                <div key={date.id} className="group">
                  <div className={`backdrop-blur-sm bg-white/5 border rounded-xl p-4 hover:bg-white/10 transition-all duration-300 ${
                    date.days === 0 
                      ? 'border-yellow-400/50 bg-yellow-400/10' 
                      : date.days <= 7 
                        ? 'border-orange-400/30 bg-orange-400/5'
                        : 'border-white/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center mr-3">
                          <div className={`w-2 h-2 ${date.color} rounded-full mr-2`}></div>
                          <span className="text-lg">{getTypeEmoji(date.type)}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">{date.name}</div>
                          <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                            {formatDisplayDate(date.date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`font-semibold text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] ${
                            date.days === 0 
                              ? 'text-yellow-400' 
                              : date.days <= 7 
                                ? 'text-orange-400'
                                : 'text-white/90'
                          }`}>
                            {date.days === 0 ? 'Today! 🎉' : date.days}
                          </div>
                          {date.days > 0 && (
                            <div className="text-white/50 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                              {date.days === 1 ? 'day' : 'days'}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(date.id)}
                          className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 transition-all duration-200 p-1 drop-shadow-lg"
                          title="Delete date"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {hasMoreDates && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-3 py-2 px-4 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span className="text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                  {showAll ? 'Show Less' : `Show ${dates.length - 5} More`}
                </span>
                {showAll ? (
                  <ChevronUp size={16} className="drop-shadow-lg" />
                ) : (
                  <ChevronDown size={16} className="drop-shadow-lg" />
                )}
              </button>
            )}

            {/* Scrollable Area when showing all (if more than 8 total) */}
            {showAll && dates.length > 8 && (
              <div className="mt-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent space-y-3">
                {dates.slice(8).map((date) => (
                  <div key={date.id} className="group">
                    <div className={`backdrop-blur-sm bg-white/5 border rounded-xl p-4 hover:bg-white/10 transition-all duration-300 ${
                      date.days === 0 
                        ? 'border-yellow-400/50 bg-yellow-400/10' 
                        : date.days <= 7 
                          ? 'border-orange-400/30 bg-orange-400/5'
                          : 'border-white/10'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center mr-3">
                            <div className={`w-2 h-2 ${date.color} rounded-full mr-2`}></div>
                            <span className="text-lg">{getTypeEmoji(date.type)}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">{date.name}</div>
                            <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                              {formatDisplayDate(date.date)} • {dateTypes.find(t => t.value === date.type)?.label}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className={`font-semibold text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] ${
                              date.days === 0 
                                ? 'text-yellow-400' 
                                : date.days <= 7 
                                  ? 'text-orange-400'
                                  : 'text-white/90'
                            }`}>
                              {date.days === 0 ? 'Today! 🎉' : date.days}
                            </div>
                            {date.days > 0 && (
                              <div className="text-white/50 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                                {date.days === 1 ? 'day' : 'days'}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(date.id)}
                            className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 transition-all duration-200 p-1 drop-shadow-lg"
                            title="Delete date"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-white/40 text-sm mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">No important dates added yet</div>
            <div className="text-white/30 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Add birthdays, anniversaries, and other special dates!</div>
          </div>
        )}
      </div>

      {/* Add Form */}
      {showAddForm ? (
        <div className="space-y-4">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="space-y-4">
              {/* Type Selector */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Date Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {dateTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as any })}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        formData.type === type.value
                          ? 'bg-white/25 border-white/50 text-white shadow-lg'
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/15 hover:border-white/30'
                      }`}
                    >
                      <div className="text-2xl">{type.icon}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                  {formData.type === 'birthday' ? 'Person\'s Name' : formData.type === 'anniversary' ? 'Event Name' : 'Event Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={
                    formData.type === 'birthday' ? 'e.g. John Smith' : 
                    formData.type === 'anniversary' ? 'e.g. Wedding Anniversary' : 
                    'e.g. Project Deadline'
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300 shadow-inner"
                  required
                  autoFocus
                />
              </div>

              {/* Date Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value, day: '' })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300 shadow-inner"
                    required
                  >
                    <option value="" className="bg-gray-800">Select</option>
                    {months.map((month) => (
                      <option key={month} value={month} className="bg-gray-800">
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Day</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300 shadow-inner"
                    required
                    disabled={!formData.month}
                  >
                    <option value="" className="bg-gray-800">Select</option>
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
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.month || !formData.day}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-white/20 drop-shadow-lg"
              >
                <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Add Date</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', month: '', day: '', type: 'birthday' });
                }}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg drop-shadow-lg"
              >
                <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Cancel</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 px-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300 shadow-lg drop-shadow-lg"
          >
            <span className="mr-2 drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">+</span> 
            <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Add Date</span>
          </button>

          {/* Import/Export Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowImportPanel(!showImportPanel);
                setShowExportPanel(false); // Close export panel if open
              }}
              className="flex-1 py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg drop-shadow-lg"
            >
              <Upload size={16} />
              <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Import CSV</span>
            </button>
            
            {dates.length > 0 && (
              <button
                onClick={() => {
                  setShowExportPanel(!showExportPanel);
                  setShowImportPanel(false); // Close import panel if open
                }}
                className="flex-1 py-3 px-4 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg drop-shadow-lg"
              >
                <Download size={16} />
                <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Export CSV</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportantDatesManager;