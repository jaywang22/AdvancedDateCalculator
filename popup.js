let selectedUnit = "weeks";
let selectedDirection = "after";
let lastAmount = null;
let lastPresetButton = null;
let copyPressed = false;

// Track toggle preferences
let showMonthsInBreakdown = false;
let showYearsInBreakdown = false;

let useWeekdaysOnly = false;

// Track compound calculation state
let isAddingMode = false;
let compoundPeriods = [];
let compoundBaseDate = null;
let waitingForUnit = false; // New variable to track if we need unit selection

// Enable/disable add button based on whether a number AND unit are selected
function updateAddButton() {
  const addBtn = document.getElementById("addBtn");
  const hasNumber = lastAmount !== null && lastAmount > 0;
  const hasUnit = document.querySelector("#unitButtons button.selected") !== null;
  
  if (hasNumber && hasUnit && !waitingForUnit) {
    addBtn.disabled = false;
    addBtn.classList.remove("selected");
  } else {
    addBtn.disabled = true;
  }
}

// Weekday only calcuation
function addWeekdays(date, numDays) {
  const result = new Date(date);
  let daysAdded = 0;
  const direction = numDays >= 0 ? 1 : -1;
  const absNumDays = Math.abs(numDays);
  
  while (daysAdded < absNumDays) {
    result.setDate(result.getDate() + direction);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }
  
  return normalizeDate(result);
}

// Helper function to trigger animation
function triggerResultAnimation() {
  const resultElement = document.getElementById("result");
  resultElement.style.animation = 'none';
  resultElement.offsetHeight; // Trigger reflow
  resultElement.style.animation = '';
}

function calculationUsesDays(periods) {
  return periods.some(period => period.unit === "days");
}

// --- Normalize dates to midnight ---
function normalizeDate(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Track selected base date
let baseDate = normalizeDate(new Date());
let currentCalendarDate = normalizeDate(new Date());
let currentResultDate = normalizeDate(new Date());

// Calendar elements
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const resultMonthSelect = document.getElementById("resultMonthSelect");
const resultYearSelect = document.getElementById("resultYearSelect");
const calendarDays = document.getElementById("calendarDays");
const resultCalendarDays = document.getElementById("resultCalendarDays");

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// --- Populate month dropdowns ---
function populateMonthSelect(selectElement) {
  selectElement.innerHTML = "";
  monthNames.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = month;
    selectElement.appendChild(option);
  });
}

// --- Populate year dropdowns (range: 1900 to 2100) ---
function populateYearSelect(selectElement, currentYear) {
  selectElement.innerHTML = "";
  for (let year = 1900; year <= 2100; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    if (year === currentYear) option.selected = true;
    selectElement.appendChild(option);
  }
}

// --- Initialize dropdowns ---
populateMonthSelect(monthSelect);
populateMonthSelect(resultMonthSelect);
populateYearSelect(yearSelect, new Date().getFullYear());
populateYearSelect(resultYearSelect, new Date().getFullYear());

// --- Calendar render function ---
function renderCalendarForDate(date, monthSelectEl, yearSelectEl, daysContainerEl, isTopCalendar = false) {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Update dropdowns
  monthSelectEl.value = month;
  yearSelectEl.value = year;

  daysContainerEl.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = 42;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");

    if (i >= firstDay && i < firstDay + daysInMonth) {
      const day = i - firstDay + 1;
      cell.textContent = day;

      const cellDate = normalizeDate(new Date(year, month, day));

      if (isTopCalendar) {
        const today = normalizeDate(new Date());
        if (cellDate.getTime() === today.getTime()) cell.classList.add("today");
        if (cellDate.getTime() === baseDate.getTime()) cell.classList.add("highlight");

        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => {
          baseDate = cellDate;
          renderCalendarForDate(currentCalendarDate, monthSelect, yearSelect, calendarDays, true);
          updateTodayButton();

          if (window.lastCalculatedDate) {
            handleResultCalendarClick(window.lastCalculatedDate);
          }

          if (lastAmount !== null) calculateAndDisplay(lastAmount);
        });
      }

      if (!isTopCalendar) {
        if (window.lastCalculatedDate && cellDate.getTime() === normalizeDate(window.lastCalculatedDate).getTime()) {
          cell.classList.add("highlight");
        }

        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => {
          handleResultCalendarClick(cellDate);

          if (lastPresetButton) {
            lastPresetButton.classList.remove("selected");
            lastPresetButton = null;
          }
          amountInput.value = "";
          lastAmount = null;
        });
      }

    } else {
      cell.classList.add("empty");
    }

    daysContainerEl.appendChild(cell);
  }
}

