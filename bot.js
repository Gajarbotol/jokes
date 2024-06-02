const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// replace the value below with the Telegram token you receive from @BotFather
const token = '6531689450:AAFNTGx4bafhOll-pS2ySRRs7eAsILA9iUw';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  const lastName = msg.from.last_name;
  const languageCode = msg.from.language_code;

  bot.sendMessage(chatId, `Hello, ${firstName} ${lastName}! Your chat ID is ${chatId} and your language is ${languageCode}.`);
});

// Start Express server
app.get('/', (req, res) => {
  res.send('Telegram bot is running...');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
