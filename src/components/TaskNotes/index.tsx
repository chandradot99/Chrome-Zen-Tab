import React, { useState, useEffect } from 'react';
import { FileText, CheckSquare, Edit3 } from 'lucide-react';
import TaskManager from './TaskManager';
import NotesEditor from './NotesEditor';
import { STORAGE_KEYS } from '../../utils/constants';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type ActiveTab = 'tasks' | 'notes';

const TabbedTasksNotes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-save notes with debounce
  useEffect(() => {
    if (!isLoading) {
      const saveTimer = setTimeout(() => {
        saveNotes(notes);
        setLastSaved(new Date());
      }, 1000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [notes, isLoading]);

  // Auto-save tasks whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
      if (tasks.length > 0) {
        setLastSaved(new Date());
      }
    }
  }, [tasks, isLoading]);

  const loadData = async (): Promise<void> => {
    try {
      // Load tasks
      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      // Load notes
      const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (storedNotes) {
        setNotes(storedNotes);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const saveTasks = (tasksToSave: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const saveNotes = (notesToSave: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, notesToSave);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const getNotesStats = () => {
    const lines = notes.split('\n').filter(line => line.trim()).length;
    const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
    const chars = notes.length;
    return { lines, words, chars };
  };

  const taskStats = getTaskStats();
  const notesStats = getNotesStats();

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
            <FileText size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-md font-semibold text-white drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              {activeTab === 'tasks' ? 'Daily Tasks' : 'Notes'}
            </h2>
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex bg-white/10 rounded-xl p-1 mb-4">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'tasks'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <CheckSquare size={18} />
          <span className="drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Tasks</span>
          {taskStats.pending > 0 && (
            <span className="bg-orange-500/80 text-white text-xs px-2 py-0.5 rounded-full">
              {taskStats.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'notes'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Edit3 size={18} />
          <span className="drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Notes</span>
          {notesStats.words > 0 && (
            <span className="bg-blue-500/80 text-white text-xs px-2 py-0.5 rounded-full">
              {notesStats.words}
            </span>
          )}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'tasks' ? (
        <TaskManager tasks={tasks} onTasksChange={setTasks} />
      ) : (
        <NotesEditor notes={notes} onNotesChange={setNotes} />
      )}

      {/* Status Bar */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center text-white/40 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            Date.now() - lastSaved.getTime() < 2000 ? 'bg-green-400 animate-pulse' : 'bg-white/30'
          }`}></div>
          <span>
            {Date.now() - lastSaved.getTime() < 2000 
              ? 'Saved' 
              : 'Auto-saved'
            }
          </span>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-3 text-center">
        <div className="text-white/30 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          {activeTab === 'tasks' 
            ? 'Press Enter to add tasks, Escape to cancel • Click checkboxes to mark complete'
            : 'Your notes auto-save as you type • Switch to Tasks tab to manage your todos'
          }
        </div>
      </div>
    </div>
  );
};

export default TabbedTasksNotes;