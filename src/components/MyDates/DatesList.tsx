import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ImportantDate {
  id: string;
  name: string;
  date: string;
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

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${months[month - 1]} ${day}`;
  };

  const getTypeEmoji = (type: string) => {
    const typeInfo = dateTypes.find(t => t.value === type);
    return typeInfo ? typeInfo.emoji : '📅';
  };

  // Get displayed dates (top 5 or all)
  const displayedDates = showAll ? dates : dates.slice(0, 5);
  const hasMoreDates = dates.length > 5;

  const renderDateItem = (date: ImportantDate, showTypeLabel = false) => (
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
              <div className="text-white font-medium drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                {date.name}
              </div>
              <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
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
              onClick={() => onDelete(date.id)}
              className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 transition-all duration-200 p-1 drop-shadow-lg"
              title="Delete date"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (dates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-white/40 text-sm mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          No important dates added yet
        </div>
        <div className="text-white/30 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          Add birthdays, anniversaries, and other special dates!
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* Top 5 or All Dates */}
      <div className="space-y-3">
        {displayedDates.map((date) => renderDateItem(date))}
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
          {dates.slice(8).map((date) => renderDateItem(date, true))}
        </div>
      )}
    </div>
  );
};

export default DatesList;
