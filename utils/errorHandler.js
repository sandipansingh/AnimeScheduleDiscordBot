/**
 * Formats and logs error messages with consistent structure
 * @param {string} context - The context where the error occurred
 * @param {Error} error - The error object
 * @param {Object} [additionalInfo={}] - Any additional information to log
 */
function logError(context, error, additionalInfo = {}) {
  console.error(`[${context}] Error: ${error.message}`);

  // Log stack trace in development
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${context}] Stack: ${error.stack}`);
  }

  // Log additional information if provided
  if (Object.keys(additionalInfo).length > 0) {
    console.error(
      `[${context}] Additional Info:`,
      JSON.stringify(additionalInfo, null, 2)
    );
  }

  // Log response data if available
  if (error.response) {
    console.error(`[${context}] Response Status:`, error.response.status);
    console.error(`[${context}] Response Data:`, error.response.data);
  }
}

/**
 * Handles errors with appropriate actions based on error type
 * @param {string} context - The context where the error occurred
 * @param {Error} error - The error object
 * @param {Object} [options={}] - Options for error handling
 * @param {boolean} [options.exit=false] - Whether to exit the process on error
 * @param {number} [options.exitCode=1] - Exit code to use if exiting
 */
function handleError(context, error, options = {}) {
  const { exit = false, exitCode = 1 } = options;

  // Log the error
  logError(context, error);

  // Exit if specified
  if (exit) {
    console.error(`[${context}] Exiting due to error.`);
    process.exit(exitCode);
  }
}

module.exports = {
  logError,
  handleError,
};
