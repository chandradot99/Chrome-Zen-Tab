import React, { useState, useEffect } from 'react';
import { Sunrise, Sun, Sunset, Moon, RefreshCw, Quote } from 'lucide-react';

const GreetingSection: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Comprehensive collection of inspirational quotes organized by category
  const quotes = [
    // Motivation & Success
    "Every moment is a fresh beginning.",
    "Believe you can and you're halfway there.",
    "The way to get started is to quit talking and begin doing.",
    "Don't let yesterday take up too much of today.",
    "All our dreams can come true if we have the courage to pursue them.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only impossible journey is the one you never begin.",
    "In the middle of difficulty lies opportunity.",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    "The future belongs to those who believe in the beauty of their dreams.",
    
    // Productivity & Focus
    "You are never too old to set another goal or to dream a new dream.",
    "Life is really simple, but we insist on making it complicated.",
    "Focus on being productive instead of busy.",
    "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    "Time is what we want most, but what we use worst.",
    "Productivity is never an accident. It is always the result of planning and effort.",
    "Don't watch the clock; do what it does. Keep going.",
    "The way to get started is to quit talking and begin doing.",
    "Excellence is not a skill, it's an attitude.",
    "Progress, not perfection.",
    
    // Wisdom & Life
    "Be yourself; everyone else is already taken.",
    "Yesterday is history, tomorrow is a mystery, today is a gift.",
    "Life is 10% what happens to you and 90% how you react to it.",
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Quality is not an act, it is a habit.",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    
    // Creativity & Innovation
    "Creativity is intelligence having fun.",
    "The secret to creativity is knowing how to hide your sources.",
    "Innovation is seeing what everybody has seen and thinking what nobody has thought.",
    "Imagination is more important than knowledge.",
    "Every artist was first an amateur.",
    "The creative adult is the child who survived.",
    "You can't use up creativity. The more you use, the more you have.",
    "Creativity takes courage.",
    "Think outside the box, collapse the box, and take a fucking sharp knife to it.",
    "The way to get started is to quit talking and begin doing.",
    
    // Perseverance & Growth
    "Fall seven times, stand up eight.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The only person you are destined to become is the person you decide to be.",
    "Growth begins at the end of your comfort zone.",
    "Challenges are what make life interesting; overcoming them is what makes life meaningful.",
    "The expert in anything was once a beginner.",
    "Don't be afraid to give up the good to go for the great.",
    "Continuous improvement is better than delayed perfection.",
    "The only way to learn is to live.",
    
    // Technology & Future
    "The future belongs to those who learn more skills and combine them in creative ways.",
    "Technology is a useful servant but a dangerous master.",
    "The best way to predict the future is to create it.",
    "Code is poetry written by developers for machines to understand.",
    "Every expert was once a beginner. Every pro was once an amateur.",
    "The digital revolution is far more significant than the invention of writing or even printing.",
    "Artificial intelligence is the new electricity.",
    "In the world of technology, simplicity is the ultimate sophistication.",
    "Data is the new oil, but analytics is the refinery.",
    "The internet is becoming the town square for the global village."
  ];

  // Rotate quotes every 10 seconds with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsTransitioning(false);
      }, 250); // Half of transition duration
      
    }, 20000); // Changed to 10 seconds for better readability
    
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Enhanced greeting with more personality
  const getGreeting = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const isWeekend = day === 0 || day === 6;
    
    let greeting = "";
    let icon = null;
    let color = "";
    
    if (hour >= 5 && hour < 12) {
      greeting = isWeekend ? "Good Morning!" : "Good Morning";
      icon = <Sunrise size={18} />;
      color = "text-yellow-400";
    } else if (hour >= 12 && hour < 17) {
      greeting = "Good Afternoon";
      icon = <Sun size={18} />;
      color = "text-orange-400";
    } else if (hour >= 17 && hour < 21) {
      greeting = "Good Evening";
      icon = <Sunset size={18} />;
      color = "text-orange-500";
    } else {
      greeting = hour >= 21 ? "Good Evening" : "Good Night";
      icon = <Moon size={18} />;
      color = "text-blue-300";
    }
    
    return { 
      text: greeting, 
      icon: React.cloneElement(icon, { className: color }),
      color 
    };
  };

  const manualNextQuote = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      setIsTransitioning(false);
    }, 250);
  };

  const greeting = getGreeting();
  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="flex flex-col items-center justify-center px-6 py-4">
      {/* Enhanced Greeting with Animation */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="animate-pulse">
          {greeting.icon}
        </div>
        <h2 className="text-xl font-light text-white drop-shadow-xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)] transition-all duration-300">
          {greeting.text}
        </h2>
      </div>
      
      {/* Enhanced Quote Section with Better Styling */}
      <div className="relative max-w-sm text-center">
        {/* Quote Icon */}
        <div className="absolute -top-2 -left-6 opacity-20">
          <Quote size={20} className="text-white transform rotate-180" />
        </div>
        
        {/* Quote Text with Smooth Transition */}
        <div 
          className={`transition-all duration-500 transform ${
            isTransitioning ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <p className="text-white/80 text-sm font-light italic drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] leading-relaxed">
            "{currentQuote}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default GreetingSection;
