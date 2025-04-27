const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7837750888:AAGB6UF0DsqFZWGzwwXyGrrikg5gRPZ9PSg';
const bot = new TelegramBot(token);

// Setup webhook URL di Vercel
const url = `https://vercel.com/loards-projects/zerion/CvmsoCpbmfM9ZSfkmTefUAZ6EY8A/api/webhook`;
// Set webhook ke Telegram bot
bot.setWebHook(url);

// Handle webhook updates
module.exports = (req, res) => {
  if (req.method === 'POST') {
    bot.processUpdate(req.body);
    res.status(200).send('OK');
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
