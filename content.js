// Content script for FlirtGPT Chrome Extension
// Runs on all web pages to provide additional functionality if needed

// This content script is minimal since most functionality is in the popup
// It could be extended to detect chat platforms or provide additional context

(function() {
  'use strict';

  // Detect if current page is a supported chat platform
  function detectChatPlatform() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('instagram.com')) {
      return 'instagram';
    } else if (hostname.includes('web.whatsapp.com')) {
      return 'whatsapp';
    } else if (hostname.includes('discord.com')) {
      return 'discord';
    }
    
    return 'unknown';
  }

  // Get page context information (could be useful for better prompts)
  function getPageContext() {
    return {
      platform: detectChatPlatform(),
      title: document.title,
      url: window.location.href,
      hasChat: checkForChatElements()
    };
  }

  // Basic check for chat-like elements on the page
  function checkForChatElements() {
    const chatSelectors = [
      '[role="textbox"]',
      'input[type="text"]',
      'textarea',
      '.message',
      '.chat',
      '[data-testid*="message"]',
      '[aria-label*="message"]',
      '[placeholder*="message"]',
      '[placeholder*="Message"]',
      '[placeholder*="Type"]'
    ];

    return chatSelectors.some(selector => document.querySelector(selector) !== null);
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContext') {
      const context = getPageContext();
      sendResponse({ success: true, context });
      return true;
    }
    
    if (request.action === 'detectPlatform') {
      const platform = detectChatPlatform();
      sendResponse({ success: true, platform });
      return true;
    }
    
    return false;
  });

  // Initialize content script
  function init() {
    // Only run on supported platforms or if chat elements are detected
    const context = getPageContext();
    if (context.platform !== 'unknown' || context.hasChat) {
      console.log('FlirtGPT: Chat platform detected:', context.platform);
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
