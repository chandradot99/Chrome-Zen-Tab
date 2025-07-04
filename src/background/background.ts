chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
      // Handle "Set Reminder" or "View Birthday"
      chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });
    }
    // Button index 1 is always "Dismiss" - notification auto-closes
    chrome.notifications.clear(notificationId);
  }
);

chrome.notifications.onClicked.addListener((notificationId) => {
  // Open new tab when notification is clicked
  chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });
  chrome.notifications.clear(notificationId);
});
