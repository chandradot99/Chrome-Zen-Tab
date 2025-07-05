import React, { useState, useEffect } from 'react';
import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';

const GreetingSection: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Inspirational quotes for the greeting
  const quotes = [
    "Every moment is a fresh beginning.",
    "Believe you can and you're halfway there.",
    "The way to get started is to quit talking and begin doing.",
    "Don't let yesterday take up too much of today.",
    "All our dreams can come true if we have the courage to pursue them.",
    "Life is really simple, but we insist on making it complicated.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "You are never too old to set another goal or to dream a new dream."
  ];

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return { text: "Good Morning", icon: <Sunrise className="text-yellow-400" size={16} /> };
    } else if (hour >= 12 && hour < 17) {
      return { text: "Good Afternoon", icon: <Sun className="text-orange-400" size={16} /> };
    } else if (hour >= 17 && hour < 21) {
      return { text: "Good Evening", icon: <Sunset className="text-orange-500" size={16} /> };
    } else {
      return { text: "Good Night", icon: <Moon className="text-blue-300" size={16} /> };
    }
  };

  const greeting = getGreeting();
  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="flex flex-col items-center justify-center px-6">
      {/* Clean Greeting */}
      <div className="flex items-center space-x-2 mb-2">
        {greeting.icon}
        <h2 className="text-lg font-light text-white drop-shadow-xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
          {greeting.text}
        </h2>
      </div>
      
      {/* Minimal Quote */}
      <div className="max-w-xs text-center">
        <p className="text-white/70 text-xs font-light italic drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] transition-all duration-500">
          "{currentQuote}"
        </p>
      </div>
    </div>
  );
};

export default GreetingSection;
