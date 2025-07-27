# 🚀 FlirtGPT - AI-Powered Flirt Line Generator

A Chrome extension that generates context-aware flirt lines using Google's Gemini Vision AI based on chat screenshots.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🎯 **Context-Aware**: Analyzes chat screenshots to generate relevant, personalized flirt lines
- 🎨 **Customizable**: Choose from different tones and personalities
- 💾 **Persistent**: Saves your API key locally for seamless use
- 🚀 **Fast**: One-click generation with instant copy-to-clipboard
- 🔒 **Private**: No data storage, screenshots processed on-demand only
- 📱 **Universal**: Works with Instagram DMs, WhatsApp Web, Discord, and more

## 🎨 Preview

The extension features a modern, animated interface with:
- **Chat bubble output** with hover-to-copy functionality
- **Dynamic theming** based on personality selection
- **Smooth animations** and micro-interactions
- **Toast notifications** for user feedback

## 🚀 Quick Start

### 1. Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked" and select the FlirtGPT folder
5. The extension icon will appear in your Chrome toolbar

### 2. Setup
1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click the FlirtGPT extension icon
3. Enter your API key in the popup (saved automatically)
4. You're ready to go!

### 3. Usage
1. Navigate to any chat platform (Instagram, WhatsApp Web, Discord, etc.)
2. Click the FlirtGPT extension icon
3. Select your preferred **Tone** and **Personality**:
   - **Tones**: Warm & Wholesome, Bold & Direct, Witty & Playful
   - **Personalities**: Charming Romantic, Casual Gen-Z, Chaotic Rizzlord
4. Click "Generate Flirt Line" to capture a screenshot and generate your line
5. Hover over the chat bubble and click 📋 to copy
6. Paste and send with confidence! ✨

## 🎯 Tone & Personality Guide

### Tones (Emotional Energy)
- **🍯 Warm & Wholesome**: Kind, sincere, emotionally gentle. Perfect for soft compliments and cute connections that make them smile, not blush.
- **🔥 Bold & Direct**: High-confidence, straight-to-the-point energy. No games, just smooth and direct communication.
- **✨ Witty & Playful**: Mischievous, teasing, flirtatious tone that encourages fun back-and-forth energy.

### Personalities (Style of Delivery)
- **💕 Charming Romantic**: Elegant, poetic, soft-spoken vibes with love letter energy in digital form.
- **📱 Casual Gen-Z**: Relatable with pop-culture references, memes, and modern low-effort-rizz style.
- **🧨 Chaotic Rizzlord**: Maximum unpredictability - bold, unfiltered, sometimes unhinged but always clever.

## 🛠️ Technical Details

### Built With
- **Manifest V3** for modern Chrome extension compatibility
- **Google Gemini Vision API** for AI-powered image analysis
- **Modern CSS** with animations and gradient designs
- **Vanilla JavaScript** for lightweight performance

### Architecture
```
FlirtGPT/
├── manifest.json     # Extension configuration
├── popup.html       # Main UI interface
├── popup.css        # Modern styling with animations
├── popup.js         # Core functionality & API integration
├── background.js    # Service worker
└── content.js       # Web page interaction

```

### Permissions
- `activeTab` - Screenshot capture of current tab
- `scripting` - Content script injection
- `storage` - Local API key persistence

## 🔒 Privacy & Security

- ✅ **No Data Collection**: Screenshots are processed in real-time and never stored
- ✅ **Local Storage Only**: API keys stored locally using Chrome's secure storage
- ✅ **No Tracking**: Zero analytics or user behavior monitoring
- ✅ **Direct API**: All communication goes directly to Google's Gemini API
- ✅ **Minimal Permissions**: Only requests necessary Chrome extension permissions

## 🧪 Testing

A test page (`test.html`) is included with mock chat interfaces to test the extension:

1. Open `test.html` in your browser
2. Use the extension on this page to verify functionality
3. Test different tone/personality combinations

## 🤝 Contributing

While this is a personal project, you're welcome to:
- Fork the repository for your own modifications
- Report bugs or suggest improvements via issues
- Submit pull requests for bug fixes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This extension is for entertainment purposes. Use generated flirt lines responsibly and respectfully. The AI-generated content may not always be appropriate for every situation. Always consider the context and your relationship with the recipient.

## 🙏 Acknowledgments

- Built with [Google Gemini Vision API](https://developers.generativeai.google/)
- Icons and animations inspired by modern design systems
- Typography powered by [Inter font family](https://rsms.me/inter/)

---

**Ready to level up your chat game? Install FlirtGPT and start generating amazing flirt lines! 💬✨**

*Remember: Rizz responsibly!* 😉
