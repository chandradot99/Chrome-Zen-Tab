import { useState, useEffect } from "react";

export const useStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load initial value from chrome storage
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get([key], (result: any) => {
        if (result[key] !== undefined) {
          setValue(result[key]);
        }
        setIsLoaded(true);
      });
    } else {
      // Fallback to localStorage for development
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          setValue(JSON.parse(stored));
        } catch {
          setValue(stored as T);
        }
      }
      setIsLoaded(true);
    }
  }, [key]);

  const updateValue = (newValue: T) => {
    setValue(newValue);

    // Save to chrome storage
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set({ [key]: newValue });
    } else {
      // Fallback to localStorage for development
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, updateValue, isLoaded] as const;
};