// --- Calendar navigation (prev/next buttons) ---
document.getElementById("prevMonth").addEventListener("click", () => {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendarForDate(currentCalendarDate, monthSelect, yearSelect, calendarDays, true);
});
document.getElementById("nextMonth").addEventListener("click", () => {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendarForDate(currentCalendarDate, monthSelect, yearSelect, calendarDays, true);
});
document.getElementById("prevResultMonth").addEventListener("click", () => {
  currentResultDate.setMonth(currentResultDate.getMonth() - 1);
  renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);
});
document.getElementById("nextResultMonth").addEventListener("click", () => {
  currentResultDate.setMonth(currentResultDate.getMonth() + 1);
  renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);
});

// --- Dropdown navigation for starting calendar ---
monthSelect.addEventListener("change", () => {
  currentCalendarDate.setMonth(parseInt(monthSelect.value));
  renderCalendarForDate(currentCalendarDate, monthSelect, yearSelect, calendarDays, true);
});

yearSelect.addEventListener("change", () => {
  currentCalendarDate.setFullYear(parseInt(yearSelect.value));
  renderCalendarForDate(currentCalendarDate, monthSelect, yearSelect, calendarDays, true);
});

// --- Dropdown navigation for result calendar ---
resultMonthSelect.addEventListener("change", () => {
  window.lastCalculatedDate = null;
  document.getElementById("result").innerHTML = "";
  document.getElementById("result").dataset.dateOnly = "";

  currentResultDate.setMonth(parseInt(resultMonthSelect.value));
  renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);
});

resultYearSelect.addEventListener("change", () => {
  window.lastCalculatedDate = null;
  document.getElementById("result").innerHTML = "";
  document.getElementById("result").dataset.dateOnly = "";

  currentResultDate.setFullYear(parseInt(resultYearSelect.value));
  renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);
});

// --- Today button ---
const todayButton = document.getElementById("todayButton");
function updateTodayButton() {
  const today = normalizeDate(new Date());
  if (baseDate.getTime() === today.getTime()) {
    todayButton.classList.add("selected");
    todayButton.textContent = "Today Selected";
  } else {
    todayButton.classList.remove("selected");
    todayButton.textContent = "Select Today (T)";
  }
}
todayButton.addEventListener("click", () => {
  // 1. Set baseDate to today and re-render the starting calendar
  baseDate = normalizeDate(new Date());
  currentCalendarDate = normalizeDate(new Date());
  renderCalendarForDate(currentCalendarDate, monthSelect, yearSelect, calendarDays, true);
  updateTodayButton();

  // Ensure the preset button style remains if it was the last input
  if (lastPresetButton) lastPresetButton.classList.add("selected");

  // 2. Determine the mode based on the last action:
  
  if (lastAmount !== null) {
    // MODE A: Calculation Mode (3 weeks/months/days from today)
    // The last action was entering a number (preset or input). Recalculate based on that number.
    calculateAndDisplay(lastAmount);

  } else if (window.lastCalculatedDate) {
    // MODE B: Date Difference Mode (Time between Today and the last result date)
    // The last action was a click on the result calendar (or a previous calculation).
    // Calculate the time difference between the newly selected 'Today' and the date in the result calendar.
    handleResultCalendarClick(window.lastCalculatedDate);
    
  } else {
    // MODE C: Reset State
    // No prior calculation or second date selected. Clear the result display.
    document.getElementById("result").innerHTML = "";
    document.getElementById("result").dataset.dateOnly = "";
    window.lastCalculatedDate = null;
    
    // Reset the result calendar view to the current month if it wasn't already.
    currentResultDate = normalizeDate(new Date());
    renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);
  }
});

updateTodayButton();

// --- Initial render ---
renderCalendarForDate(currentCalendarDate, monthSelect, yearSelect, calendarDays, true);
renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);

// --- Result calculation ---
const presetGrid = document.getElementById("presetGrid");
const amountInput = document.getElementById("amountInput");

