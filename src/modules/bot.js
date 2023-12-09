const Dotenv = require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_API_KEY;
const bot = new TelegramBot(token, { polling: true });

module.exports = bot;
