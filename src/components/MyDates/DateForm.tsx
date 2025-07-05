import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateFormData {
  name: string;
  month: string;
  day: string;
  year: string;
  type: 'birthday' | 'anniversary' | 'other';
}

interface DateFormProps {
  onSubmit: (formData: DateFormData) => void;
  onCancel: () => void;
}

const DateForm: React.FC<DateFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<DateFormData>({
    name: '',
    month: '',
    day: '',
    year: '',
    type: 'birthday'
  });
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateTypes = [
    { value: 'birthday', label: 'Birthday', icon: '🎂', description: 'Person\'s birthday' },
    { value: 'anniversary', label: 'Anniversary', icon: '💕', description: 'Wedding, relationship milestone' },
    { value: 'other', label: 'Important Date', icon: '⭐', description: 'Special events, deadlines' }
  ];

  // Generate year options (from 1900 to current year + 10)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    const startYear = formData.type === 'other' ? currentYear - 10 : 1900;
    const endYear = currentYear + (formData.type === 'other' ? 10 : 5);
    
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Handle leap year for February
    if (month === 1) { // February (0-indexed)
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      return isLeapYear ? 29 : 28;
    }
    
    return daysInMonth[month];
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const month = months[calendarMonth];
    const year = calendarYear.toString();
    
    setFormData({
      ...formData,
      month,
      day: day.toString(),
      year
    });
    setShowCalendar(false);
  };

  const handleQuickYearSelect = (year: string) => {
    setCalendarYear(parseInt(year));
    setFormData({ ...formData, year });
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.month || !formData.day || !formData.year) {
      return;
    }
    onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData({ name: '', month: '', day: '', year: '', type: 'birthday' });
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.name.trim() && formData.month && formData.day && formData.year) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
    const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = formData.day === day.toString() && 
                        formData.month === months[calendarMonth] && 
                        formData.year === calendarYear.toString();
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSelected
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const formatSelectedDate = () => {
    if (formData.month && formData.day && formData.year) {
      return `${formData.month} ${formData.day}, ${formData.year}`;
    }
    return 'Select date';
  };

  // Set initial calendar to selected date or reasonable default
  useEffect(() => {
    if (formData.month && formData.year) {
      setCalendarMonth(months.indexOf(formData.month));
      setCalendarYear(parseInt(formData.year));
    } else {
      // Set reasonable defaults based on type
      const currentYear = new Date().getFullYear();
      if (formData.type === 'birthday') {
        setCalendarYear(currentYear - 25); // Default to 25 years ago for birthdays
      } else if (formData.type === 'anniversary') {
        setCalendarYear(currentYear - 5); // Default to 5 years ago for anniversaries
      } else {
        setCalendarYear(currentYear); // Default to current year for other events
      }
    }
  }, [formData.type]);

  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
          Add Important Date
        </h3>
        <button
          onClick={handleCancel}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Type Selector */}
        <div>
          <label className="block text-white/70 text-xs font-medium mb-3 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            Date Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {dateTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: type.value as any })}
                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  formData.type === type.value
                    ? 'bg-white/20 border-white/40 text-white shadow-lg'
                    : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                }`}
                title={type.description}
              >
                <div className="text-xl mb-1">{type.icon}</div>
                {/* <div className="text-xs">{type.label}</div> */}
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            {formData.type === 'birthday' ? 'Person\'s Name' : formData.type === 'anniversary' ? 'Event Name' : 'Event Name'}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder={
              formData.type === 'birthday' ? 'e.g. Chandra Shekhar' : 
              formData.type === 'anniversary' ? 'e.g. Wedding Anniversary' : 
              'e.g. Project Launch'
            }
            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
            required
            autoFocus
            maxLength={50}
          />
        </div>

        {/* Date Selector */}
        <div>
          <label className="block text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            Date
          </label>
          
          {/* Date Input Button */}
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-left text-white hover:bg-white/15 hover:border-white/40 transition-all duration-300 flex items-center justify-between"
          >
            <span className={formData.month && formData.day && formData.year ? 'text-white' : 'text-white/50'}>
              {formatSelectedDate()}
            </span>
            <Calendar size={16} className="text-white/60" />
          </button>

          {/* Calendar Popup */}
          {showCalendar && (
            <div className="mt-2 p-4 bg-white/10 border border-white/20 rounded-lg">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    if (calendarMonth === 0) {
                      setCalendarMonth(11);
                      setCalendarYear(calendarYear - 1);
                    } else {
                      setCalendarMonth(calendarMonth - 1);
                    }
                  }}
                  className="p-1 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="text-center">
                  <div className="text-white font-medium">{months[calendarMonth]} {calendarYear}</div>
                </div>
                
                <button
                  onClick={() => {
                    if (calendarMonth === 11) {
                      setCalendarMonth(0);
                      setCalendarYear(calendarYear + 1);
                    } else {
                      setCalendarMonth(calendarMonth + 1);
                    }
                  }}
                  className="p-1 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Quick Year Selector */}
              <div className="mb-4">
                <select
                  value={calendarYear}
                  onChange={(e) => handleQuickYearSelect(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm outline-none focus:bg-white/15 focus:border-white/40"
                >
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year.toString()} className="bg-gray-800">
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="w-8 h-8 flex items-center justify-center text-white/60 text-xs font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>

              {/* Calendar Actions */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="flex-1 py-2 px-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    setCalendarMonth(today.getMonth());
                    setCalendarYear(today.getFullYear());
                    handleDateSelect(today.getDate());
                  }}
                  className="flex-1 py-2 px-3 bg-blue-500/30 border border-blue-400/30 rounded-lg text-white text-sm hover:bg-blue-500/40 transition-all duration-300"
                >
                  Today
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        {formData.name && formData.month && formData.day && formData.year && (
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-white/60 text-xs mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              Preview:
            </div>
            <div className="text-white text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              <span className="font-medium">{formData.name}</span>
              <span className="text-white/70 ml-2">
                • {formData.month} {formData.day}, {formData.year}
              </span>
              {formData.type === 'birthday' && (
                <span className="text-white/60 ml-2">
                  (Age: {new Date().getFullYear() - parseInt(formData.year)})
                </span>
              )}
              {formData.type === 'anniversary' && (
                <span className="text-white/60 ml-2">
                  ({new Date().getFullYear() - parseInt(formData.year)} years)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim() || !formData.month || !formData.day || !formData.year}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/30 rounded-xl text-white font-medium hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Add Date</span>
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300 shadow-lg"
          >
            <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Cancel</span>
          </button>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-center">
        <div className="text-white/30 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          {formData.type === 'birthday' 
            ? 'Click the date field to open calendar for easy date selection'
            : formData.type === 'anniversary' 
              ? 'Select the start date of your anniversary'
              : 'Choose the date for your important event'
          }
        </div>
      </div>
    </div>
  );
};

export default DateForm;