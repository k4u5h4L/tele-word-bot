# Tele Word Bot

A Telegram bot which helps you with English Competitive exams by sending you one word in an interval.

You can find this bot here [t.me/tele_word_bot](https://t.me/tele_word_bot).

## How to work with it:

-   Send a message `/subscribe`. This will add you to the subscribers list for a word in an interval.
-   You can also send a message as `/search <word>` to search the meaning for the word.

## To-Do:

-   Custom interval for separate people.
-   Unsubscribe chats.

## To run/self host:

-   Clone this repo:

```
git clone https://github.com/k4u5h4L/tele-word-bot.git && cd tele-word-bot
```

-   Fill in API keys in a new file named `.env`. The names should match the file `.env.example`. I am using MongoDB to host the dictionary database. You may need to do the same and add the connection string necessary.

-   Install dependencies:

```
yarn install
```

-   Run the bot:

```
yarn dev
```

Your bot should now be active. visit it's page and start conversing with it!

## Note:

-   This is not a commercial project.
-   It is done as a hobby and personal use. Use it at your own risk.
-   Contributions are welcome!
