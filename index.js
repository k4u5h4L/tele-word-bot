//const results = await prisma.post.findMany({
//     skip: 3,
//     take: 4,
//   })

require("dotenv").config();

process.env["NTBA_FIX_319"] = 1; // to avoid a deprecation warning

const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/subscribe (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(
        chatId,
        "Your subscription has been added.\nYou will now receive 2 random words a day."
    );
});

bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, "Received your message");
});

console.log("Bot ready");
