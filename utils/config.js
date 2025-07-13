// Load environment variables
require("dotenv").config();

/**
 * Configuration object with all settings derived from environment variables
 */
const config = {
  // Discord webhook URLs (comma-separated in .env)
  discord: {
    webhookUrls: process.env.DISCORD_WEBHOOK_URLS
      ? process.env.DISCORD_WEBHOOK_URLS.split(",")
      : [],
    targetRoleIds: process.env.DISCORD_TARGET_ROLE_IDS
      ? process.env.DISCORD_TARGET_ROLE_IDS.split(",")
      : [],
  },

  // API configuration
  api: {
    animeScheduleToken: process.env.ANIME_SCHEDULE_API_TOKEN,
    baseUrl: "https://animeschedule.net/api/v3",
    imageBaseUrl: "https://img.animeschedule.net/production/assets/public/img/",
  },

  // Time and date settings
  time: {
    timezone: process.env.TIMEZONE || "Asia/Kolkata", // Default: Kolkata
    cronSchedule: process.env.CRON_SCHEDULE || "0 0 * * *", // Default: midnight daily
    dateOptions: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    timeOptions: {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  },

  // Application settings
  app: {
    environment: process.env.NODE_ENV || "development", // Default: development
    debug: process.env.DEBUG === "true", // Default: false
    retryOptions: {
      maxRetries: parseInt(process.env.MAX_RETRIES || "10", 10), // Default: 10
      retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || "10000", 10), // Default: 10000
    },
  },
};

/**
 * Validates the configuration and logs warnings for missing required values
 * @returns {boolean} - Whether the configuration is valid
 */
function validateConfig() {
  let isValid = true;

  // Check required webhook URLs
  if (config.discord.webhookUrls.length === 0) {
    console.warn(
      "[Config] No webhook URLs configured. Please add at least one webhook URL to DISCORD_WEBHOOK_URLS environment variable."
    );
    isValid = false;
  }

  // Check required API token
  if (!config.api.animeScheduleToken) {
    console.warn(
      "[Config] Missing API token. Please add ANIME_SCHEDULE_API_TOKEN environment variable."
    );
    isValid = false;
  }

  // Log info about optional configurations
  if (config.discord.targetRoleIds.length === 0) {
    console.info(
      "[Config] No target roles specified; will post without mentions."
    );
  }

  return isValid;
}

// Add timezone to the date and time options
config.time.dateOptions.timeZone = config.time.timezone;
config.time.timeOptions.timeZone = config.time.timezone;

module.exports = {
  config,
  validateConfig,
};
