import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface ImportantDate {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  type: 'birthday' | 'anniversary' | 'other';
  days: number;
  color: string;
}

interface DatesListProps {
  dates: ImportantDate[];
  onDelete: (id: string) => void;
}

const DatesList: React.FC<DatesListProps> = ({ dates, onDelete }) => {
  const [showAll, setShowAll] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateTypes = [
    { value: 'birthday', label: 'Birthday', emoji: '🎂' },
    { value: 'anniversary', label: 'Anniversary', emoji: '💕' },
    { value: 'other', label: 'Important Date', emoji: '⭐' }
  ];

  // Enhanced date calculation for yearly reminders
  const calculateDaysUntilDate = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Create date for this year
    let targetDate = new Date(today.getFullYear(), month - 1, day);
    targetDate.setHours(0, 0, 0, 0);
    
    // If the date has already passed this year, move to next year
    if (targetDate < today) {
      targetDate = new Date(today.getFullYear() + 1, month - 1, day);
      targetDate.setHours(0, 0, 0, 0);
    }
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${months[month - 1]} ${day}`;
  };

  const getTypeEmoji = (type: string) => {
    const typeInfo = dateTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.emoji : '📅';
  };

  const formatTimeUntil = (days: number) => {
    if (days === 0) return 'Today! 🎉';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `${days} days`;
    if (days <= 30) return `${days} days`;
    if (days <= 60) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  };

  // Calculate age or years for anniversaries
  const calculateYearsInfo = (dateString: string, type: string): string => {
    const [originalYear, month, day] = dateString.split('-').map(Number);
    const currentYear = new Date().getFullYear();
    const years = currentYear - originalYear;
    
    if (type === 'birthday' && years > 0) {
      return `Turning ${years + 1}`;
    } else if (type === 'anniversary' && years > 0) {
      return `${years + 1} years`;
    }
    return '';
  };

  // Get displayed dates with recalculated days
  const datesWithUpdatedDays = dates.map(date => ({
    ...date,
    days: calculateDaysUntilDate(date.date)
  })).sort((a, b) => a.days - b.days);

  const displayedDates = showAll ? datesWithUpdatedDays : datesWithUpdatedDays.slice(0, 3);
  const hasMoreDates = datesWithUpdatedDays.length > 3;

  const renderDateItem = (date: ImportantDate, showTypeLabel = false) => {
    return (
      <div key={date.id} className="group relative">
        <div className={`bg-white/5 border rounded-xl p-3 hover:bg-white/10 transition-all duration-300 relative ${
          date.days === 0 
            ? 'border-yellow-400/50 bg-yellow-400/10' 
            : date.days <= 7 
              ? 'border-orange-400/30 bg-orange-400/5'
              : 'border-white/10'
        }`}>
          {/* Close button - positioned absolutely */}
          <button
            onClick={() => onDelete(date.id)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center text-xs shadow-lg z-10"
            title="Delete date"
          >
            <X size={12} />
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              <div className="flex items-center mr-3 flex-shrink-0">
                <span className="text-lg">{getTypeEmoji(date.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] truncate">
                  {date.name}
                </div>
                <div className="text-white/60 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] truncate">
                  {formatDisplayDate(date.date)}
                  {showTypeLabel && (
                    <>
                      {' • '}
                      {dateTypes.find(t => t.value === date.type)?.label}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <div className={`font-semibold text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] ${
                date.days === 0 
                  ? 'text-yellow-400' 
                  : date.days <= 7 
                    ? 'text-orange-400'
                    : 'text-white/90'
              }`}>
                {formatTimeUntil(date.days)}
              </div>
              {date.days > 0 && (
                <div className="text-white/50 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                  away
                </div>
              )}
            </div>
          </div>
          
          {/* Age/Anniversary info for upcoming dates */}
          {date.days <= 14 && date.days > 0 && calculateYearsInfo(date.date, date.type) && (
            <div className="mt-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Upcoming</span>
                <span className="text-white/70 font-medium">
                  {calculateYearsInfo(date.date, date.type)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (datesWithUpdatedDays.length === 0) {
    return (
      <div className="text-center py-8 mb-4">
        <div className="text-white/50 mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          No important dates added yet
        </div>
        <div className="text-white/30 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          Add birthdays, anniversaries, and other special dates!
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* Dates List */}
      <div className="space-y-3">
        {displayedDates.map((date) => renderDateItem(date, showAll))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreDates && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 px-4 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span className="text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            {showAll ? 'Show Less' : `Show ${datesWithUpdatedDays.length - 3} More`}
          </span>
          {showAll ? (
            <ChevronUp size={16} className="drop-shadow-lg" />
          ) : (
            <ChevronDown size={16} className="drop-shadow-lg" />
          )}
        </button>
      )}
    </div>
  );
};

export default DatesList;
