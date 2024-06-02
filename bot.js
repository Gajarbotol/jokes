const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const token = '6531689450:AAFNTGx4bafhOll-pS2ySRRs7eAsILA9iUw';
const bot = new TelegramBot(token, {polling: true});

function sendJoke(chatId) {
  axios.get('https://official-joke-api.appspot.com/random_joke')
    .then(response => {
      const joke = `${response.data.setup} - ${response.data.punchline}`;
      bot.sendMessage(chatId, joke);
    })
    .catch(error => {
      console.log(error);
      bot.sendMessage(chatId, 'Sorry, I couldn\'t fetch a joke for you.');
    });
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sendJoke(chatId);
  setInterval(sendJoke, 5 * 60 * 1000, chatId); // Send a joke every 5 minutes
});

// Render web services listen on port 10000 by default
const port = 10000;
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Telegram bot is running...');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
