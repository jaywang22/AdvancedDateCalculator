# Advanced Date Calculator

A powerful, intuitive date calculator that works as both a Chrome extension and a Progressive Web App (PWA). Calculate dates forward or backward from any starting date, find the time between two dates, and perform compound calculations with multiple time periods.

![Advanced Date Calculator](Calendar_Icon.png)

## ✨ Features

- **📅 Dual Calendar Interface** - Visual calendars for both starting and resulting dates
- **🔢 Quick Presets** - Buttons for 1-20 for rapid date selection
- **➕ Compound Calculations** - Add multiple time periods together (e.g., "3 weeks + 5 days + 2 months")
- **📆 Multiple Time Units** - Calculate in days, weeks, months, or years
- **⏮️ Forward & Backward** - Calculate dates both after and before your starting date
- **💼 Weekdays Only** - Option to count only business days (Monday-Friday)
- **🔄 Time Between Dates** - Click dates on both calendars to find the duration between them
- **📊 Smart Breakdowns** - View results in multiple formats (years, months, weeks, days)
- **⌨️ Keyboard Shortcuts** - Fast navigation with keyboard commands
- **🌙 Dark Mode Support** - Automatically adapts to your system preference
- **📱 Works Offline** - Full functionality without internet connection
- **💾 No Data Collection** - All calculations happen locally in your browser

## 🚀 Try It Now

### As a Web App
Visit: **[https://jaywang22.github.io/advanced-date-calculator/](https://jaywang22.github.io/advanced-date-calculator/)**

You can install it as a PWA:
1. Click the install icon in your browser's address bar
2. Or go to browser menu → "Install Advanced Date Calculator"
3. Use it like a native app on your desktop or mobile device!

### As a Chrome Extension
Install from the [Chrome Web Store](#) *(link coming soon)*

Or install manually:
1. Download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the downloaded folder

## 📖 How to Use

### Basic Calculation
1. **Select a starting date** on the left calendar (today is selected by default)
2. **Choose a number** using the preset buttons (1-20) or type any number
3. **Select a unit** (days, weeks, months, or years)
4. **Choose direction** (after or before)
5. The result appears immediately on the right calendar!

### Compound Calculations
Want to calculate "3 weeks + 5 days from today"?
1. Enter `3`, select `Weeks`, click the **+** button
2. Enter `5`, select `Days`
3. See the combined result!

### Time Between Two Dates
1. Select a date on the left calendar
2. Click a date on the right calendar
3. See the time difference with optional breakdowns

### Weekdays Only
When calculating with days:
1. Check the **"Weekdays only"** option
2. Calculation will skip weekends (Saturday & Sunday)
3. Perfect for business day calculations!

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `T` | Select Today |
| `C` | Copy Result |
| `R` | Reset/Clear |
| `?` | Show Help |
| `↑` | Increase Number |
| `↓` | Decrease Number |
| `Esc` | Close Help Modal |

## 🛠️ Technical Details

- **Built with:** Pure HTML, CSS, and JavaScript
- **No dependencies** - Completely standalone
- **Size:** < 100KB total
- **Browser Support:** Chrome, Edge, Firefox, Safari (all modern browsers)
- **Mobile Friendly:** Responsive design works on all screen sizes

## 📦 Files Structure

```
advanced-date-calculator/
├── index.html          # Main HTML file (PWA version)
├── popup.html          # Chrome extension popup
├── popup.css           # Styles (shared)
├── popup.js            # JavaScript logic (shared)
├── manifest.json       # Chrome extension manifest
├── sw.js               # Service worker for PWA
├── Calendar_Icon.png   # 128x128 icon
├── Calendar_Icon_48.png # 48x48 icon
└── Calendar_Icon_16.png # 16x16 icon
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is [MIT](LICENSE) licensed.

## 🙏 Acknowledgments

- Inspired by the need for a simple, powerful date calculator
- Built with care for developers, project managers, and anyone who works with dates

## 💡 Use Cases

- **Project Management** - Calculate project milestones and deadlines
- **Event Planning** - Determine dates for events and RSVPs
- **Business** - Calculate invoice due dates, delivery dates
- **Personal** - Track important dates, anniversaries, countdowns
- **Legal/Finance** - Calculate payment terms, contract dates
- **HR** - Calculate notice periods, probation end dates

---

Made with ❤️ for everyone who needs to work with dates

**[Install Now](https://jaywang22.github.io/advanced-date-calculator/)** | **[Report Bug](#)** | **[Request Feature](#)**
