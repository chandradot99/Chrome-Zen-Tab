import React, { useState, useEffect } from 'react';
import { CheckSquare, Edit3 } from 'lucide-react';
import TaskManager from './TaskManager';
import NotesEditor from './NotesEditor';
import { STORAGE_KEYS } from '../../utils/constants';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: boolean;
}

type ActiveTab = 'tasks' | 'notes';

const TabbedTasksNotes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-save notes with debounce
  useEffect(() => {
    if (!isLoading && notes.trim()) {
      const saveTimer = setTimeout(() => {
        saveNotes(notes);
      }, 1000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [notes, isLoading]);

  // Auto-save tasks whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
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
    const priority = tasks.filter(task => task.priority && !task.completed).length;
    return { total, completed, pending, priority };
  };

  const taskStats = getTaskStats();

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
      {/* Clean Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${
            activeTab === 'tasks' 
              ? 'bg-gradient-to-r from-orange-500 to-red-500' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}>
            {activeTab === 'tasks' ? (
              <CheckSquare size={16} className="text-white" />
            ) : (
              <Edit3 size={16} className="text-white" />
            )}
          </div>
          <div>
            <h2 className="text-md font-semibold text-white drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              {activeTab === 'tasks' ? 'Tasks' : 'Notes'}
            </h2>
          </div>
        </div>

        {/* Subtle Toggle */}
        <div className="flex bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm ${
              activeTab === 'tasks'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <CheckSquare size={14} />
            <span>Tasks</span>
            {taskStats.pending > 0 && (
              <span className="w-2 h-2 bg-orange-400/80 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm ${
              activeTab === 'notes'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <Edit3 size={14} />
            <span>Notes</span>
            {notes.trim() && (
              <span className="w-2 h-2 bg-blue-400/80 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'tasks' ? (
        <TaskManager tasks={tasks} onTasksChange={setTasks} />
      ) : (
        <NotesEditor notes={notes} onNotesChange={setNotes} />
      )}
    </div>
  );
};

export default TabbedTasksNotes;