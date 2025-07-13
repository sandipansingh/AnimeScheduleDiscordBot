const { config } = require("./config");
const {
  formatDate,
  formatTime,
  getCurrentDateInTimezone,
  getMidnightInTimezone,
} = require("./dateUtils");
const { fetchDetailedAnime } = require("./apiService");

/**
 * Generates a random color for Discord embeds
 * @returns {number} - A random color in decimal format
 */
function getRandomColor() {
  return Math.floor(Math.random() * 0xffffff);
}

/**
 * Returns a random image URL from a list of relaxing images
 * @returns {string} - URL of a random relaxing image
 */
function getRandomRelaxingImage() {
  const images = [
    "https://i.imgur.com/6Dih3PQ.gif",
    "https://i.imgur.com/csnsiBl.gif",
    "https://i.imgur.com/u6Td1LR.gif",
    "https://i.imgur.com/rc2ytE9.gif",
    "https://i.imgur.com/4KxS6gy.gif",
    "https://i.imgur.com/l566a1j.gif",
    "https://i.imgur.com/No6x37D.gif",
    "https://i.imgur.com/QrFY6Ap.gif",
    "https://i.imgur.com/Isayvcs.gif",
    "https://i.imgur.com/T8YeRfq.gif",
    "https://i.imgur.com/OBZE7LQ.gif",
    "https://i.imgur.com/iBFwAiX.gif",
    "https://i.imgur.com/oLuwhvI.gif",
    "https://i.imgur.com/8WLsccl.gif",
    "https://i.imgur.com/hZTxtnd.gif",
    "https://i.imgur.com/DnN1WVk.gif",
    "https://i.imgur.com/TWY30cH.gif",
    "https://i.imgur.com/mog2Ba4.gif",
    "https://i.imgur.com/7Rij1xo.gif",
    "https://i.imgur.com/mMi940S.gif",
    "https://i.imgur.com/UJJSKoZ.gif",
    "https://i.imgur.com/hLYnmGj.gif",
    "https://i.imgur.com/3OyN2NP.gif",
    "https://i.imgur.com/X0hcwam.gif",
    "https://i.imgur.com/BkupskE.gif",
    "https://i.imgur.com/prkLGi3.gif",
    "https://i.imgur.com/Lxnw9sy.gif",
    "https://i.imgur.com/9FlxB7i.gif",
    "https://i.imgur.com/aNQxl1j.gif",
    "https://i.imgur.com/LtJpRqD.gif",
    "https://i.imgur.com/yagJhIn.gif",
    "https://i.imgur.com/Nk14YYn.gif",
    "https://i.imgur.com/nneZV6M.gif",
    "https://i.imgur.com/0wWnXPQ.gif",
    "https://i.imgur.com/oaZu1HB.gif",
    "https://i.imgur.com/jLVQ2EY.gif",
    "https://i.imgur.com/WEc1Hjz.gif",
    "https://i.imgur.com/eCfxhoM.gif",
    "https://i.imgur.com/Y7i2xRt.gif",
    "https://i.imgur.com/aGzXTas.gif",
    "https://i.imgur.com/0CPaNWw.gif",
    "https://i.imgur.com/KceMPVJ.gif",
    "https://i.imgur.com/8nWUGFu.gif",
    "https://i.imgur.com/G9tCH8X.gif",
    "https://i.imgur.com/GpHVfh7.gif",
    "https://i.imgur.com/OweHZmp.gif",
    "https://i.imgur.com/BQCPBWn.gif",
    "https://i.imgur.com/W4UU6xh.gif",
    "https://i.imgur.com/rkKcGph.gif",
    "https://i.imgur.com/M8kPkxk.gif",
    "https://i.imgur.com/jNEjN82.gif",
    "https://i.imgur.com/6r9AoSS.gif",
    "https://i.imgur.com/mju1fqn.gif",
    "https://i.imgur.com/6Uavaui.gif",
    "https://i.imgur.com/lG0wyA4.gif",
    "https://i.imgur.com/ADkMOtj.gif",
    "https://i.imgur.com/LNG3AlQ.gif",
    "https://i.imgur.com/deWhpMc.gif",
    "https://i.imgur.com/I4DtmyZ.gif",
    "https://i.imgur.com/FhlnsH2.gif",
    "https://i.imgur.com/GRLHl2V.gif",
    "https://i.imgur.com/dIA8SM5.gif",
    "https://i.imgur.com/K7Wzt3P.gif",
    "https://i.imgur.com/1pDss2x.gif",
    "https://i.imgur.com/045YwaO.gif",
    "https://i.imgur.com/HUT3hmJ.gif",
    "https://i.imgur.com/D7hKONE.gif",
    "https://i.imgur.com/33Ad07s.gif",
    "https://i.imgur.com/Q72QBso.gif",
    "https://i.imgur.com/t7Icea6.gif",
    "https://i.imgur.com/qHYE9WK.gif",
    "https://i.imgur.com/YDRQhzG.gif",
    "https://i.imgur.com/72Oiwpn.gif",
    "https://i.imgur.com/LfUstLT.gif",
    "https://i.imgur.com/GERcEjQ.gif",
    "https://i.imgur.com/em1pAfL.gif",
    "https://i.imgur.com/ZgEvJsZ.gif",
    "https://i.imgur.com/KKXwtlL.gif",
    "https://i.imgur.com/D4ttPWY.gif",
    "https://i.imgur.com/Bf24qJj.gif",
    "https://i.imgur.com/wvZZmTo.gif",
    "https://i.imgur.com/Ljkl9FW.gif",
    "https://i.imgur.com/GizLcHD.gif",
    "https://i.imgur.com/3sKUuZD.gif",
    "https://i.imgur.com/BhGd1kT.gif",
    "https://i.imgur.com/RG88uwd.gif",
    "https://i.imgur.com/ilo0yLF.gif",
    "https://i.imgur.com/NdVI1WX.gif",
    "https://i.imgur.com/GxHXNQE.gif",
    "https://i.imgur.com/07BJyn7.gif",
    "https://i.imgur.com/DtuiT9Y.gif",
    "https://i.imgur.com/RYM432i.gif",
    "https://i.imgur.com/ncWx9WS.gif",
    "https://i.imgur.com/k5FmMJm.gif",
    "https://i.imgur.com/OWFWVfn.gif",
    "https://i.imgur.com/XuXcOyR.gif",
    "https://i.imgur.com/NaVFYHI.gif",
    "https://i.imgur.com/5s5JikW.gif",
    "https://i.imgur.com/61Kn9NW.gif",
    "https://i.imgur.com/sBJaRph.gif",
    "https://i.imgur.com/zlLEhzk.gif",
    "https://i.imgur.com/r2IqCW6.gif",
    "https://i.imgur.com/j0v99v2.gif",
    "https://i.imgur.com/wRypvoB.gif",
    "https://i.imgur.com/Ip0rixY.gif",
    "https://i.imgur.com/mIAbUS5.gif",
    "https://i.imgur.com/M6chy9a.gif",
    "https://i.imgur.com/xVZdKkU.gif",
    "https://i.imgur.com/ZNjshc7.gif",
    "https://i.imgur.com/N14PdZw.gif",
    "https://i.imgur.com/dBqfQR9.gif",
    "https://i.imgur.com/3oFM01Z.gif",
    "https://i.imgur.com/kBb6w09.gif",
    "https://i.imgur.com/yJq332L.gif",
    "https://i.imgur.com/2D3FbEb.gif",
    "https://i.imgur.com/W2LnIJY.gif",
    "https://i.imgur.com/TazqSF6.gif",
    "https://i.imgur.com/M15XU7S.gif",
    "https://i.imgur.com/mWOT6jS.gif",
    "https://i.imgur.com/7Iv1w7O.gif",
    "https://i.imgur.com/76XX89F.gif",
    "https://i.imgur.com/biJaEbK.gif",
    "https://i.imgur.com/dh0X1IM.gif",
    "https://i.imgur.com/nK6rK5t.gif",
    "https://i.imgur.com/OBGRhUt.gif",
    "https://i.imgur.com/F0Ytnxd.gif",
    "https://i.imgur.com/T1qhVrt.gif",
    "https://i.imgur.com/RD9hA6q.gif",
    "https://i.imgur.com/OHTtEDI.gif",
    "https://i.imgur.com/NN2AFS3.gif",
    "https://i.imgur.com/ctoGjFC.gif",
    "https://i.imgur.com/IoRbg2t.gif",
    "https://i.imgur.com/3ORwdbI.gif",
    "https://i.imgur.com/D43Eis1.gif",
    "https://i.imgur.com/5RZ3seG.gif",
    "https://i.imgur.com/eljy1Hc.gif",
    "https://i.imgur.com/REJKZge.gif",
    "https://i.imgur.com/3IASxuZ.gif",
    "https://i.imgur.com/X1LPUfu.gif",
    "https://i.imgur.com/YKAydUl.gif",
    "https://i.imgur.com/3SWAhhd.gif",
    "https://i.imgur.com/2DCZr5M.gif",
    "https://i.imgur.com/AVw21Nw.gif",
    "https://i.imgur.com/l91AGqG.gif",
    "https://i.imgur.com/WHpjDJ1.gif",
    "https://i.imgur.com/f6LQoem.gif",
    "https://i.imgur.com/MYdczzI.gif",
    "https://i.imgur.com/Ngx1cA7.gif",
    "https://i.imgur.com/b8s25uk.gif",
    "https://i.imgur.com/0VHE7qs.gif",
    "https://i.imgur.com/Z2PTBWt.gif",
    "https://i.imgur.com/8pOS8w1.gif",
    "https://i.imgur.com/HbOmbw9.gif",
    "https://i.imgur.com/ndB93eT.gif",
    "https://i.imgur.com/GiviA0T.gif",
    "https://i.imgur.com/duMA3RT.gif",
    "https://i.imgur.com/cNVAygO.gif",
    "https://i.imgur.com/kXeMUPG.gif",
    "https://i.imgur.com/uRWUup3.gif",
    "https://i.imgur.com/fFS1YFQ.gif",
    "https://i.imgur.com/sJqwuhI.gif",
    "https://i.imgur.com/weib01T.gif",
    "https://i.imgur.com/Uoxb6dx.gif",
    "https://i.imgur.com/gBxP6oJ.gif",
    "https://i.imgur.com/ULfd2vD.gif",
    "https://i.imgur.com/W4rRtSh.gif",
    "https://i.imgur.com/KWOCy9U.gif",
    "https://i.imgur.com/wxjFhor.gif",
    "https://i.imgur.com/xhrYwDs.gif",
    "https://i.imgur.com/aP97Sc9.gif",
    "https://i.imgur.com/h3st44j.gif",
    "https://i.imgur.com/3bM0Bn1.gif",
    "https://i.imgur.com/yICY8wI.gif",
    "https://i.imgur.com/4umBbx5.gif",
    "https://i.imgur.com/aTaCBQO.gif",
    "https://i.imgur.com/gq8DCrt.gif",
    "https://i.imgur.com/2DA0m57.gif",
    "https://i.imgur.com/JOhcpds.gif",
    "https://i.imgur.com/QSHfNfH.gif",
    "https://i.imgur.com/L6TGj84.gif",
    "https://i.imgur.com/05nK6j9.gif",
    "https://i.imgur.com/A91JCOK.gif",
    "https://i.imgur.com/epcUjyQ.gif",
    "https://i.imgur.com/VHhGR4c.gif",
    "https://i.imgur.com/EiGlLiW.gif",
    "https://i.imgur.com/xUIOAAE.gif",
    "https://i.imgur.com/nG68uWP.gif",
    "https://i.imgur.com/QSpH9A4.gif",
    "https://i.imgur.com/J1s4QDp.gif",
    "https://i.imgur.com/fWGRAlL.gif",
  ];
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Returns a random image URL from a list of not found images
 * @returns {string} - URL of a random not found image
 */
https: function getRandomNotFoundImage() {
  const images = [
    "https://i.imgur.com/4dwGzcD.gif",
    "https://i.imgur.com/NBQzcnpg.jpg",
    "https://i.imgur.com/SwsgHX3.gif",
    "https://i.imgur.com/xTY4jyk.gif",
    "https://imgur.com/gallery/404-error-i-found-cute-auJ1AqN",
  ];
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Creates an embed for a single anime
 * @param {Object} anime - The anime data object
 * @param {number} embedColor - The color to use for the embed
 * @returns {Object} - Discord embed object
 */
function createAnimeEmbed(anime, embedColor) {
  const episodeDate = new Date(anime.episodeDate);
  const dateFormatted = formatDate(
    episodeDate,
    config.time.dateOptions,
    config.time.timezone
  );
  const timeFormatted = formatTime(
    episodeDate,
    config.time.timeOptions,
    config.time.timezone
  );
  const title = anime.english || anime.title || anime.romaji || anime.native;

  // Format episode number with leading zeros
  const episodeFormatted = anime.episodeNumber
    ? anime.episodeNumber < 10
      ? `0${anime.episodeNumber}`
      : anime.episodeNumber
    : "??";

  // Get stream links if available
  let streamLinksText = "";
  if (anime.streams) {
    const streamEntries = Object.entries(anime.streams);
    if (streamEntries.length > 0) {
      streamLinksText = streamEntries
        .map(([platform, url]) => {
          const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
          const platformEmoji = getPlatformEmoji(platform);
          return `${platformEmoji} [${platform}](${formattedUrl})`;
        })
        .join("\n");
    }
  }

  // Create the embed object
  const embed = {
    title: `${title}`,
    description: `
🎬 **Episode ${episodeFormatted}** ${getEpisodeEmoji(
      anime.episodeNumber,
      anime.episodes || 12
    )}
⏰ **Air Time:** ${timeFormatted}
📆 **Date:** ${dateFormatted}
${anime.genres ? `🏷️ **Genres:** ${formatGenres(anime.genres)}` : ""}
${anime.lengthMin ? `⌛ **Duration:** ${formatDuration(anime.lengthMin)}` : ""}
${anime.episodes ? `📊 **Total Episodes:** ${anime.episodes}` : ""}
    `.trim(),
    color: embedColor,
    fields: [],
  };

  // Add synopsis if available
  if (anime.description) {
    const formattedSynopsis = formatSynopsis(anime.description, 300);
    embed.fields.push({
      name: "📝 Synopsis",
      value: formattedSynopsis,
      inline: false,
    });
  }

  // Add stream links if available
  if (streamLinksText) {
    embed.fields.push({
      name: "🔗 Available Streams",
      value: streamLinksText,
      inline: false,
    });
  }

  // Add thumbnail image if available
  if (anime.imageVersionRoute) {
    embed.thumbnail = {
      url: `${config.api.imageBaseUrl}${anime.imageVersionRoute}`,
    };
  }

  return embed;
}

/**
 * Gets an appropriate emoji based on episode number and total episodes
 * @param {number|string} episodeNumber - The episode number
 * @param {number|string} totalEpisodes - The total number of episodes
 * @returns {string} - An emoji
 */
function getEpisodeEmoji(episodeNumber, totalEpisodes = 12) {
  if (!episodeNumber) return "🆕";

  const epNum = parseInt(episodeNumber, 10);
  const totalEps = parseInt(totalEpisodes, 10);

  if (isNaN(epNum)) return "🆕";
  if (isNaN(totalEps)) return "📺";

  if (epNum === 1) return "🆕"; // First episode
  if (epNum === totalEps) return "🏁"; // Last episode

  // Calculate progress
  const progress = epNum / totalEps;

  if (progress === 0.5) return "💫"; // Exact halfway point
  if (progress > 0.9) return "🔥"; // Final stretch
  if (progress > 0.75) return "🎯"; // Last quarter
  if (progress > 0.5) return "⭐"; // Past halfway
  if (progress === 0.25) return "✨"; // Quarter way through

  return "📺";
}

/**
 * Gets an emoji for a streaming platform
 * @param {string} platform - The platform name
 * @returns {string} - An emoji representing the platform
 */
function getPlatformEmoji(platform) {
  const platformLower = platform.toLowerCase();

  // Platform-specific emoji mapping
  const platformEmojis = {
    offical: "💯",
    crunchyroll: "🍊",
    funimation: "💜",
    netflix: "📺",
    hulu: "🎯",
    amazon: "📦",
    prime: "📦",
    hidive: "🌊",
    disney: "⭐",
    youtube: "📹",
    apple: "🍎",
    paramount: "🗻",
    peacock: "🦚",
    max: "⚡",
    vrv: "🎮",
  };

  const matchingPlatform = Object.keys(platformEmojis).find((key) =>
    platformLower.includes(key)
  );

  // Return matching emoji or default link emoji
  return matchingPlatform ? platformEmojis[matchingPlatform] : "🔗";
}

/**
 * Formats genres into a readable string
 * @param {Array|string} genres - The genres array or string.
 * @returns {string} - Formatted genres
 */
function formatGenres(genres) {
  if (!genres) return "Unknown";

  if (typeof genres === "string") {
    return genres;
  }

  if (Array.isArray(genres)) {
    const genreNames = genres.map((genre) => {
      return typeof genre === "string" ? genre : genre.name || "Unknown";
    });
    return (
      genreNames.slice(0, 4).join(", ") + (genreNames.length > 4 ? "..." : "")
    );
  }

  return "Unknown";
}

/**
 * Formats duration into a readable string
 * @param {number|string} duration - The duration in minutes
 * @returns {string} - Formatted duration
 */
function formatDuration(duration) {
  if (!duration) return "Unknown";

  const mins = parseInt(duration, 10);
  if (isNaN(mins)) return duration.toString();

  if (mins < 60) {
    return `${mins} min${mins !== 1 ? "s" : ""}`;
  }

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (remainingMins === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMins} min${
    remainingMins !== 1 ? "s" : ""
  }`;
}

/**
 * Decodes HTML entities in a string
 * @param {string} text - The text with HTML entities
 * @returns {string} - Text with HTML entities decoded
 */
function decodeHTMLEntities(text) {
  return text
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (match, numStr) => {
      try {
        const num = numStr.startsWith("x")
          ? parseInt(numStr.slice(1), 16)
          : parseInt(numStr, 10);
        return num >= 0 && num <= 0x10ffff ? String.fromCodePoint(num) : match;
      } catch (e) {
        return match;
      }
    })
    .replace(/&([a-z0-9]+);/gi, (match, entity) => {
      const entities = {
        lt: "<",
        gt: ">",
        quot: '"',
        apos: "'",
        amp: "&",
        nbsp: " ",
        ndash: "–",
        mdash: "—",
        lsquo: "'",
        rsquo: "'",
        bull: "•",
        middot: "·",
        copy: "©",
        reg: "®",
      };
      return entities[entity.toLowerCase()] || match;
    });
}

/**
 * Formats a synopsis if it's too long and removes HTML tags and entities
 * @param {string} synopsis - The full synopsis
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} - Formatted synopsis as plain text
 */
function formatSynopsis(synopsis, maxLength = 300) {
  if (!synopsis) return "No synopsis available.";

  // Remove HTML tags
  let plainText = synopsis.replace(/<[^>]*>/g, " ");

  // Decode HTML entities
  plainText = decodeHTMLEntities(plainText);

  // Normalize whitespace
  plainText = plainText.replace(/\s+/g, " ").trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Try to find a good breaking point
  let breakPoint = plainText.lastIndexOf(".", maxLength - 3);
  if (breakPoint === -1 || breakPoint < maxLength * 0.7) {
    breakPoint = plainText.lastIndexOf(" ", maxLength - 3);
  }

  if (breakPoint === -1 || breakPoint < maxLength * 0.7) {
    breakPoint = maxLength - 3;
  }

  return plainText.substring(0, breakPoint) + "...";
}

/**
 * Creates the main embed with summary information
 * @param {string} dateStr - Formatted date string
 * @param {number} animeCount - Number of anime airing today
 * @returns {Object} - Discord embed object
 */
function createMainEmbed(dateStr, animeCount) {
  const now = getCurrentDateInTimezone(config.time.timezone);
  const todayMidnight = getMidnightInTimezone(now, config.time.timezone);

  // Emoji based on number of anime
  let countEmoji = "🔍";
  if (animeCount > 0) {
    if (animeCount >= 10) countEmoji = "🎉";
    else if (animeCount >= 5) countEmoji = "🔥";
    else if (animeCount >= 3) countEmoji = "✨";
    else countEmoji = "📺";
  }

  // Create role mentions if any exist
  const roleMentions =
    config.discord.targetRoleIds.length > 0
      ? `${config.discord.targetRoleIds
          .map((roleId) => `<@&${roleId}>`)
          .join(" ")}\n\n`
      : "";

  return {
    title: `📺 Anime Airing Schedule for ${dateStr}`,
    description: `${roleMentions}${countEmoji} **Found ${animeCount} anime airing today!** ${countEmoji}\n\n${getScheduleMessage(
      animeCount
    )}`,
    color: getRandomColor(),
    footer: {
      text: `Schedule based on ${
        config.time.timezone
      } timezone | Updated at ${formatTime(
        now,
        config.time.timeOptions,
        config.time.timezone
      )}`,
    },
    thumbnail: {
      url: getRandomRelaxingImage(),
    },
  };
}

/**
 * Gets a fun message based on the number of anime airing
 * @param {number} count - Number of anime airing
 * @returns {string} - A fun message
 */
function getScheduleMessage(count) {
  if (count === 0) return "Seems like a quiet day in the anime world.";

  const messages = [
    "Time to update your watchlist! 📝",
    "Grab your snacks and get comfy! 🍿",
    "Another day of amazing anime awaits! ✨",
    "Don't miss your favorite shows today! ⏰",
    "The perfect time for some anime and chill! 🧊",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Formats anime schedule data into Discord webhook messages
 * @param {Array} scheduleData - The anime schedule data
 * @returns {Array} - Array of formatted Discord webhook messages
 */
async function formatScheduleForDiscord(scheduleData) {
  if (!scheduleData || Array.isArray(!scheduleData)) {
    return [
      {
        embeds: [
          {
            description:
              "🚫 **Oops! Anime Schedule Unavailable** 🚫\n\nLooks like our ninja scouts couldn't find any anime data today! They're probably out training... or watching anime themselves. 🥷\n\nPlease check back later!\n\n*[AnimeScheduleBot will try again automatically]*",
            color: 0xff5733,
            thumbnail: {
              url: getRandomNotFoundImage(),
            },
          },
        ],
      },
    ];
  }

  // Get current date in the configured timezone
  const now = getCurrentDateInTimezone(config.time.timezone);

  // Get today's date at midnight in the configured timezone for accurate day comparison
  const todayMidnight = getMidnightInTimezone(now, config.time.timezone);

  const todayAnime = scheduleData.filter((anime) => {
    const animeDate = new Date(anime.episodeDate);

    // Get the anime date at midnight in the configured timezone
    const animeMidnight = getMidnightInTimezone(
      animeDate,
      config.time.timezone
    );

    // Compare the midnight dates for accurate day comparison
    const isToday = animeMidnight.getTime() === todayMidnight.getTime();

    return isToday;
  });

  if (todayAnime.length === 0) {
    const currentDate = formatDate(
      now,
      config.time.dateOptions,
      config.time.timezone
    );

    return [
      {
        embeds: [
          {
            title: `No Anime Airing Today (${currentDate})`,
            description:
              "Today is an anime-free day! Perfect time to catch up on your backlog or rewatch some classics! 📺✨\n\nCheck back tomorrow for new episodes!",
            color: 0x7289da,
            footer: {
              text: `Schedule based on ${
                config.time.timezone
              } timezone | Updated at ${formatTime(
                now,
                config.time.timeOptions,
                config.time.timezone
              )}`,
            },
            thumbnail: {
              url: getRandomRelaxingImage(),
            },
          },
        ],
      },
    ];
  }

  const dateStr = formatDate(
    now,
    config.time.dateOptions,
    config.time.timezone
  );

  todayAnime.sort((a, b) => {
    return new Date(a.episodeDate) - new Date(b.episodeDate);
  });

  console.info(
    `[formatScheduleForDiscord] Enriching ${todayAnime.length} anime with detailed data...`
  );

  const enrichedAnimeList = await fetchDetailedAnime(todayAnime);

  const mainEmbed = createMainEmbed(dateStr, enrichedAnimeList.length);

  const messages = [];
  let currentBatch = [];
  let isFirstBatch = true;
  let embedColor = getRandomColor();

  for (let i = 0; i < enrichedAnimeList.length; i++) {
    const batchLimit = isFirstBatch ? 9 : 10;

    currentBatch.push(createAnimeEmbed(enrichedAnimeList[i], embedColor));

    if (
      currentBatch.length >= batchLimit ||
      i === enrichedAnimeList.length - 1
    ) {
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

module.exports = {
  formatScheduleForDiscord,
  createAnimeEmbed,
  createMainEmbed,
  getRandomColor,
  getScheduleMessage,
  getEpisodeEmoji,
  getPlatformEmoji,
  formatGenres,
  formatDuration,
  formatSynopsis,
};