function calculateAndDisplay(amount) {
  lastAmount = amount;
  const resultElement = document.getElementById("result");

  if (isNaN(amount) || amount < 0) {
    resultElement.textContent = "Please enter a valid positive number.";
    return;
  }

  // If we just entered a number after clicking +, don't calculate yet
  if (waitingForUnit) {
    return;
  }

  // If we're starting fresh (not in adding mode), reset compound
  if (!isAddingMode) {
    compoundBaseDate = new Date(baseDate);
    compoundPeriods = [];
  }
  
  // Add current period to the list (will be calculated below)
  const currentPeriod = {
    amount: amount,
    unit: selectedUnit,
    direction: selectedDirection
  };

  // Calculate the final date by applying all saved periods plus current one
  const targetDate = normalizeDate(new Date(compoundBaseDate));
  const allPeriods = [...compoundPeriods, currentPeriod];
  
  allPeriods.forEach(period => {
    const multiplier = period.direction === "before" ? -1 : 1;
    switch (period.unit) {
      case "days":
        if (useWeekdaysOnly) {
          targetDate.setTime(addWeekdays(targetDate, period.amount * multiplier).getTime());
          } else {
          targetDate.setDate(targetDate.getDate() + period.amount * multiplier);
          }
        break;
      case "weeks": 
        targetDate.setDate(targetDate.getDate() + period.amount * 7 * multiplier); 
        break;
      case "months": 
        const originalDay = targetDate.getDate();
        const originalMonth = targetDate.getMonth();
        const originalYear = targetDate.getFullYear();
        
        // Calculate target month/year first
        let newMonth = originalMonth + (period.amount * multiplier);
        let newYear = originalYear;
        
        // Handle year overflow
        while (newMonth >= 12) {
          newMonth -= 12;
          newYear++;
        }
        while (newMonth < 0) {
          newMonth += 12;
          newYear--;
        }
        
        // Get max day in target month
        const maxDayInTargetMonth = new Date(newYear, newMonth + 1, 0).getDate();
        const dayToUse = Math.min(originalDay, maxDayInTargetMonth);
        
        // IMPORTANT: Set day to 1 first to avoid auto-correction issues
        targetDate.setDate(1);
        targetDate.setFullYear(newYear);
        targetDate.setMonth(newMonth);
        targetDate.setDate(dayToUse);
        break;
    }
  });

  window.lastCalculatedDate = normalizeDate(targetDate);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = targetDate.toLocaleDateString(undefined, options);

  const today = normalizeDate(new Date());
  const isToday = compoundBaseDate.getTime() === today.getTime();
  const baseFormattedFullDate = compoundBaseDate.toLocaleDateString(undefined, options);
  const basePhrase = isToday ? "today" : baseFormattedFullDate;

  // Build the description of all periods
  let periodsText = allPeriods.map(period => {
    const unitLabel = period.amount === 1 ? period.unit.slice(0, -1) : period.unit;
    // If it's days and weekdays only is checked, use "weekday(s)" instead
    if (period.unit === "days" && useWeekdaysOnly) {
      return `${period.amount} ${period.amount === 1 ? "weekday" : "weekdays"}`;
    }
    return `${period.amount} ${unitLabel}`;
  }).join(", ");

  // Determine if all are after or all are before
  const allAfter = allPeriods.every(p => p.direction === "after");
  const allBefore = allPeriods.every(p => p.direction === "before");
  
  let fromText;
  if (allAfter) {
    fromText = `from ${basePhrase} will be`;
  } else if (allBefore) {
    fromText = `before ${basePhrase} was`;
  } else {
    fromText = `from ${basePhrase} will be`;
  }

  resultElement.innerHTML = `${periodsText} ${fromText}<br><strong>${formattedDate}</strong>`;
  resultElement.dataset.dateOnly = formattedDate;

  // Add weekdays-only checkbox if calculation uses days  <-- INSERT HERE
  if (calculationUsesDays(allPeriods)) {
    resultElement.innerHTML += `
      <div class="months-toggle">
        <label>
          <input type="checkbox" id="weekdaysOnlyCheckbox" ${useWeekdaysOnly ? 'checked' : ''}>
          Weekdays only
        </label>
      </div>
  ` ;
  
    setTimeout(() => {
      const weekdaysCheckbox = document.getElementById("weekdaysOnlyCheckbox");
      if (weekdaysCheckbox) {
        weekdaysCheckbox.addEventListener("change", () => {
          useWeekdaysOnly = weekdaysCheckbox.checked;
          calculateAndDisplay(lastAmount);
        });
      }
    }, 0);
  }

  currentResultDate = normalizeDate(targetDate);
  renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);

  if (copyPressed) {
    const copyBtn = document.getElementById("copyBtn");
    copyBtn.textContent = "Copy Result";
    copyPressed = false;
  }
  
  updateAddButton();
  triggerResultAnimation();
}

