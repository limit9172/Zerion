const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7837750888:AAGB6UF0DsqFZWGzwwXyGrrikg5gRPZ9PSg';
const bot = new TelegramBot(token);

// Setup webhook URL di Vercel
const url = `https://<your-vercel-deployment-url>/api/webhook`;  // Ganti dengan URL deployment Vercel

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
