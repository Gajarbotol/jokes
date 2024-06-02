const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();

// replace the value below with the Telegram token you receive from @BotFather
const token = '6531689450:AAFNTGx4bafhOll-pS2ySRRs7eAsILA9iUw';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Check if the message is a URL
  if (text.startsWith('http://') || text.startsWith('https://')) {
    const url = text;
    const path = `${Date.now()}.tmp`;

    axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    })
    .then(function(response) {
      const writer = fs.createWriteStream(path);
      response.data.pipe(writer);

      writer.on('finish', () => {
        bot.sendDocument(chatId, path).then(() => {
          fs.unlink(path, (err) => {
            if (err) console.error(err);
          });
        });
      });

      writer.on('error', console.error);
    });
  }
});

// Start Express server
app.get('/', (req, res) => {
  res.send('Telegram bot is running...');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
