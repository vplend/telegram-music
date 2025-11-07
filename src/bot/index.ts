import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf('8425176408:AAGRz4f4SRkyCNZmc90px1lq4ZCfG9y4cPc');

bot.command('start', ctx => {
    ctx.reply('Привет! Нажми кнопку, чтобы начать слушать музыку сейчас',
        Markup.inlineKeyboard([
            Markup.button.webApp('Открыть поиск', 'https://music.plshchkv.ru')
        ])
    );
});

bot.launch().then(() => console.log("Бот запущен 🚀"));