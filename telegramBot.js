import TelegramBot from "node-telegram-bot-api";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const token = process.env.TG_API_KEY;
// const token = process.env.TEST_TG_API_KEY;
const bot = new TelegramBot(token, { polling: true });

let chatIds = [];

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "/start_guapanator") {
    if (!chatIds.includes(chatId)) {
      chatIds.push(msg.chat.id);
    }
    console.log("ChatId Added")
    bot.sendMessage(chatId, "It's GUAP time, baby!");
  }
  if (msg.text === "/stop_guapanator") {
    const index = chatIds.indexOf(msg.chat.id);
    if (index > -1) {
      chatIds.splice(index, 1);
      bot.sendMessage(chatId, "Guapanator stopped");
    }
  }
});

export const sendTgPic = (image, name, metadataURI) => {
  const options = {
    caption: `${name} just got GUAPANATED!`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "MINT THIS",
            url: `https://getguap.xyz/mint?metadatauri=${metadataURI}`,
          },
        ],
        [
          {
            text: "GUAPANIZE YOUR IMAGES HERE",
            url: "https://getguap.xyz/guapanator",
          },
        ],
      ],
    },
  };
  if (chatIds.length > 0) {
    console.log(image);
    for (let chatId of chatIds) {
      bot.sendPhoto(chatId, image, options);
    }
  } else {
    console.log(
      "No chatIds are set. Make sure /start has been triggered by a user."
    );
  }
};
