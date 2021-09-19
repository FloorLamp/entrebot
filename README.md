# Entrebot

Unofficial Discord bot for Entrepot.

## Features

- Message channel on new sale
- Floor price as nickname
- Number of listings as activity
- `/market [query]` command to search listings by query

## Usage

### Config

First, create a [Discord application](https://discord.com/developers/applications) with a bot.

Set environment variables. You can use a `.env` file.

```
API_KEY=... // Bot token
CLIENT_ID=... // Application ID
CHANNEL_ID=... // Channel ID to post latest sales to
GUILD_ID=... // Server ID to set nickname/activity in
```

### Commands

Application commands are in the [commands](./src/commands) directory. After adding or updating commands, run this:

```sh
npm run deployCommands
```

### Development

```sh
npm start
```

### Running

```sh
npm run build
npm run serve
```