// Calculate and display only the saved compound periods (when no current input)
function calculateCompoundOnly() {
  if (compoundPeriods.length === 0) return;
  
  const resultElement = document.getElementById("result");
  
  // Calculate the final date by applying all saved periods
  const targetDate = normalizeDate(new Date(compoundBaseDate));
  
  compoundPeriods.forEach(period => {
    const multiplier = period.direction === "before" ? -1 : 1;
    switch (period.unit) {
      case "days":
        if (useWeekdaysOnly) {
          targetDate.setTime(addWeekdays(targetDate, period.amount * multiplier).getTime());
          } else {
          targetDate.setDate(targetDate.getDate() + period.amount * multiplier);
          }
        break;
      case "weeks": 
        targetDate.setDate(targetDate.getDate() + period.amount * 7 * multiplier); 
        break;
      case "months": 
        const originalDay = targetDate.getDate();
        const originalMonth = targetDate.getMonth();
        const originalYear = targetDate.getFullYear();
        
        // Calculate target month/year first
        let newMonth = originalMonth + (period.amount * multiplier);
        let newYear = originalYear;
        
        // Handle year overflow
        while (newMonth >= 12) {
          newMonth -= 12;
          newYear++;
        }
        while (newMonth < 0) {
          newMonth += 12;
          newYear--;
        }
        
        // Get max day in target month
        const maxDayInTargetMonth = new Date(newYear, newMonth + 1, 0).getDate();
        const dayToUse = Math.min(originalDay, maxDayInTargetMonth);
        
        // IMPORTANT: Set day to 1 first to avoid auto-correction issues
        targetDate.setDate(1);
        targetDate.setFullYear(newYear);
        targetDate.setMonth(newMonth);
        targetDate.setDate(dayToUse);
        break;
      case "years": 
        targetDate.setFullYear(targetDate.getFullYear() + period.amount * multiplier); 
        break;
    }
  });

  window.lastCalculatedDate = normalizeDate(targetDate);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = targetDate.toLocaleDateString(undefined, options);

  const today = normalizeDate(new Date());
  const isToday = compoundBaseDate.getTime() === today.getTime();
  const baseFormattedFullDate = compoundBaseDate.toLocaleDateString(undefined, options);
  const basePhrase = isToday ? "today" : baseFormattedFullDate;

  // Build the description of all periods
  let periodsText = compoundPeriods.map(period => {
    const unitLabel = period.amount === 1 ? period.unit.slice(0, -1) : period.unit;
    // If it's days and weekdays only is checked, use "weekday(s)" instead
    if (period.unit === "days" && useWeekdaysOnly) {
      return `${period.amount} ${period.amount === 1 ? "weekday" : "weekdays"}`;
    }
    return `${period.amount} ${unitLabel}`;
  }).join(", ");

  // Determine if all are after or all are before
  const allAfter = compoundPeriods.every(p => p.direction === "after");
  const allBefore = compoundPeriods.every(p => p.direction === "before");
  
  let fromText;
  if (allAfter) {
    fromText = `from ${basePhrase} will be`;
  } else if (allBefore) {
    fromText = `before ${basePhrase} was`;
  } else {
    fromText = `from ${basePhrase} will be`;
  }

  resultElement.innerHTML = `${periodsText} ${fromText}<br><strong>${formattedDate}</strong>`;
  resultElement.dataset.dateOnly = formattedDate;

    // Add weekdays-only checkbox if calculation uses days  <-- INSERT HERE
  if (calculationUsesDays(allPeriods)) {
    resultElement.innerHTML += `
      <div class="months-toggle">
        <label>
          <input type="checkbox" id="weekdaysOnlyCheckbox" ${useWeekdaysOnly ? 'checked' : ''}>
          Weekdays only
        </label>
      </div>
  ` ;
  
    setTimeout(() => {
      const weekdaysCheckbox = document.getElementById("weekdaysOnlyCheckbox");
      if (weekdaysCheckbox) {
        weekdaysCheckbox.addEventListener("change", () => {
          useWeekdaysOnly = weekdaysCheckbox.checked;
          calculateAndDisplay(lastAmount);
        });
      }
    }, 0);
  }

  currentResultDate = normalizeDate(targetDate);
  renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);

  if (copyPressed) {
    const copyBtn = document.getElementById("copyBtn");
    copyBtn.textContent = "Copy Result (C)";
    copyPressed = false;
  }
  
  triggerResultAnimation();
}

