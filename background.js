// Background script for FlirtGPT Chrome Extension
// Handles extension lifecycle and communication between components

// Extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('FlirtGPT extension installed');
  } else if (details.reason === 'update') {
    console.log('FlirtGPT extension updated');
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // The popup will handle the main functionality
  // This is just for any additional background processing if needed
});

// Message passing between content script and popup (if needed in future)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle any background processing requests
  if (request.action === 'captureTab') {
    // This is handled by the popup directly, but could be moved here if needed
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      sendResponse({ success: true, dataUrl });
    });
    return true; // Indicates async response
  }
  
  return false;
});

// Handle tab updates (optional - for future features)
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Could be used to detect when user switches to supported platforms
  // For now, we keep it simple and manual
});

// Error handling for background script
chrome.runtime.onSuspend.addListener(() => {
  console.log('FlirtGPT background script suspended');
});

// Keep service worker alive for screenshot functionality
chrome.runtime.onStartup.addListener(() => {
  console.log('FlirtGPT extension started');
});
