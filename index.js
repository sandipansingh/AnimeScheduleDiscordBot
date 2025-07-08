require("dotenv").config();
const axios = require("axios");
const cron = require("node-cron");

const DISCORD_WEBHOOK_URLS = process.env.DISCORD_WEBHOOK_URLS
  ? process.env.DISCORD_WEBHOOK_URLS.split(",")
  : [];
const DISCORD_TARGET_ROLE_IDS = process.env.DISCORD_TARGET_ROLE_IDS
  ? process.env.DISCORD_TARGET_ROLE_IDS.split(",")
  : [];
const ANIME_SCHEDULE_API_TOKEN = process.env.ANIME_SCHEDULE_API_TOKEN;
const TIMEZONE = process.env.TIMEZONE || "Asia/Kolkata";

const IMAGE_BASE_URL =
  "https://img.animeschedule.net/production/assets/public/img/";
const dateOpts = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: TIMEZONE,
};
const timeOpts = {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: TIMEZONE,
};

function getRandomColor() {
  return Math.floor(Math.random() * 0xffffff);
}

async function sendToDiscordBatch(message) {
  await Promise.all(
    DISCORD_WEBHOOK_URLS.map((url) => axios.post(url, message))
  );
}

function getCurrentYearAndWeek() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: TIMEZONE })
  );

  const year = now.getFullYear();

  const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
  const dayOfWeek = firstDayOfYear.getDay();
  const daysElapsed = Math.floor(
    (now - firstDayOfYear) / (24 * 60 * 60 * 1000)
  );
  const weekNumber = Math.ceil((daysElapsed + dayOfWeek + 1) / 7);

  return { year, weekNumber };
}

async function fetchWithRetry(fn, retries = 3, delayMs = 1000) {
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

async function fetchAnimeSchedule() {
  const { year, weekNumber } = getCurrentYearAndWeek();
  const url = `https://animeschedule.net/api/v3/timetables/sub?tz=${TIMEZONE}&year=${year}&week=${weekNumber}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${ANIME_SCHEDULE_API_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "[fetchAnimeSchedule] Error fetching anime airing schedule:",
      error.message
    );
    console.error("[fetchAnimeSchedule] URL:", url);
    console.error("[fetchAnimeSchedule] Status:", error.response?.status);
    console.error("[fetchAnimeSchedule] Data:", error.response?.data);

    throw error;
  }
}

function formatForDiscord(scheduleData) {
  if (!scheduleData || !Array.isArray(scheduleData)) {
    return [
      {
        content: "No anime airing schedule data available.",
      },
    ];
  }

  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: TIMEZONE })
  );

  const todayDateOnly = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIMEZONE,
  });

  const todayAnime = scheduleData.filter((anime) => {
    const animeDate = new Date(anime.episodeDate);
    const animeDateStr = animeDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: TIMEZONE,
    });
    return animeDateStr === todayDateOnly;
  });

  if (todayAnime.length === 0) {
    return [
      {
        content: "🍥 No anime airing scheduled for today.",
      },
    ];
  }

  const dateStr = now.toLocaleDateString("en-US", dateOpts);

  todayAnime.sort((a, b) => {
    return new Date(a.episodeDate) - new Date(b.episodeDate);
  });

  const createAnimeEmbed = (anime, embedColor) => {
    const episodeDate = new Date(anime.episodeDate);

    const dateFormatted = episodeDate.toLocaleDateString("en-US", dateOpts);

    const timeFormatted = episodeDate.toLocaleTimeString("en-US", timeOpts);

    const title = anime.english || anime.title || anime.romaji || anime.native;

    let streamLinksText = "";
    if (anime.streams) {
      const streamEntries = Object.entries(anime.streams);
      if (streamEntries.length > 0) {
        streamLinksText = streamEntries
          .map(([platform, url]) => {
            const formattedUrl = url.startsWith("http")
              ? url
              : `https://${url}`;
            return `• [${platform}](${formattedUrl})`;
          })
          .join("\n");
      }
    }

    const embed = {
      title: `${title}`,
      description: `🎬 **Episode: ${anime.episodeNumber}** \n⏰ **Air Time:** ${timeFormatted}\n📆 **Date:** ${dateFormatted}`,
      color: embedColor,
      fields: [],
    };

    if (streamLinksText) {
      embed.fields.push({
        name: "🔗 Available Streams",
        value: streamLinksText,
        inline: false,
      });
    }

    if (anime.imageVersionRoute) {
      embed.thumbnail = {
        url: `${IMAGE_BASE_URL}${anime.imageVersionRoute}`,
      };
    }

    return embed;
  };

  const mainEmbed = {
    title: `📺 Anime Airing Schedule for ${dateStr}`,
    description: `${DISCORD_TARGET_ROLE_IDS.map(
      (roleId) => `<@&${roleId}>`
    ).join(" ")} \n\nFound ${todayAnime.length} anime airing today!`,
    color: getRandomColor(),
    footer: {
      text: `Schedule based on ${TIMEZONE} timezone | Updated at ${now.toLocaleTimeString(
        "en-US",
        timeOpts
      )}`,
    },
  };

  const messages = [];
  let currentBatch = [];
  let isFirstBatch = true;
  let embedColor = getRandomColor();

  for (let i = 0; i < todayAnime.length; i++) {
    const batchLimit = isFirstBatch ? 9 : 10;

    currentBatch.push(createAnimeEmbed(todayAnime[i], embedColor));

    if (currentBatch.length >= batchLimit || i === todayAnime.length - 1) {
      const message = { embeds: [...currentBatch] };

      if (isFirstBatch) {
        message.embeds.unshift(mainEmbed);
        isFirstBatch = false;
      }

      messages.push(message);

      currentBatch = [];
    }
  }

  if (messages.length === 0) {
    messages.push({
      embeds: [mainEmbed],
    });
  }

  return messages;
}

