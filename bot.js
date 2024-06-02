const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const url = require('url');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6531689450:AAFNTGx4bafhOll-pS2ySRRs7eAsILA9iUw';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Check if the message is a URL
  if (text.startsWith('http://') || text.startsWith('https://')) {
    const fileUrl = url.parse(text);
    const fileName = path.basename(fileUrl.pathname);
    const fileExtension = path.extname(fileName).toLowerCase();

    // Check if the file extension is supported
    const supportedExtensions = ['.mp3', '.mp4', '.apk', '.zip', '.html', '.rar', '.exe', '.png', '.jpeg'];
    if (!supportedExtensions.includes(fileExtension)) {
      bot.sendMessage(chatId, 'Sorry, this file type is not supported.');
      return;
    }

    const filePath = `${Date.now()}${fileExtension}`;

    axios({
      method: 'get',
      url: text,
      responseType: 'stream'
    })
    .then(function(response) {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on('finish', () => {
        bot.sendDocument(chatId, filePath).then(() => {
          fs.unlink(filePath, (err) => {
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
