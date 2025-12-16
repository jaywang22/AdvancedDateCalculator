# Contributing to Advanced Date Calculator

Thank you for considering contributing to Advanced Date Calculator! This document provides guidelines for contributing to the project.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Browser/OS information**

**Example:**
```
Title: Weekdays calculation incorrect when crossing month boundary

Description: When calculating 10 weekdays from Jan 28, 2024, the result 
shows Feb 9 instead of Feb 11.

Steps to reproduce:
1. Select Jan 28, 2024 as starting date
2. Enter 10, select Days
3. Check "Weekdays only"
4. Result shows Feb 9 (should be Feb 11)

Browser: Chrome 120.0 on Windows 11
```

### Suggesting Features

Feature requests are welcome! Please include:

- **Clear use case** - Why is this feature needed?
- **Proposed behavior** - How should it work?
- **Alternatives considered** - Any other approaches?
- **Mockups/examples** if applicable

### Pull Requests

1. **Fork** the repository
2. **Create a branch** for your feature (`git checkout -b feature/AmazingFeature`)
3. **Make your changes** with clear commit messages
4. **Test thoroughly** - Ensure all existing functionality still works
5. **Update documentation** if needed
6. **Submit a pull request**

## 📝 Code Style Guidelines

### JavaScript
- Use `const` and `let`, avoid `var`
- Use descriptive variable names
- Add comments for complex logic
- Keep functions focused and single-purpose
- Use consistent indentation (2 spaces)

```javascript
// Good
function calculateWeekdays(startDate, numDays) {
  const result = new Date(startDate);
  let daysAdded = 0;
  // ... implementation
}

// Avoid
function calc(d, n) {
  var r = new Date(d);
  // ... implementation
}
```

### CSS
- Follow existing naming conventions
- Use semantic class names
- Maintain consistent spacing
- Group related properties together
- Add comments for complex selectors

### HTML
- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Keep structure clean and readable
- Use consistent indentation

## 🧪 Testing

Before submitting a PR, test:

- ✅ Basic date calculations (days, weeks, months, years)
- ✅ Compound calculations with multiple periods
- ✅ Time between two dates
- ✅ Weekdays-only calculations
- ✅ Edge cases (month boundaries, leap years, etc.)
- ✅ Keyboard shortcuts
- ✅ Mobile responsiveness
- ✅ Dark mode
- ✅ Both Chrome extension and PWA versions

## 🔍 Areas That Need Help

- **Mobile optimization** - Improving touch interactions
- **Accessibility** - Enhanced screen reader support
- **Internationalization** - Support for different date formats and languages
- **Additional features** - See open feature requests in Issues
- **Documentation** - Improving guides and examples
- **Testing** - Writing automated tests

## 💡 Feature Ideas Welcome

Some ideas for future enhancements:
- Multiple calendar systems (Gregorian, Julian, etc.)
- Holiday/weekend customization by country
- Date range calculations
- Recurring date patterns
- Export/import calculations
- Calculation history
- Time calculations (hours, minutes)
- Date templates/presets

## 📋 Development Setup

1. Clone the repository
```bash
git clone https://github.com/jaywang22/advanced-date-calculator.git
cd advanced-date-calculator
```

2. Open in your preferred editor

3. For Chrome extension testing:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project folder

4. For PWA testing:
   - Use a local server (e.g., `python -m http.server 8000`)
   - Open `http://localhost:8000` in your browser
   - Test service worker and offline functionality

## 🎨 Design Principles

When contributing, keep these principles in mind:

- **Simplicity** - Keep the UI clean and intuitive
- **Speed** - Operations should feel instant
- **Accessibility** - Everyone should be able to use it
- **No dependencies** - Keep the project lightweight
- **Privacy** - No data collection, everything stays local
- **Cross-platform** - Works everywhere (extension + PWA)

## 📞 Questions?

Feel free to open an issue for:
- Questions about the codebase
- Clarification on how something works
- Discussion about potential changes

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

---

Thank you for contributing! Every contribution, no matter how small, helps make this project better. 🎉