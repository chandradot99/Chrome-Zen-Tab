import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Upload, Download, X, Heart, Gift, Star } from 'lucide-react';

interface ImportantDate {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  type: 'birthday' | 'anniversary' | 'other';
  days: number;
  color: string;
}

const ImportExportPanel: React.FC<{ dates: ImportantDate[], onImport: (dates: ImportantDate[]) => void, colors: string[], calculateDaysUntilDate: (date: string) => number }> = ({ dates, onImport, colors, calculateDaysUntilDate }) => {
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [importData, setImportData] = useState<string>('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const exportToCSV = () => {
    if (dates.length === 0) {
      alert('No dates to export!');
      return;
    }

    const headers = ['Name', 'Type', 'Month', 'Day', 'Date'];
    const csvData = dates.map(date => {
      const [year, month, day] = date.date.split('-').map(Number);
      return [
        `"${date.name.replace(/"/g, '""')}"`,
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
    setShowExportPanel(false);
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
      if (nameIndex === -1) {
        alert('CSV must contain a "Name" column!');
        return;
      }

      const newDates: ImportantDate[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1'));
        
        const name = row[nameIndex]?.trim();
        if (!name) continue;

        const newDate: ImportantDate = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name,
          type: 'other',
          date: '2024-01-01',
          days: calculateDaysUntilDate('2024-01-01'),
          color: colors[newDates.length % colors.length]
        };
        
        newDates.push(newDate);
      }

      if (newDates.length === 0) {
        alert('No valid dates found!');
        return;
      }

      onImport(newDates);
      setImportData('');
      setShowImportPanel(false);
      
      alert(`Successfully imported ${newDates.length} dates!`);
    } catch (error) {
      alert('Error importing CSV data. Please check the format and try again.');
    }
  };

  return (
    <div className="mt-4">
      {/* Import Panel */}
      {showImportPanel && (
        <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              Import CSV Data
            </h3>
            <button
              onClick={() => setShowImportPanel(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste CSV data here..."
              className="w-full h-28 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 text-sm outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300 resize-none"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleImportCSV}
                disabled={!importData.trim()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500/20 to-blue-500/30 border border-blue-400/30 rounded-xl text-white font-medium hover:from-blue-500/30 hover:to-blue-500/40 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Import CSV</span>
              </button>
              <button
                onClick={() => setImportData('Name,Type,Date\n"John Doe",birthday,2024-01-15')}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300 shadow-lg"
              >
                <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Load Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Panel */}
      {showExportPanel && (
        <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              Export CSV Data
            </h3>
            <button
              onClick={() => setShowExportPanel(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-white/70 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              Export {dates.length} dates to CSV file for backup or sharing
            </div>
            <button
              onClick={exportToCSV}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500/20 to-green-500/30 border border-green-400/30 rounded-xl text-white font-medium hover:from-green-500/30 hover:to-green-500/40 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Download size={16} />
              <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Download CSV File</span>
            </button>
          </div>
        </div>
      )}

      {/* Import/Export Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => {
            setShowImportPanel(!showImportPanel);
            setShowExportPanel(false);
          }}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500/20 to-blue-500/30 border border-blue-400/30 rounded-xl text-white font-medium hover:from-blue-500/30 hover:to-blue-500/40 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
        >
          <Upload size={16} />
          <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Import CSV</span>
        </button>
        
        {dates.length > 0 && (
          <button
            onClick={() => {
              setShowExportPanel(!showExportPanel);
              setShowImportPanel(false);
            }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500/20 to-green-500/30 border border-green-400/30 rounded-xl text-white font-medium hover:from-green-500/30 hover:to-green-500/40 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Download size={16} />
            <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Export CSV</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImportExportPanel;
