//const results = await prisma.post.findMany({
//     skip: 3,
//     take: 4,
//   })

require("dotenv").config();

process.env["NTBA_FIX_319"] = 1; // to avoid a deprecation warning

const TelegramBot = require("node-telegram-bot-api");
const { PrismaClient } = require("@prisma/client");

const getRandomInt = require("./helpers/getRandom");
const wordConstructor = require("./helpers/wordConstructor");

const prisma = new PrismaClient();

const token = process.env.BOT_TOKEN;

let chats = [];

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/subscribe (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    // const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(
        chatId,
        "Your subscription has been added.\nYou will now receive 2 random words a day."
    );

    chats.push(`${chatId}`);

    prisma.chats
        .create({
            data: {
                chatId: `${chatId}`,
            },
        })
        .then((result) => {
            console.log(`New chat added!`);
            console.log(result);
        })
        .catch((err) => {
            console.error(err);
        });
});

bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, "Received your message");
});

const start = async () => {
    const res = await prisma.chats.findMany({});
    const temp = res.map((obj) => obj.chatId);
    chats = temp;
};

const ping = async () => {
    // 12 hours = 43200000

    const sendWord = async (chatId) => {
        const word = await prisma.dictionary.findMany({
            skip: getRandomInt(0, 102216),
            take: 1,
        });

        bot.sendMessage(chatId, wordConstructor(word[0]));
    };

    setInterval(() => {
        console.log(`Sending words to all subscribers...`);

        chats.forEach((chatId) => {
            sendWord(chatId);
        });
    }, 8000);
};

console.log("Bot ready");

start();

setTimeout(() => {
    ping();
}, 1000);
