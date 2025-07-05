import React, { useState } from 'react';
import { X } from 'lucide-react';

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
    
    // For birthdays and anniversaries, go back further
    const startYear = formData.type === 'other' ? currentYear - 10 : 1900;
    const endYear = currentYear + (formData.type === 'other' ? 10 : 5);
    
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  const getDaysInMonth = (monthIndex: number, year?: number) => {
    const currentYear = year || new Date().getFullYear();
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Handle leap year for February
    if (monthIndex === 1) { // February
      const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
      return Array.from({ length: isLeapYear ? 29 : 28 }, (_, i) => i + 1);
    }
    
    return Array.from({ length: daysInMonth[monthIndex] }, (_, i) => i + 1);
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

  const selectedMonthIndex = formData.month ? months.indexOf(formData.month) : -1;
  const selectedYear = formData.year ? parseInt(formData.year) : undefined;

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
                onClick={() => setFormData({ ...formData, type: type.value as any, year: '' })}
                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  formData.type === type.value
                    ? 'bg-white/20 border-white/40 text-white shadow-lg'
                    : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                }`}
                title={type.description}
              >
                <div className="text-lg mb-1">{type.icon}</div>
                <div className="text-xs">{type.label}</div>
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
              formData.type === 'birthday' ? 'e.g. John Smith' : 
              formData.type === 'anniversary' ? 'e.g. Wedding Anniversary' : 
              'e.g. Project Launch'
            }
            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
            required
            autoFocus
            maxLength={50}
          />
        </div>

        {/* Date Selectors */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              Month
            </label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value, day: '' })}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
              required
            >
              <option value="" className="bg-gray-800">Month</option>
              {months.map((month) => (
                <option key={month} value={month} className="bg-gray-800">
                  {month.substr(0, 3)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              Day
            </label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
              required
              disabled={!formData.month}
            >
              <option value="" className="bg-gray-800">Day</option>
              {selectedMonthIndex >= 0 && getDaysInMonth(selectedMonthIndex, selectedYear).map((day) => (
                <option key={day} value={day.toString()} className="bg-gray-800">
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-xs font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value, day: '' })}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
              required
            >
              <option value="" className="bg-gray-800">Year</option>
              {generateYearOptions().map((year) => (
                <option key={year} value={year.toString()} className="bg-gray-800">
                  {year}
                </option>
              ))}
            </select>
          </div>
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
            ? 'Include birth year for accurate age tracking'
            : formData.type === 'anniversary' 
              ? 'Include start year to track anniversary milestones'
              : 'Use year for better organization and context'
          }
        </div>
      </div>
    </div>
  );
};

export default DateForm;