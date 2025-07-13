/**
 * Gets the current date and time in the specified timezone
 * @param {string} timezone - The timezone to use (e.g., 'Asia/Kolkata')
 * @returns {Date} - Date object representing current time in the specified timezone
 */
function getCurrentDateInTimezone(timezone) {
  // Get the current date in UTC
  const utcDate = new Date();

  // Format the date string in the target timezone
  const tzDateString = utcDate.toLocaleString("en-US", { timeZone: timezone });

  // Parse the timezone-adjusted date string back into a Date object
  const tzDate = new Date(tzDateString);

  return tzDate;
}

/**
 * Gets the date at midnight in the specified timezone for a given date
 * @param {Date} date - The date to get midnight for (defaults to current date)
 * @param {string} timezone - The timezone to use
 * @returns {Date} - Date object representing midnight in the specified timezone
 */
function getMidnightInTimezone(date = new Date(), timezone) {
  // Format the date as a string in the target timezone, setting time to midnight
  const dateStr = formatDate(date, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  });

  // Parse the date string with time set to midnight
  const [month, day, year] = dateStr.split("/");
  const midnightStr = `${month}/${day}/${year} 00:00:00`;
  const midnightDate = new Date(midnightStr);

  return midnightDate;
}

/**
 * Calculates the ISO week number and year for a given date
 * @param {Date} date - The date to calculate for
 * @param {string} timezone - The timezone to use
 * @returns {Object} - Object containing year and weekNumber
 */
function getISOWeekData(date, timezone) {
  // Get the year
  const year = date.getFullYear();

  // Use ISO week date calculation for consistency across environments
  // ISO weeks start on Monday and the first week of the year contains January 4th
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  // January 4 is always in week 1
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1
  const weekNumber =
    1 +
    Math.round(
      ((tempDate.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );

  console.info(
    `[getISOWeekData] Date: ${date.toISOString()}, Year: ${year}, Week: ${weekNumber}, Timezone: ${timezone}`
  );

  return { year, weekNumber };
}

/**
 * Formats a date according to the specified options
 * @param {Date} date - The date to format
 * @param {Object} options - Formatting options
 * @param {string} timezone - The timezone to use
 * @returns {string} - Formatted date string
 */
function formatDate(date, options, timezone) {
  return date.toLocaleDateString("en-US", { ...options, timeZone: timezone });
}

/**
 * Formats a time according to the specified options
 * @param {Date} date - The date to format
 * @param {Object} options - Formatting options
 * @param {string} timezone - The timezone to use
 * @returns {string} - Formatted time string
 */
function formatTime(date, options, timezone) {
  return date.toLocaleTimeString("en-US", { ...options, timeZone: timezone });
}

module.exports = {
  getCurrentDateInTimezone,
  getMidnightInTimezone,
  getISOWeekData,
  formatDate,
  formatTime,
};
