// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// DOM elements
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const retryBtn = document.getElementById('retry-btn');
const toneSelect = document.getElementById('tone');
const personalitySelect = document.getElementById('personality');
const apiKeyInput = document.getElementById('api-key');
const clearKeyBtn = document.getElementById('clear-key-btn');
const apiKeyWarning = document.getElementById('api-key-warning');
const resultArea = document.getElementById('result-area');
const errorArea = document.getElementById('error-area');
const flirtLine = document.getElementById('flirt-line');
const errorMessage = document.getElementById('error-message');
const btnText = document.querySelector('.btn-text');
const loadingSpinner = document.querySelector('.loading-spinner');
const copyBubbleBtn = document.getElementById('copy-btn');
const outputDivider = document.getElementById('output-divider');
const toast = document.getElementById('toast');

// State management
let lastScreenshot = null;
let lastSettings = null;

// Event listeners
generateBtn.addEventListener('click', handleGenerateFlirtLine);
copyBubbleBtn.addEventListener('click', handleCopyToClipboard);
tryAgainBtn.addEventListener('click', handleTryAgain);
retryBtn.addEventListener('click', handleRetry);
apiKeyInput.addEventListener('input', handleApiKeyInput);
apiKeyInput.addEventListener('blur', saveApiKey);
clearKeyBtn.addEventListener('click', handleClearApiKey);
toneSelect.addEventListener('change', updatePersonalityTheme);
personalitySelect.addEventListener('change', updatePersonalityTheme);

// API Key Management Functions
async function loadApiKey() {
  try {
    const result = await chrome.storage.local.get(['geminiApiKey']);
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
      updateClearButtonVisibility();
    }
  } catch (error) {
    console.error('Error loading API key:', error);
  }
}

async function saveApiKey() {
  try {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      await chrome.storage.local.set({ geminiApiKey: apiKey });
    } else {
      await chrome.storage.local.remove(['geminiApiKey']);
    }
  } catch (error) {
    console.error('Error saving API key:', error);
  }
}

function handleApiKeyInput() {
  updateClearButtonVisibility();
  hideApiKeyWarning();
  // Save on input with debouncing
  clearTimeout(window.apiKeySaveTimeout);
  window.apiKeySaveTimeout = setTimeout(saveApiKey, 500);
}

async function handleClearApiKey() {
  apiKeyInput.value = '';
  updateClearButtonVisibility();
  try {
    await chrome.storage.local.remove(['geminiApiKey']);
  } catch (error) {
    console.error('Error clearing API key:', error);
  }
}

function updateClearButtonVisibility() {
  const hasValue = apiKeyInput.value.trim().length > 0;
  clearKeyBtn.style.display = hasValue ? 'flex' : 'none';
}

function showApiKeyWarning() {
  apiKeyWarning.style.display = 'block';
}

function hideApiKeyWarning() {
  apiKeyWarning.style.display = 'none';
}

async function getCurrentApiKey() {
  const inputKey = apiKeyInput.value.trim();
  if (inputKey) {
    return inputKey;
  }
  
  // Fallback to stored key if input is empty
  try {
    const result = await chrome.storage.local.get(['geminiApiKey']);
    return result.geminiApiKey || '';
  } catch (error) {
    console.error('Error getting stored API key:', error);
    return '';
  }
}

// Theme Management
function updatePersonalityTheme() {
  const tone = toneSelect.value;
  const personality = personalitySelect.value;
  const body = document.body;
  
  // Remove existing theme classes
  body.classList.remove(
    'tone-warm-wholesome', 'tone-bold-direct', 'tone-witty-playful',
    'personality-charming-romantic', 'personality-casual-gen-z', 'personality-chaotic-rizzlord'
  );
  
  // Add new theme classes
  body.classList.add(`tone-${tone}`, `personality-${personality}`);
}

// Toast Notification System
function showToast(message, duration = 3000) {
  toast.textContent = message;
  toast.style.display = 'block';
  toast.classList.remove('fade-out');
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, duration);
}

// Main function to generate flirt line
async function handleGenerateFlirtLine() {
  try {
    // Validate API key first
    const apiKey = await getCurrentApiKey();
    if (!apiKey) {
      showApiKeyWarning();
      return;
    }

    setLoading(true);
    hideResults();
    hideError();
    hideApiKeyWarning();

    // Capture screenshot
    const screenshot = await captureScreenshot();
    if (!screenshot) {
      throw new Error('Failed to capture screenshot');
    }

    // Store screenshot and settings for retry functionality
    lastScreenshot = screenshot;
    lastSettings = {
      tone: toneSelect.value,
      personality: personalitySelect.value
    };

    // Generate flirt line
    const flirtLineText = await generateFlirtLine(screenshot, lastSettings, apiKey);
    
    // Display result
    displayResult(flirtLineText);
    
  } catch (error) {
    console.error('Error generating flirt line:', error);
    displayError(error.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

// Handle try again with same screenshot
async function handleTryAgain() {
  if (!lastScreenshot || !lastSettings) {
    handleGenerateFlirtLine();
    return;
  }

  try {
    // Validate API key first
    const apiKey = await getCurrentApiKey();
    if (!apiKey) {
      showApiKeyWarning();
      return;
    }

    setLoading(true);
    hideResults();
    hideError();
    hideApiKeyWarning();

    // Update settings in case user changed them
    lastSettings = {
      tone: toneSelect.value,
      personality: personalitySelect.value
    };

    const flirtLineText = await generateFlirtLine(lastScreenshot, lastSettings, apiKey);
    displayResult(flirtLineText);
    
  } catch (error) {
    console.error('Error on retry:', error);
    displayError(error.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

// Handle retry (same as generate)
function handleRetry() {
  handleGenerateFlirtLine();
}

// Capture screenshot of current tab
async function captureScreenshot() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        reject(new Error('No active tab found'));
        return;
      }

      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        if (!dataUrl) {
          reject(new Error('Failed to capture screenshot'));
          return;
        }

        resolve(dataUrl);
      });
    });
  });
}