// --- Result calendar click ---
function handleResultCalendarClick(selectedDate) {
  const clicked = normalizeDate(new Date(selectedDate));
  const base = normalizeDate(baseDate);
  const diffMs = clicked - base;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const absDays = Math.abs(diffDays);

  const resultElement = document.getElementById("result");

  if (diffDays === 0) {
    const clickedFormatted = clicked.toLocaleDateString(undefined, { 
      weekday: "long", year: "numeric", month: "long", day: "numeric" 
    });
    resultElement.innerHTML = `<strong>${clickedFormatted}</strong><br>is the same as the starting date.`;
    resultElement.dataset.dateOnly = clickedFormatted;
    return;
  }

  const today = normalizeDate(new Date());
  const baseFormatted = (base.getTime() === today.getTime()) 
    ? "today" 
    : base.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const clickedFormatted = (clicked.getTime() === today.getTime()) 
    ? "today" 
    : clicked.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  let breakdown = "";
  
  if (absDays >= 7) {
    const weeks = Math.floor(absDays / 7);
    const remainingDays = absDays % 7;
    
    // Calculate actual calendar-based months and years
    const startDate = base < clicked ? base : clicked;
    const endDate = base < clicked ? clicked : base;
    
    // Show years and months if enabled
    if (showYearsInBreakdown && absDays >= 365) {
      let years = endDate.getFullYear() - startDate.getFullYear();
      let months = endDate.getMonth() - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();
      
      // Adjust if days are negative
      if (days < 0) {
        months--;
        const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += prevMonth.getDate();
      }
      
      // Adjust if months are negative
      if (months < 0) {
        years--;
        months += 12;
      }
      
      const weeks = Math.floor(days / 7);
      const finalDays = days % 7;
      
      const parts = [];
      if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
      if (months > 0) parts.push(`${months} month${months === 1 ? "" : "s"}`);
      if (weeks > 0) parts.push(`${weeks} week${weeks === 1 ? "" : "s"}`);
      if (finalDays > 0) parts.push(`${finalDays} day${finalDays === 1 ? "" : "s"}`);
      
      if (parts.length > 0) {
        breakdown = ` (${parts.join(", ")})`;
      }
    } else if (showMonthsInBreakdown && absDays >= 30) {
      // Calculate actual calendar months
      let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
      months += endDate.getMonth() - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();
      
      // Adjust if days are negative
      if (days < 0) {
        months--;
        const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += prevMonth.getDate();
      }
      
      const weeks = Math.floor(days / 7);
      const finalDays = days % 7;
      
      const parts = [];
      if (months > 0) parts.push(`${months} month${months === 1 ? "" : "s"}`);
      if (weeks > 0) parts.push(`${weeks} week${weeks === 1 ? "" : "s"}`);
      if (finalDays > 0) parts.push(`${finalDays} day${finalDays === 1 ? "" : "s"}`);
      
      if (parts.length > 0) {
        breakdown = ` (${parts.join(", ")})`;
      }
    } else {
      // Just show weeks and days
      const weekPart = weeks > 0 ? `${weeks} week${weeks === 1 ? "" : "s"}` : "";
      const dayPart = remainingDays > 0 ? `${remainingDays} day${remainingDays === 1 ? "" : "s"}` : "";
      breakdown = ` (${[weekPart, dayPart].filter(Boolean).join(", ")})`;
    }
  }

  const dayLabel = absDays === 1 ? "day" : "days";

  // Build result with breakdown on separate line if it exists
  let resultHTML = `
    The time between ${baseFormatted} and ${clickedFormatted} is<br>
    <strong>${absDays} ${dayLabel}</strong>
  `;

  // Add breakdown on separate line if it exists
    if (breakdown) {
    // Remove leading space and parentheses from breakdown for display
    const cleanBreakdown = breakdown.trim().replace(/^\(/, '').replace(/\)$/, '');
    resultHTML += `<span class="breakdown">(${cleanBreakdown})</span>`;
  }
  
  // Add toggle checkboxes based on the duration
  const hasYearsToggle = absDays >= 365;
  const hasMonthsToggle = absDays >= 30;

  if (hasYearsToggle || hasMonthsToggle) {
    resultHTML += `<div class="months-toggle"><div class="toggle-nested">`;
    
    if (hasYearsToggle) {
      // When >= 1 year, show years as parent
      resultHTML += `
        <label>
          <input type="checkbox" id="showYearsCheckbox" ${showYearsInBreakdown ? 'checked' : ''}>
          Show years
        </label>
      `;
      
      if (hasMonthsToggle) {
        resultHTML += `
          <label class="toggle-indent">
            <input type="checkbox" id="showMonthsCheckbox" ${showMonthsInBreakdown ? 'checked' : ''} ${showYearsInBreakdown ? 'disabled' : ''}>
            Show months
          </label>
        `;
      }
    } else if (hasMonthsToggle) {
      // When < 1 year but >= 30 days, just show months
      resultHTML += `
        <label>
          <input type="checkbox" id="showMonthsCheckbox" ${showMonthsInBreakdown ? 'checked' : ''}>
          Show months
        </label>
      `;
    }
    
    resultHTML += `</div></div>`;
  }
  
  resultElement.innerHTML = resultHTML;
  const fullResultText = breakdown ? `${absDays} ${dayLabel} ${breakdown.trim()}` : `${absDays} ${dayLabel}`;
  resultElement.dataset.dateOnly = fullResultText;

  // Re-attach event listeners to the new checkboxes
  if (hasYearsToggle) {
    const yearsCheckbox = document.getElementById("showYearsCheckbox");
    yearsCheckbox.addEventListener("change", () => {
      showYearsInBreakdown = yearsCheckbox.checked;
      // If checking years, automatically check months
      if (showYearsInBreakdown) {
        showMonthsInBreakdown = true;
      } else {
        // If unchecking years, also uncheck months
        showMonthsInBreakdown = false;
      }
      handleResultCalendarClick(clicked);
    });
  }

  if (hasMonthsToggle) {
    const monthsCheckbox = document.getElementById("showMonthsCheckbox");
    monthsCheckbox.addEventListener("change", () => {
      showMonthsInBreakdown = monthsCheckbox.checked;
      handleResultCalendarClick(clicked);
    });
  }

  window.lastCalculatedDate = clicked;
  currentResultDate = clicked;
  renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);
  triggerResultAnimation();
}

