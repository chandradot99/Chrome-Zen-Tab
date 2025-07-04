export const DEFAULT_BACKGROUNDS = [
  {
    name: "Mountains",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    overlay: "bg-black/40",
  },
  {
    name: "Ocean",
    image:
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    overlay: "bg-black/30",
  },
  {
    name: "Forest",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    overlay: "bg-black/50",
  },
  {
    name: "Desert",
    image:
      "https://images.unsplash.com/photo-1641885282024-40d86bdbabda?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    overlay: "bg-black/35",
  },
  {
    name: "Aurora",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    overlay: "bg-black/40",
  },
  {
    name: "City",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    overlay: "bg-black/45",
  },
];

export const DEFAULT_BIRTHDAYS = [
  {
    name: "Sarah Johnson",
    date: "July 8",
    days: 4,
    color: "bg-gradient-to-r from-pink-500 to-rose-500",
  },
  {
    name: "Mom 💝",
    date: "July 15",
    days: 11,
    color: "bg-gradient-to-r from-purple-500 to-indigo-500",
  },
  {
    name: "Alex Chen",
    date: "July 22",
    days: 18,
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
];

export const DEFAULT_QUICK_LINKS = [
  {
    name: "Gmail",
    icon: "📧",
    url: "https://gmail.com",
    color: "from-red-500 to-red-600",
  },
  {
    name: "Calendar",
    icon: "📅",
    url: "https://calendar.google.com",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "GitHub",
    icon: "🐙",
    url: "https://github.com",
    color: "from-gray-800 to-black",
  },
  {
    name: "Notion",
    icon: "📝",
    url: "https://notion.so",
    color: "from-gray-700 to-gray-800",
  },
  {
    name: "Spotify",
    icon: "🎵",
    url: "https://spotify.com",
    color: "from-green-500 to-green-600",
  },
  {
    name: "LinkedIn",
    icon: "💼",
    url: "https://linkedin.com",
    color: "from-blue-600 to-blue-700",
  },
];

export const DEFAULT_NOTES =
  "• Team standup at 10 AM\n• Review Q3 roadmap\n• Coffee with Sarah at 3 PM\n• Gym session after work";

export const STORAGE_KEYS = {
  NOTES: "daily_notes",
  BIRTHDAYS: "birthdays",
  QUICK_LINKS: "quick_links",
  ACTIVE_BACKGROUND: "active_background",
  AUTO_CHANGE_BACKGROUND: "auto_change_background",
  BACKGROUNDS: "backgrounds",
} as const;