// Generate flirt line using Gemini Vision API
async function generateFlirtLine(screenshot, settings, apiKey) {
  const prompt = constructPrompt(settings.tone, settings.personality);
  
  // Convert data URL to base64
  const base64Image = screenshot.split(',')[1];
  
  const requestBody = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: "image/png",
            data: base64Image
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 100,
      topP: 0.95,
      topK: 40
    }
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }

  const generatedText = data.candidates[0].content.parts[0].text;
  return cleanFlirtLine(generatedText);
}

// Construct dynamic prompt based on tone and personality
function constructPrompt(tone, personality) {
  const toneMap = {
    'warm-wholesome': 'warm and wholesome',
    'bold-direct': 'bold and direct',
    'witty-playful': 'witty and playful'
  };

  const personalityMap = {
    'charming-romantic': 'a charming romantic',
    'casual-gen-z': 'a casual Gen-Z person',
    'chaotic-rizzlord': 'a chaotic rizzlord'
  };

  const toneInstructions = {
    'warm-wholesome': 'Make them smile, not blush. Focus on sincere, emotionally gentle connections.',
    'bold-direct': 'Say what you mean, mean what you say. Be confident and straight to the point but still smooth.',
    'witty-playful': 'Let the charm be sharp, but fun. Encourage mischievous, teasing back-and-forth energy.'
  };

  const personalityInstructions = {
    'charming-romantic': 'Use elegant, poetic, soft-spoken vibes. Think love letter energy in digital form.',
    'casual-gen-z': 'Be relatable with pop-culture references and low-effort-rizz. Think memes and modern slang.',
    'chaotic-rizzlord': 'Be unpredictable, bold, and unfiltered but clever. Maximum rizz energy.'
  };

  return `Based on this chat screenshot, generate a ${toneMap[tone]} flirt line in the voice of ${personalityMap[personality]}. 

Tone Guidelines: ${toneInstructions[tone]}
Personality Guidelines: ${personalityInstructions[personality]}

Requirements:
- Keep it casual, concise, and based on the attached chat screenshot
- Make it specific to what you see in the screenshot, not generic
- One or two lines maximum
- Sound natural and conversational
- Focus on being clever and contextually relevant

Return only the flirt line, no additional text or explanation.`;
}

// Clean and format the generated flirt line
function cleanFlirtLine(text) {
  // Remove common prefixes and suffixes
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^["']|["']$/g, ''); // Remove quotes
  cleaned = cleaned.replace(/^(Here's a |How about: |Try this: )/i, ''); // Remove common prefixes
  
  return cleaned;
}

// Copy to clipboard functionality
async function handleCopyToClipboard() {
  try {
    const text = flirtLine.textContent;
    await navigator.clipboard.writeText(text);
    
    // Show success toast
    showToast('Copied to clipboard 💘');
    
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Fallback method
    fallbackCopyToClipboard(flirtLine.textContent);
  }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showToast('Copied to clipboard 💘');
  } catch (err) {
    console.error('Fallback copy failed:', err);
    showToast('Copy failed - please try again', 2000);
  }
  
  document.body.removeChild(textArea);
}

// UI state management functions
function setLoading(loading) {
  generateBtn.disabled = loading;
  if (loading) {
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'block';
  } else {
    btnText.style.display = 'block';
    loadingSpinner.style.display = 'none';
  }
}

function displayResult(text) {
  flirtLine.textContent = text;
  resultArea.style.display = 'block';
  errorArea.style.display = 'none';
  outputDivider.style.display = 'block';
}

function displayError(message) {
  errorMessage.textContent = message;
  errorArea.style.display = 'block';
  resultArea.style.display = 'none';
  outputDivider.style.display = 'block';
}

function hideResults() {
  resultArea.style.display = 'none';
  outputDivider.style.display = 'none';
}

function hideError() {
  errorArea.style.display = 'none';
  outputDivider.style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved API key
  await loadApiKey();
  
  // Update clear button visibility based on loaded key
  updateClearButtonVisibility();
  
  // Set initial personality theme
  updatePersonalityTheme();
});