// --- Presets 1–20 ---
for (let i = 1; i <= 20; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.addEventListener("click", () => {
    // If we just completed an add operation AND + wasn't just clicked, exit adding mode
    if (isAddingMode && !waitingForUnit && !addBtn.classList.contains("selected")) {
      isAddingMode = false;
      compoundPeriods = [];
      addBtn.classList.remove("selected");
    }
    
    // Only reset selections if we're NOT currently using a non-default unit
    const currentUnitIsDefault = selectedUnit === "weeks";
    const currentDirectionIsDefault = selectedDirection === "after";
    const shouldReset = currentUnitIsDefault && currentDirectionIsDefault && !isAddingMode;
    
    if (shouldReset) {
      isAddingMode = false;
      compoundPeriods = [];
      waitingForUnit = false;
      addBtn.classList.remove("selected");
    }
    
    if (lastPresetButton) lastPresetButton.classList.remove("selected");
    btn.classList.add("selected");
    lastPresetButton = btn;
    amountInput.value = i;
    lastAmount = i;
    
    // Check if we were waiting for unit - if we have a unit selected, calculate now
    if (waitingForUnit) {
      const hasUnit = document.querySelector("#unitButtons button.selected") !== null;
      if (hasUnit) {
        waitingForUnit = false;
        calculateAndDisplay(i);
      }
    } else {
      // Normal calculation
      calculateAndDisplay(i);
    }
    
    updateTodayButton();
    updateAddButton();
  });
  presetGrid.appendChild(btn);
}


// --- Unit buttons ---
document.querySelectorAll("#unitButtons button").forEach(btn => {
  btn.addEventListener("click", () => {
    const addBtn = document.getElementById("addBtn");
    if (isAddingMode && !waitingForUnit && !addBtn.classList.contains("selected")) {
      isAddingMode = false;
      compoundPeriods = [];
      addBtn.classList.remove("selected");
    }
    document.querySelectorAll("#unitButtons button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedUnit = btn.getAttribute("data-unit");
    
    // Check if we were waiting for a unit and now have both number and unit
    if (waitingForUnit && lastAmount !== null) {
      waitingForUnit = false;
      calculateAndDisplay(lastAmount);
    } else if (lastAmount !== null && !waitingForUnit) {
      // Normal mode - recalculate with new unit
      calculateAndDisplay(lastAmount);
    }
    
    // Update add button state (in case unit was selected before number)
    updateAddButton();
  });
});

// --- Direction buttons ---
document.querySelectorAll("#directionButtons button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#directionButtons button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedDirection = btn.getAttribute("data-direction");
    
    // If we're in adding mode and have compound periods, recalculate everything with new direction
    if (isAddingMode && compoundPeriods.length > 0) {
      // Update direction for all saved periods AND current one
      compoundPeriods = compoundPeriods.map(period => ({
        ...period,
        direction: selectedDirection
      }));
      
      // Recalculate if we have a current amount
      if (lastAmount !== null && !waitingForUnit) {
        calculateAndDisplay(lastAmount);
      } else if (compoundPeriods.length > 0) {
        // If no current amount, just show the compound periods
        calculateCompoundOnly();
      }
    } else if (lastAmount !== null && !waitingForUnit) {
      // Normal mode - just recalculate current amount
      calculateAndDisplay(lastAmount);
    }
  });
});

