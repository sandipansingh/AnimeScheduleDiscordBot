const axios = require("axios");
const { config } = require("./config");
const { getISOWeekData, getCurrentDateInTimezone } = require("./dateUtils");
const { logError } = require("./errorHandler");

/**
 * Fetches data with automatic retries on failure
 * @param {Function} fn - The function to execute and retry
 * @param {number} retries - Maximum number of retry attempts
 * @param {number} delayMs - Base delay between retries in milliseconds
 * @returns {Promise<any>} - The result of the function call
 */
async function fetchWithRetry(
  fn,
  retries = config.app.retryOptions.maxRetries,
  delayMs = config.app.retryOptions.retryDelayMs
) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const backoff = delayMs * Math.pow(2, attempt - 1);
      console.warn(
        `[fetchWithRetry] Attempt ${attempt} failed. Retrying in ${backoff}ms...`
      );
      await new Promise((res) => setTimeout(res, backoff));
    }
  }
}

/**
 * Fetches the anime schedule from the API
 * @returns {Promise<Array>} - Array of anime schedule data
 */
async function fetchAnimeSchedule() {
  const now = getCurrentDateInTimezone(config.time.timezone);
  const { year, weekNumber } = getISOWeekData(now, config.time.timezone);
  const url = `${config.api.baseUrl}/timetables/sub?tz=${config.time.timezone}&year=${year}&week=${weekNumber}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${config.api.animeScheduleToken}`,
      },
    });

    return response.data;
  } catch (error) {
    logError("fetchAnimeSchedule", error, {
      url,
      year,
      weekNumber,
      timezone: config.time.timezone,
    });
    throw error;
  }
}

/**
 * Fetches detailed anime data with rate limit handling
 * @param {Array} animeList - List of anime to fetch details for
 * @returns {Promise<Array>} - Array of anime with detailed data
 */
async function fetchDetailedAnime(animeList) {
  if (!animeList || animeList.length === 0) return [];

  const enrichedAnimeList = [...animeList];
  let rateLimitRemaining = 120;
  let rateLimitReset = 0;

  for (let i = 0; i < animeList.length; i++) {
    const anime = animeList[i];

    if (rateLimitRemaining < 5) {
      const now = Math.floor(Date.now() / 1000);
      const timeToReset = Math.max(0, rateLimitReset - now);

      console.warn(
        `[fetchDetailedAnime] Rate limit approaching (${rateLimitRemaining} remaining). Waiting ${timeToReset} seconds before continuing...`
      );

      if (timeToReset > 0) {
        await new Promise((resolve) => setTimeout(resolve, timeToReset * 1000));
      }
    }

    try {
      const response = await fetchWithRetry(
        () =>
          axios.get(`${config.api.baseUrl}/anime/${anime.route}`, {
            headers: {
              Authorization: `Bearer ${config.api.animeScheduleToken}`,
            },
          }),
        config.app.retryOptions.maxRetries,
        config.app.retryOptions.retryDelayMs
      );

      // Update rate limit info from response headers if available
      if (response && response.headers) {
        const headers = response.headers;
        rateLimitRemaining = parseInt(
          headers["x-ratelimit-remaining"] || rateLimitRemaining,
          10
        );
        rateLimitReset = parseInt(
          headers["x-ratelimit-reset"] || rateLimitReset,
          10
        );
      }

      // Merge the detailed data with the schedule data
      enrichedAnimeList[i] = { ...anime, ...response.data };

      console.info(
        `[fetchDetailedAnime] Fetched data for "${
          anime.english || anime.title || anime.route
        }" (${i + 1}/${
          animeList.length
        }) - Rate limit: ${rateLimitRemaining} remaining`
      );
    } catch (error) {
      console.warn(
        `[fetchDetailedAnime] Failed to fetch detailed data for anime ID ${anime.route}: ${error.message}`
      );
    }
  }

  return enrichedAnimeList;
}

module.exports = {
  fetchWithRetry,
  fetchAnimeSchedule,
  fetchDetailedAnime,
};
