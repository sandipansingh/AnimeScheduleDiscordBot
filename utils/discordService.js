const axios = require('axios');
const { config } = require('./config');
const { logError } = require('./errorHandler');

/**
 * Sends a message to all configured Discord webhooks in parallel
 * @param {Object} message - The message to send
 * @returns {Promise<Array>} - Array of responses from all webhooks
 */
async function sendToDiscordBatch(message) {
  try {
    return await Promise.all(
      config.discord.webhookUrls.map((url) => axios.post(url, message))
    );
  } catch (error) {
    logError('sendToDiscordBatch', error);
    throw error;
  }
}

/**
 * Sends multiple messages to Discord webhooks with rate limiting
 * @param {Array|Object} webhookData - The message(s) to send
 * @returns {Promise<void>}
 */
async function sendToDiscord(webhookData) {
  try {
    const messages = Array.isArray(webhookData) ? webhookData : [webhookData];

    for (let i = 0; i < messages.length; i++) {
      await sendToDiscordBatch(messages[i]);

      // Add a delay between batches to avoid rate limiting
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
    logError('sendToDiscord', error);
    throw error;
  }
}

module.exports = {
  sendToDiscordBatch,
  sendToDiscord,
};