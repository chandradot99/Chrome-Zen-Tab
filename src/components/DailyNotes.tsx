import React from 'react';

interface DailyNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const DailyNotes: React.FC<DailyNotesProps> = ({ notes, onNotesChange }) => {
  const lineCount = notes.split('\n').filter(line => line.trim()).length;
  const characterCount = notes.length;

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl mr-4">
          📝
        </div>
        <h2 className="text-2xl font-semibold text-white">Daily Notes</h2>
      </div>
      
      <textarea 
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-white/40 resize-none outline-none focus:bg-white/10 focus:border-white/30 transition-all duration-300"
        placeholder="What's on your mind today?"
        style={{ 
          fontFamily: 'ui-monospace, "SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
          fontSize: '15px',
          lineHeight: '1.6'
        }}
      />
      
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-white/40">
          {lineCount} lines • {characterCount} characters
        </div>
        <div className="flex items-center text-white/40">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Auto-saved
        </div>
      </div>
    </div>
  );
};

export default DailyNotes;
