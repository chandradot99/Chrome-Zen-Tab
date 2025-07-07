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

  // Enhanced CSV parsing function
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i - 1] === ',')) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i + 1] === ',')) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else if (char !== '"' || inQuotes) {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  // Parse date from various formats
  const parseDate = (dateStr: string): string | null => {
    if (!dateStr) return null;
    
    // Remove quotes and trim
    dateStr = dateStr.replace(/"/g, '').trim();
    
    // If already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Try to parse MM/DD/YYYY or DD/MM/YYYY or other common formats
    const dateFormats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY or DD/MM/YYYY
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // MM-DD-YYYY or DD-MM-YYYY
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, // YYYY/MM/DD
      /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, // MM.DD.YYYY or DD.MM.YYYY
    ];
    
    for (const format of dateFormats) {
      const match = dateStr.match(format);
      if (match) {
        let year, month, day;
        
        if (format === dateFormats[2]) { // YYYY/MM/DD
          [, year, month, day] = match;
        } else {
          [, month, day, year] = match;
          // Swap if day > 12 (assume DD/MM format)
          if (parseInt(month) > 12) {
            [month, day] = [day, month];
          }
        }
        
        const parsedMonth = String(month).padStart(2, '0');
        const parsedDay = String(day).padStart(2, '0');
        
        return `${year}-${parsedMonth}-${parsedDay}`;
      }
    }
    
    return null;
  };

  // Detect type from string
  const detectType = (typeStr: string): 'birthday' | 'anniversary' | 'other' => {
    if (!typeStr) return 'other';
    
    const lower = typeStr.toLowerCase().trim();
    if (lower.includes('birth') || lower.includes('bday')) return 'birthday';
    if (lower.includes('anniversary') || lower.includes('anniv')) return 'anniversary';
    return 'other';
  };

  const exportToCSV = () => {
    if (dates.length === 0) {
      alert('No dates to export!');
      return;
    }

    const headers = ['Name', 'Type', 'Month', 'Day', 'Year', 'Date'];
    const csvData = dates.map(date => {
      const [year, month, day] = date.date.split('-').map(Number);
      return [
        `"${date.name.replace(/"/g, '""')}"`,
        date.type,
        months[month - 1],
        day,
        year, // Include the actual year from the date
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setImportData(content);
        // Auto-process the file content
        processImportData(content);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const processImportData = (data: string) => {
    if (!data.trim()) {
      alert('File is empty!');
      return;
    }

    try {
      const lines = data.trim().split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        alert('CSV must contain at least a header row and one data row!');
        return;
      }

      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim().replace(/"/g, ''));
      
      // Find column indices
      const nameIndex = headers.findIndex(h => h.includes('name'));
      const typeIndex = headers.findIndex(h => h.includes('type'));
      const dateIndex = headers.findIndex(h => h.includes('date') && !h.includes('month') && !h.includes('day'));
      const monthIndex = headers.findIndex(h => h.includes('month'));
      const dayIndex = headers.findIndex(h => h.includes('day'));
      const yearIndex = headers.findIndex(h => h.includes('year'));
      
      if (nameIndex === -1) {
        alert('CSV must contain a "Name" column!');
        return;
      }

      const newDates: ImportantDate[] = [];
      const errors: string[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        
        const name = row[nameIndex]?.trim().replace(/"/g, '');
        if (!name) {
          errors.push(`Row ${i + 1}: Missing name`);
          continue;
        }

        let dateStr = '';
        
        // Try to get date from date column first
        if (dateIndex !== -1 && row[dateIndex]) {
          dateStr = row[dateIndex];
        }
        // If no date column or empty, try to construct from month/day/year
        else if (monthIndex !== -1 && dayIndex !== -1 && row[monthIndex] && row[dayIndex]) {
          const monthStr = row[monthIndex].trim();
          const dayStr = row[dayIndex].trim();
          const yearStr = yearIndex !== -1 && row[yearIndex] ? row[yearIndex].trim() : new Date().getFullYear().toString();
          
          // Convert month name to number if needed
          let monthNum = parseInt(monthStr);
          if (isNaN(monthNum)) {
            monthNum = months.findIndex(m => m.toLowerCase().startsWith(monthStr.toLowerCase())) + 1;
          }
          
          if (monthNum >= 1 && monthNum <= 12) {
            dateStr = `${yearStr}-${String(monthNum).padStart(2, '0')}-${String(dayStr).padStart(2, '0')}`;
          }
        }
        
        const parsedDate = parseDate(dateStr);
        if (!parsedDate) {
          errors.push(`Row ${i + 1}: Invalid or missing date format`);
          continue;
        }

        // Validate date
        const testDate = new Date(parsedDate);
        if (isNaN(testDate.getTime())) {
          errors.push(`Row ${i + 1}: Invalid date: ${dateStr}`);
          continue;
        }

        const type = typeIndex !== -1 ? detectType(row[typeIndex]) : 'other';

        const newDate: ImportantDate = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name,
          type,
          date: parsedDate,
          days: calculateDaysUntilDate(parsedDate),
          color: colors[newDates.length % colors.length]
        };
        
        newDates.push(newDate);
      }

      if (newDates.length === 0) {
        alert('No valid dates found!\n\nErrors:\n' + errors.join('\n'));
        return;
      }

      onImport(newDates);
      setImportData('');
      setShowImportPanel(false);
      
      let message = `Successfully imported ${newDates.length} dates!`;
      if (errors.length > 0) {
        message += `\n\nWarnings:\n${errors.slice(0, 5).join('\n')}`;
        if (errors.length > 5) {
          message += `\n... and ${errors.length - 5} more warnings`;
        }
      }
      alert(message);
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing CSV data. Please check the format and try again.');
    }
  };

  const handleImportCSV = () => {
    if (!importData.trim()) {
      alert('Please paste CSV data first!');
      return;
    }
    processImportData(importData);
  };

  const loadTemplate = () => {
    const template = `Name,Type,Date
"John Doe",birthday,1990-05-15
"Jane Smith",anniversary,2020-06-20
"Alex Johnson",other,1985-12-25`;
    setImportData(template);
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
            <div className="text-white/70 text-xs mb-2">
              Supported formats: Name (required), Type (optional), Date (YYYY-MM-DD, MM/DD/YYYY, etc.)
            </div>
            
            {/* File Upload Option */}
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Upload size={16} className="text-white/60" />
              <div className="flex-1">
                <label htmlFor="csv-file" className="text-white/80 text-sm cursor-pointer hover:text-white transition-colors">
                  Upload CSV File
                </label>
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <div className="text-white/50 text-xs">or paste below</div>
            </div>
            
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste CSV data here..."
              className="w-full h-32 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 text-sm outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300 resize-none font-mono"
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
                onClick={loadTemplate}
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
      <div className="flex space-x-2">
        <button
          onClick={() => {
            setShowImportPanel(!showImportPanel);
            setShowExportPanel(false);
          }}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center space-x-1.5 text-sm"
        >
          <Upload size={14} />
          <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Import</span>
        </button>
        
        {dates.length > 0 && (
          <button
            onClick={() => {
              setShowExportPanel(!showExportPanel);
              setShowImportPanel(false);
            }}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center space-x-1.5 text-sm"
          >
            <Download size={14} />
            <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">Export</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImportExportPanel;