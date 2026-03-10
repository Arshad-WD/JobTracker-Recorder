// background.js for JobTracker Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('JobTracker Sync Extension installed');
});

// We can add message listeners here if we need to do background syncs 
// or handle complex cross-origin requests that content scripts can't do.
