import { useEffect } from "react";

interface Birthday {
  id: string;
  name: string;
  date: string;
  days: number;
  color: string;
}

interface NotificationTrigger {
  days: number;
  title: string;
  getMessage: (name: string, days: number) => string;
  icon: string;
}

// Declare chrome and Notification types
declare const chrome: any;

const NOTIFICATION_TRIGGERS: NotificationTrigger[] = [
  {
    days: 30,
    title: "Birthday Reminder - 1 Month",
    getMessage: (name: string) =>
      `🗓️ ${name}'s birthday is coming up in 1 month!`,
    icon: "🗓️",
  },
  {
    days: 7,
    title: "Birthday Reminder - 1 Week",
    getMessage: (name: string) =>
      `📅 ${name}'s birthday is next week! Time to plan something special.`,
    icon: "📅",
  },
  {
    days: 1,
    title: "Birthday Reminder - Tomorrow",
    getMessage: (name: string) =>
      `🎂 Tomorrow is ${name}'s birthday! Don't forget to wish them well.`,
    icon: "🎂",
  },
  {
    days: 0,
    title: "Happy Birthday!",
    getMessage: (name: string) =>
      `🎉 Today is ${name}'s birthday! Time to celebrate! 🎈`,
    icon: "🎉",
  },
];

const NOTIFICATIONS_STORAGE_KEY = "zenTab_notification_history";

export const useBirthdayNotifications = (birthdays: Birthday[]) => {
  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission();

    // Check for notifications daily
    checkAndSendNotifications();

    // Set up daily check at 9 AM
    setupDailyNotificationCheck();
  }, [birthdays]);

  const requestNotificationPermission = async () => {
    try {
      if (typeof chrome !== "undefined" && chrome.notifications) {
        // For Chrome extension, notifications permission is handled via manifest
        return true;
      } else if ("Notification" in window) {
        // For web/development environment
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          return permission === "granted";
        }
        return Notification.permission === "granted";
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const getNotificationHistory = (): Record<string, string[]> => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage) {
        // Will be handled asynchronously
        return {};
      } else {
        const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
      }
    } catch {
      return {};
    }
  };

  const saveNotificationHistory = (history: Record<string, string[]>) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.sync.set({ [NOTIFICATIONS_STORAGE_KEY]: history });
      } else {
        localStorage.setItem(
          NOTIFICATIONS_STORAGE_KEY,
          JSON.stringify(history)
        );
      }
    } catch (error) {
      console.error("Error saving notification history:", error);
    }
  };

  const generateNotificationId = (birthdayId: string, days: number): string => {
    const today = new Date().toISOString().split("T")[0];
    return `${birthdayId}_${days}_${today}`;
  };

  const hasNotificationBeenSent = (
    notificationId: string,
    history: Record<string, string[]>
  ): boolean => {
    const today = new Date().toISOString().split("T")[0];
    return history[today]?.includes(notificationId) || false;
  };

  const markNotificationAsSent = (notificationId: string) => {
    const history = getNotificationHistory();
    const today = new Date().toISOString().split("T")[0];

    if (!history[today]) {
      history[today] = [];
    }

    if (!history[today].includes(notificationId)) {
      history[today].push(notificationId);

      // Clean up old history (keep only last 60 days)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 60);
      const cutoffString = cutoffDate.toISOString().split("T")[0];

      Object.keys(history).forEach((date) => {
        if (date < cutoffString) {
          delete history[date];
        }
      });

      saveNotificationHistory(history);
    }
  };

  const sendChromeNotification = (
    trigger: NotificationTrigger,
    birthday: Birthday
  ) => {
    const notificationId = generateNotificationId(birthday.id, trigger.days);

    chrome.notifications.create(notificationId, {
      type: "basic",
      iconUrl: "icons/icon-128.png",
      title: trigger.title,
      message: trigger.getMessage(birthday.name, birthday.days),
      buttons:
        trigger.days > 0
          ? [{ title: "Set Reminder" }, { title: "Dismiss" }]
          : [{ title: "View Birthday" }, { title: "Dismiss" }],
    });

    markNotificationAsSent(notificationId);
  };

  const sendWebNotification = (
    trigger: NotificationTrigger,
    birthday: Birthday
  ) => {
    const notificationId = generateNotificationId(birthday.id, trigger.days);

    if (Notification.permission === "granted") {
      try {
        const notification = new Notification(trigger.title, {
          body: trigger.getMessage(birthday.name, birthday.days),
          icon: "/icons/icon-128.png",
          tag: notificationId,
          requireInteraction: trigger.days === 0,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        markNotificationAsSent(notificationId);

        // Auto-close after 5 seconds (except for today's birthdays)
        if (trigger.days > 0) {
          setTimeout(() => {
            notification.close();
          }, 5000);
        }
      } catch (error) {
        console.error("Error creating web notification:", error);
      }
    }
  };

  const checkAndSendNotifications = () => {
    if (birthdays.length === 0) return;

    const history = getNotificationHistory();

    birthdays.forEach((birthday) => {
      NOTIFICATION_TRIGGERS.forEach((trigger) => {
        if (birthday.days === trigger.days) {
          const notificationId = generateNotificationId(
            birthday.id,
            trigger.days
          );

          if (!hasNotificationBeenSent(notificationId, history)) {
            if (typeof chrome !== "undefined" && chrome.notifications) {
              sendChromeNotification(trigger, birthday);
            } else {
              sendWebNotification(trigger, birthday);
            }
          }
        }
      });
    });
  };

  const setupDailyNotificationCheck = () => {
    // Calculate time until 9 AM today or tomorrow
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(9, 0, 0, 0);

    // If it's already past 9 AM today, set for 9 AM tomorrow
    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const msUntilTarget = targetTime.getTime() - now.getTime();

    setTimeout(() => {
      checkAndSendNotifications();

      // Then set up daily interval
      const dailyInterval = setInterval(() => {
        checkAndSendNotifications();
      }, 24 * 60 * 60 * 1000); // 24 hours

      // Cleanup function
      return () => clearInterval(dailyInterval);
    }, msUntilTarget);
  };

  return {
    requestNotificationPermission,
  };
};
