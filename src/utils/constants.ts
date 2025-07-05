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

export const STORAGE_KEYS = {
  IMPORTANT_DATES: "zenTab_important_dates",
  QUICK_LINKS: "zenTab_quick_links",
  ACTIVE_BACKGROUND: "zenTab_active_background",
  AUTO_CHANGE_BACKGROUND: "zenTab_auto_change_background",
  BACKGROUNDS: "zenTab_backgrounds",
  NOTES: "zenTab_daily_notes",
  TASKS: "zenTab_tasks",
  WEATHER_DATA: "zenTab_weather_data",
  LOCATION: "zenTab_location",
  TIMEZONES: "zenTab_timezones",
} as const;
