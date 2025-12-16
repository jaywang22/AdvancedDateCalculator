# Changelog

All notable changes to Advanced Date Calculator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2024-12-16

### Added
- **Weekdays Only Mode** - New checkbox to count only business days (Monday-Friday)
  - Automatically skips weekends when calculating with days
  - Appears when using days in any calculation
  - Works with compound calculations
- **PWA Support** - Now available as a Progressive Web App
  - Full offline functionality with service worker
  - Installable on desktop and mobile devices
  - Works alongside Chrome extension version

### Fixed
- Month calculations now correctly handle edge cases (e.g., Jan 31 + 1 month = Feb 28/29)
- Improved compound calculation state management
- Fixed adding mode exit behavior when clicking numbers or units after completion

### Changed
- Updated manifest description for better clarity
- Improved icon sizes (16px, 48px, 128px)
- Enhanced dark mode support
- Result text now shows "weekdays" instead of "days" when weekdays-only is enabled

## [2.0.0] - 2024-12-15

### Added
- **Compound Calculations** - Add multiple time periods together
  - Click + button to chain calculations (e.g., "3 weeks + 5 days + 2 months")
  - Visual feedback for adding mode
  - Smart state management for complex calculations
- **Enhanced Time Between Dates**
  - Click dates on both calendars to find duration
  - Optional breakdowns showing years, months, weeks, and days
  - Nested toggle options for detailed views
- **Keyboard Shortcuts**
  - T: Select Today
  - C: Copy Result
  - R: Reset
  - ?: Show Help
  - ↑/↓: Increase/Decrease number
- **Help Modal** - Comprehensive in-app documentation
- **Visual Improvements**
  - Smooth animations for results
  - Hover effects on calendar dates
  - Today indicator with pulsing animation
  - Better visual hierarchy

### Changed
- Redesigned three-column layout for better workflow
- Improved calendar navigation with month/year dropdowns
- Enhanced mobile responsiveness
- Modernized color scheme with blue accents
- Better dark mode implementation

## [1.0.0] - 2024-11-01

### Added
- Initial release
- Basic date calculations (days, weeks, months, years)
- Dual calendar interface
- Quick preset buttons (1-20)
- Before/After direction toggle
- Copy result functionality
- Manual number input
- Today button for quick reset
- Dark mode support
- Chrome extension format

---

## Upcoming Features

See our [GitHub Issues](https://github.com/jaywang22/advanced-date-calculator/issues) for planned features and enhancements.

### Under Consideration
- Keyboard shortcuts for units (D/W/M/Y)
- Custom holiday/weekend definitions
- Multiple calendar systems
- Date templates and presets
- Calculation history
- Time calculations (hours/minutes)
- Internationalization (i18n)