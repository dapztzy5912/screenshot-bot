const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Ganti token dan chat ID sesuai bot kamu
const TELEGRAM_TOKEN = '7934915506:AAFMisfAS2hXzuAPFWVYj-E7NK4Mf00rvm4';
const CHAT_ID = '7341190291';

const app = express();
const port = 3000;
const bot = new TelegramBot(TELEGRAM_TOKEN);

app.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Masukkan parameter ?url=' });
    }

    try {
        const encodedUrl = encodeURIComponent(url);
        const screenshotUrl = `https://api.pikwy.com/?tkn=125&d=3000&u=${encodedUrl}&fs=0&w=841&h=1200&s=100&f=jpg&trj=web`;

        const response = await axios.get(screenshotUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (response.status === 200) {
            await bot.sendPhoto(CHAT_ID, response.data, {
                caption: `Screenshot dari: ${url}`
            });

            return res.status(200).json({ status: 'success', message: 'Screenshot berhasil dikirim ke Telegram.' });
        } else {
            return res.status(500).json({ error: 'Gagal mengambil screenshot.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan saat mengambil atau mengirim screenshot.' });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