// --- Manual input ---
amountInput.addEventListener("input", () => {
  const value = parseFloat(amountInput.value);
  if (!isNaN(value) && value >= 0) {
    if (isAddingMode && !waitingForUnit && !addBtn.classList.contains("selected")) {
      isAddingMode = false;
      compoundPeriods = [];
      waitingForUnit = false;
      addBtn.classList.remove("selected");
    }
    // Only reset selections if we're NOT currently using a non-default unit
    const currentUnitIsDefault = selectedUnit === "weeks";
    const currentDirectionIsDefault = selectedDirection === "after";
    const shouldReset = currentUnitIsDefault && currentDirectionIsDefault && !isAddingMode;
    
    if (shouldReset) {
      isAddingMode = false;
      compoundPeriods = [];
      waitingForUnit = false;
      addBtn.classList.remove("selected");
    }
    
    if (lastPresetButton) lastPresetButton.classList.remove("selected");
    const matchingBtn = Array.from(presetGrid.children).find(b => parseInt(b.textContent) === value);
    if (matchingBtn) { 
      matchingBtn.classList.add("selected"); 
      lastPresetButton = matchingBtn; 
    } else {
      lastPresetButton = null;
    }
    
    lastAmount = value;
    
    // Check if we were waiting for unit - if we have a unit selected, calculate now
    if (waitingForUnit) {
      const hasUnit = document.querySelector("#unitButtons button.selected") !== null;
      if (hasUnit) {
        waitingForUnit = false;
        calculateAndDisplay(value);
      }
    } else {
      // Normal calculation
      calculateAndDisplay(value);
    }
    
    updateTodayButton();
    updateAddButton();
  } else {
    lastAmount = null;
    updateAddButton();
  }
});

// --- Add button for compound calculations ---
const addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", () => {
  if (lastAmount === null || lastAmount <= 0) return;
  
  // Save current period to compound list
  compoundPeriods.push({
    amount: lastAmount,
    unit: selectedUnit,
    direction: selectedDirection
  });
  
  // Enter adding mode and wait for unit
  isAddingMode = true;
  waitingForUnit = true;
  addBtn.classList.add("selected");
  
  // Clear input and preset selection for next entry
  amountInput.value = "";
  if (lastPresetButton) {
    lastPresetButton.classList.remove("selected");
    lastPresetButton = null;
  }
  lastAmount = null;
  
  // Unselect only unit buttons (keep direction buttons selected)
  document.querySelectorAll("#unitButtons button").forEach(b => b.classList.remove("selected"));
  
  // Disable add button until next number AND unit are entered
  addBtn.disabled = true;
});

// --- Copy result ---
const copyBtn = document.getElementById("copyBtn");
// In the copy button handler, update to:
copyBtn.addEventListener("click", async () => {
  const resultElement = document.getElementById("result");
  // Use dataset.dateOnly which contains the full result with breakdown
  const textToCopy = resultElement.dataset.dateOnly || '';
  
  if (!textToCopy) {
    copyBtn.textContent = "Nothing to copy";
    setTimeout(() => {
      copyBtn.textContent = "Copy Result (C)";
    }, 1500);
    return;
  }
  
  try {
    await navigator.clipboard.writeText(textToCopy);
    copyBtn.textContent = "✓ Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy Result (C)";
      copyPressed = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
    copyBtn.textContent = "Copy failed";
    setTimeout(() => {
      copyBtn.textContent = "Copy Result (C)";
    }, 2000);
  }
});

// --- Clear/Reset button ---
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
  // Reset preset button selection
  if (lastPresetButton) {
    lastPresetButton.classList.remove("selected");
    lastPresetButton = null;
  }
  
  // Reset amount
  lastAmount = null;
  amountInput.value = "";
  
  // Reset compound calculation
  isAddingMode = false;
  compoundPeriods = [];
  compoundBaseDate = null;
  waitingForUnit = false;
  addBtn.classList.remove("selected");
  addBtn.disabled = true;
  
  // Reset to default unit and direction
  document.querySelectorAll("#unitButtons button").forEach(b => b.classList.remove("selected"));
  document.querySelector('[data-unit="weeks"]').classList.add("selected");
  selectedUnit = "weeks";
  
  document.querySelectorAll("#directionButtons button").forEach(b => b.classList.remove("selected"));
  document.querySelector('[data-direction="after"]').classList.add("selected");
  selectedDirection = "after";
  
  // Reset base date to today
  baseDate = normalizeDate(new Date());
  currentCalendarDate = normalizeDate(new Date());
  renderCalendarForDate(currentCalendarDate, monthSelect, yearSelect, calendarDays, true);
  updateTodayButton();
  
  // Clear result text
  document.getElementById("result").innerHTML = "";
  document.getElementById("result").dataset.dateOnly = "";
  window.lastCalculatedDate = null;
  
  // Reset result calendar to current month
  currentResultDate = normalizeDate(new Date());
  renderCalendarForDate(currentResultDate, resultMonthSelect, resultYearSelect, resultCalendarDays, false);
  
  // Reset copy button
  copyBtn.textContent = "Copy Result (C)";
  copyPressed = false;

  useWeekdaysOnly = false;
});

