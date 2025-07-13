// Import utilities
const cron = require("node-cron");
const { config, validateConfig } = require("./utils/config");
const { fetchWithRetry, fetchAnimeSchedule } = require("./utils/apiService");
const { formatScheduleForDiscord } = require("./utils/discordFormatter");
const { sendToDiscord } = require("./utils/discordService");
const { handleError } = require("./utils/errorHandler");

/**
 * Main function to fetch and broadcast anime schedule to Discord
 */
async function broadcastAnimeSchedule() {
  // Validate configuration before proceeding
  if (!validateConfig()) {
    process.exit(1);
  }

  try {
    console.info("[broadcastAnimeSchedule] Fetching anime airing schedule...");
    const scheduleData = await fetchWithRetry(
      () => fetchAnimeSchedule(),
      config.app.retryOptions.maxRetries,
      config.app.retryOptions.retryDelayMs
    );

    console.info("[broadcastAnimeSchedule] Formatting data for Discord...");
    const webhookData = await formatScheduleForDiscord(scheduleData);

    console.info("[broadcastAnimeSchedule] Sending to Discord webhook...");
    await sendToDiscord(webhookData);
  } catch (error) {
    handleError("broadcastAnimeSchedule", error);
  }
}

// Application startup
console.info(
  `Setting up cron job to run at ${config.time.cronSchedule} in ${config.time.timezone} timezone`
);

// Schedule the job to run at the configured time
cron.schedule(config.time.cronSchedule, broadcastAnimeSchedule, {
  scheduled: true,
  timezone: config.time.timezone,
});

console.info("Anime Airing Schedule Discord Bot started!");
console.info(
  `Scheduled to run at ${config.time.cronSchedule} in ${config.time.timezone} timezone`
);

// Run immediately on startup
broadcastAnimeSchedule();
