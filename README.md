# Anime Schedule Discord Bot

A Node.js application that fetches daily anime schedules and sends them to a Discord channel via webhook.

## Features

- Fetches anime schedules from the AnimeSchedule.net API
- Automatically runs at midnight (00:00) based on the specified timezone
- Sends formatted schedule data to a Discord channel via webhook
- Dynamically calculates the current year and week number
- Configurable timezone

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
2. Schedule a daily task to run at midnight (00:00) in the specified timezone

## Configuration

### Environment Variables

- `DISCORD_WEBHOOK_URLS`: Your Discord webhook URLs separated by commas | Required
- `DISCORD_TARGET_ROLE_IDS`: Your Target Role IDs separated by commas | Optional
- `ANIME_SCHEDULE_API_TOKEN`: Your AnimeSchedule.net API token | Required
- `TIMEZONE`: The timezone to use for scheduling and date calculations | defaults to 'Asia/Kolkata' if not specified

## License

MIT
