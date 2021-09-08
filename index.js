//const results = await prisma.post.findMany({
//     skip: 3,
//     take: 4,
//   })

require("dotenv").config();

process.env["NTBA_FIX_319"] = 1; // to avoid a deprecation warning

const TelegramBot = require("node-telegram-bot-api");
const { PrismaClient } = require("@prisma/client");
const express = require("express");

const getRandomInt = require("./helpers/getRandom");
const wordConstructor = require("./helpers/wordConstructor");

const app = express();

const PORT = 3000;

const prisma = new PrismaClient();

const token = process.env.BOT_TOKEN;

let chats = [];

const bot = new TelegramBot(token, { polling: true });

// bot.onText(/\/subscribe (.+)/, (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message

//     const chatId = msg.chat.id;
//     // const resp = match[1]; // the captured "whatever"

//     // send back the matched "whatever" to the chat

// });

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    const subRegex = /\/subscribe/gim;
    const unsubRegex = /\/unsubscribe/gim;
    const searchRegex = /\/search/gim;

    if (subRegex.test(msg.text)) {
        if (chats.includes(`${chatId}`)) {
            bot.sendMessage(chatId, "You already seem to be subscribed.");
        } else {
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
        }
    } else if (searchRegex.test(msg.text)) {
        const temp = msg.text.split(" ");
        const query = temp[1].toLowerCase();

        const res = await prisma.dictionary.findMany({
            where: {
                word: {
                    contains: query,
                },
            },
            take: 5,
        });

        let toSend = "";

        res.forEach((obj) => {
            toSend += `word: ${obj.word}\n\nmeaning: ${obj.meaning}\n\n-------------------------\n\n`;
        });

        console.log(`Sent search to ${chatId} about ${query}`);

        bot.sendMessage(chatId, toSend);
    } else if (unsubRegex.test(msg.text)) {
        if (!chats.includes(`${chatId}`)) {
            bot.sendMessage(chatId, "You aren't subscribed.");
        } else {
            const removeChatIndex = chats.indexOf(`${chatId}`);

            delete chats[removeChatIndex];

            prisma.chats
                .delete({
                    where: {
                        chatId: `${chatId}`,
                    },
                })
                .then((result) => {
                    console.log(`Chat deleted!`);
                    console.log(result);
                })
                .catch((err) => {
                    console.error(err);
                });

            bot.sendMessage(chatId, "Successfully unsubscribed");
        }
    }
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
    }, 43200000);
};

console.log("Bot ready");

start();

setTimeout(() => {
    ping();
}, 1000);

app.get("*", (req, res) => {
    res.send({
        message: "Tele Word Bot deployed",
        link: "t.me/tele_word_bot",
    });
});

app.listen(process.env.PORT || PORT, () =>
    console.log(`Express server running on port ${process.env.PORT || PORT}`)
);