async function sendToDiscord(webhookData) {
  try {
    const messages = Array.isArray(webhookData) ? webhookData : [webhookData];

    for (let i = 0; i < messages.length; i++) {
      await sendToDiscordBatch(messages[i]);

      if (i < messages.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.info(
      `[sendToDiscord] Anime airing schedule sent to Discord successfully! (${
        messages.length
      } message${messages.length > 1 ? "s" : ""})`
    );
  } catch (error) {
    console.error(
      "[sendToDiscord] Error sending to Discord webhook:",
      error.message
    );
    if (error.response) {
      console.error("[sendToDiscord] Response data:", error.response.data);
      console.error("[sendToDiscord] Response status:", error.response.status);
    }
  }
}

async function broadcastAnimeSchedule() {
  if (DISCORD_WEBHOOK_URLS.length === 0) {
    console.warn(
      "[broadcastAnimeSchedule] No webhook URLs configured. Please add at least one webhook URL to DISCORD_WEBHOOK_URLS environment variable."
    );
    process.exit(1);
  }

  if (!ANIME_SCHEDULE_API_TOKEN) {
    console.warn(
      "[broadcastAnimeSchedule] Missing API token. Please add ANIME_SCHEDULE_API_TOKEN environment variable."
    );
    process.exit(1);
  }

  if (DISCORD_TARGET_ROLE_IDS.length === 0) {
    console.info(
      "[broadcastAnimeSchedule] No target roles specified; will post without mentions."
    );
  }

  const maxRetries = 10;
  const retryDelayMs = 10000;

  try {
    console.info("[broadcastAnimeSchedule] Fetching anime airing schedule...");
    const scheduleData = await fetchWithRetry(
      () => fetchAnimeSchedule(),
      maxRetries,
      retryDelayMs
    );
    console.info("[broadcastAnimeSchedule] Formatting data for Discord...");
    const webhookData = formatForDiscord(scheduleData);
    console.info("[broadcastAnimeSchedule] Sending to Discord webhook...");
    await sendToDiscord(webhookData);
  } catch (error) {
    console.error(
      "[broadcastAnimeSchedule] Error in broadcastAnimeSchedule:",
      error.message
    );
  }
}

console.info(
  `Setting up cron job to run at midnight (00:00) in ${TIMEZONE} timezone`
);

const cronTimezone = TIMEZONE;

cron.schedule("0 0 * * *", broadcastAnimeSchedule, {
  scheduled: true,
  timezone: cronTimezone,
});

console.info("Anime Airing Schedule Discord Bot started!");
console.info(`Scheduled to run at midnight (00:00) in ${TIMEZONE} timezone`);

broadcastAnimeSchedule();