// --- Help modal ---
const helpBtn = document.getElementById("helpBtn");
const helpModal = document.getElementById("helpModal");
const closeHelp = document.getElementById("closeHelp");

helpBtn.addEventListener("click", () => {
  helpModal.classList.add("show");
});

closeHelp.addEventListener("click", () => {
  helpModal.classList.remove("show");
});

// Close modal when clicking outside
helpModal.addEventListener("click", (e) => {
  if (e.target === helpModal) {
    helpModal.classList.remove("show");
  }
});

// --- Keyboard shortcuts ---
document.addEventListener("keydown", (e) => {
  // Don't trigger shortcuts if typing in input
  if (document.activeElement === amountInput) {
    if (e.key === "Enter") {
      amountInput.blur(); // Remove focus to show result better
    }
    return;
  }
  
  // Don't trigger if help modal is open
  if (helpModal.classList.contains("show")) {
    if (e.key === "Escape") {
      helpModal.classList.remove("show");
    }
    return;
  }
  
  switch(e.key.toLowerCase()) {
    case "t":
      // Press 't' for today
      todayButton.click();
      break;
    case "c":
      // Press 'c' to copy (if there's a result)
      if (document.getElementById("result").textContent) {
        copyBtn.click();
      }
      break;
    case "r":
      // Press 'r' to clear/reset
      clearBtn.click();
      break;
    case "?":
      // Press '?' to open help
      helpModal.classList.add("show");
      break;
    case "escape":
      // Press 'Escape' to close help modal
      if (helpModal.classList.contains("show")) {
        helpModal.classList.remove("show");
      }
      break;
    case "arrowup":
      // Increase number
      if (lastAmount !== null && lastAmount < 9999) {
        const newValue = Math.floor(lastAmount) + 1;
        amountInput.value = newValue;
        amountInput.dispatchEvent(new Event('input'));
      }
      e.preventDefault();
      break;
    case "arrowdown":
      // Decrease number
      if (lastAmount !== null && lastAmount > 0) {
        const newValue = Math.floor(lastAmount) - 1;
        amountInput.value = newValue;
        amountInput.dispatchEvent(new Event('input'));
      }
      e.preventDefault();
      break;
  }
});

// --- Tooltips ---
const tooltip = document.getElementById("startingCalendarTooltip");
let tooltipShown = false;
function showTooltipOnce() {
  if (tooltipShown) return;
  tooltipShown = true;
  tooltip.classList.add("show");
  setTimeout(() => tooltip.classList.remove("show"), 1000);
}
document.getElementById("calendarContainer").addEventListener("mouseenter", showTooltipOnce);

const resultTooltip = document.getElementById("resultCalendarTooltip");
let resultTooltipShown = false;
function showResultTooltipOnce() {
  if (resultTooltipShown) return;
  resultTooltipShown = true;
  resultTooltip.classList.add("show");
  setTimeout(() => resultTooltip.classList.remove("show"), 1000);
}
document.getElementById("resultCalendarContainer").addEventListener("mouseenter", showResultTooltipOnce);

// --- Swipe Gestures for Mobile ---
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function handleSwipe(container, prevBtn, nextBtn) {
  const minSwipeDistance = 50;
  const swipeDistanceX = touchEndX - touchStartX;
  const swipeDistanceY = touchEndY - touchStartY;
  
  // Only trigger if horizontal swipe is dominant
  if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && Math.abs(swipeDistanceX) > minSwipeDistance) {
    if (swipeDistanceX > 0) {
      // Swipe right - go to previous month
      prevBtn.click();
    } else {
      // Swipe left - go to next month
      nextBtn.click();
    }
  }
}

// Starting calendar swipe
document.getElementById('calendarDays').addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.getElementById('calendarDays').addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe(
    document.getElementById('calendarDays'),
    document.getElementById('prevMonth'),
    document.getElementById('nextMonth')
  );
}, { passive: true });

// Result calendar swipe
document.getElementById('resultCalendarDays').addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.getElementById('resultCalendarDays').addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe(
    document.getElementById('resultCalendarDays'),
    document.getElementById('prevResultMonth'),
    document.getElementById('nextResultMonth')
  );
}, { passive: true });

// --- Prevent zoom on orientation change (iOS fix) ---
let viewportMeta = document.querySelector('meta[name="viewport"]');

function resetViewport() {
  // Force viewport reset on orientation change
  if (viewportMeta) {
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }
  
  // Scroll to top to reset any offset
  window.scrollTo(0, 0);
}

// Listen for orientation changes
window.addEventListener('orientationchange', () => {
  // Small delay to ensure orientation has changed
  setTimeout(resetViewport, 100);
});

// Also reset on page load
window.addEventListener('load', resetViewport);

// Prevent double-tap zoom on iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });