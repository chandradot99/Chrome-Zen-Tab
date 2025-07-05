import React, { useState } from 'react';

interface DateFormData {
  name: string;
  month: string;
  day: string;
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
    type: 'birthday'
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateTypes = [
    { value: 'birthday', label: 'Birthday', icon: '🎂' },
    { value: 'anniversary', label: 'Anniversary', icon: '💕' },
    { value: 'other', label: 'Important Date', icon: '⭐' }
  ];

  const getDaysInMonth = (month: number) => {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return Array.from({ length: daysInMonth[month] }, (_, i) => i + 1);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.month || !formData.day) {
      return;
    }
    onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData({ name: '', month: '', day: '', type: 'birthday' });
    onCancel();
  };

  return (
    <div className="space-y-4">
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="space-y-4">
          {/* Type Selector */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              Date Type
            </label>
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
              <label className="block text-white/80 text-sm font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                Month
              </label>
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
              <label className="block text-white/80 text-sm font-medium mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                Day
              </label>
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
            onClick={handleCancel}
            className="px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg drop-shadow-lg"
          >
            <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateForm;