# Anime Schedule Discord Bot

A Node.js application that fetches daily anime schedules and sends them to a Discord channels via webhook.

## Features

- Fetches anime schedules from the AnimeSchedule.net API
- Runs automatically at a configurable scheduled time and timezone
- Sends formatted schedule data to a Discord channels via webhook

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)
- Discord webhook URL
- AnimeSchedule.net API token

## Installation

1. Clone this repository or download the source code
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Rename `.env.example` to `.env` and fill in the required values

## Usage

Start the application:

```bash
npm start
```

The application will:

1. Run immediately on startup to send the current anime schedule
2. Schedule a daily task to run at the specified time and timezone

## Configuration

### Environment Variables

#### Discord Configuration

- `DISCORD_WEBHOOK_URLS`: Your Discord webhook URLs separated by commas | Required
- `DISCORD_TARGET_ROLE_IDS`: Your Target Role IDs separated by commas | Optional

#### API Configuration

- `ANIME_SCHEDULE_API_TOKEN`: Your AnimeSchedule.net API token | Required

#### Time and Date Settings

- `TIMEZONE`: The timezone to use for scheduling and date calculations | defaults to 'Asia/Kolkata' if not specified
- `CRON_SCHEDULE`: Cron expression for scheduling the task | defaults to '0 0 \* \* \*' (midnight daily)

#### Application Settings

- `NODE_ENV`: Environment mode ('development' or 'production') | defaults to 'development'
- `DEBUG`: Enable debug logging ('true' or 'false') | defaults to 'false'
- `MAX_RETRIES`: Maximum number of retry attempts for API calls | defaults to 10
- `RETRY_DELAY_MS`: Base delay between retries in milliseconds | defaults to 10000 (10 seconds)

## Recent Changes

### v1.0.0

- Initial release.

See [CHANGELOG.md](./CHANGELOG.md) for complete version history.

## Project Structure

```
├── index.js              # Main application entry point
├── utils/
│   ├── apiService.js     # API-related operations
│   ├── config.js         # Configuration management
│   ├── dateUtils.js      # Date and time utilities
│   ├── discordFormatter.js # Discord message formatting
│   ├── discordService.js # Discord API operations
│   └── errorHandler.js   # Error handling utilities
├── .env.example         # Example environment variables
├── .gitattributes       # Git attributes configuration
├── .gitignore           # Git ignore configuration
├── CHANGELOG.md         # Version history and changes
├── LICENSE              # License information
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## Troubleshooting

### Week Number Calculation

The bot now uses the ISO 8601 standard for calculating week numbers, which ensures consistent results across different environments. In the ISO week date system:

- Weeks start on Monday
- The first week of the year is the week that contains the first Thursday of the year
- Some early days in January might belong to the last week of the previous year
- Some late days in December might belong to the first week of the next year

If you encounter any issues with week number calculation, enable debug logging by setting `DEBUG=true` in your `.env` file.

### API Connection Issues

If you experience problems connecting to the AnimeSchedule.net API:

1. Verify your API token is correct
2. Check your internet connection
3. The bot will automatically retry failed API calls with exponential backoff
4. You can adjust retry settings with `MAX_RETRIES` and `RETRY_DELAY_MS` in your `.env` file

### Discord Webhook Issues

If messages are not appearing in your Discord channel:

1. Verify your webhook URLs are correct and active
2. Check that the webhook has permission to post in the target channel
3. Ensure your Discord server is online and accessible

## License

MIT
