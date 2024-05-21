import TelegramBot from "node-telegram-bot-api";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const token = process.env.TG_API_KEY;
const bot = new TelegramBot(token, { polling: true });

let chatId;

bot.on("message", (msg) => {
  if (msg.text === "/start_guapanator") {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "It's GUAP time, baby!");
  }
  if (msg.text === "/stop_guapanator") {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "Guapanator stopped");
    chatId = null;
  }
});

export const sendTgPic = (image, name, metadataURI) => {
  const options = {
    caption: `${name} just got GUAPANATED!`,
    reply_markup: {
      inline_keyboard: [
          [{ text: "MINT THIS", url: `https://getguap.xyz/mint?metadatauri=${metadataURI}` }],
          [
            {
              text: "GUAPANIZE YOUR IMAGES HERE",
              url: "https://getguap.xyz/guapanator",
            },
          ],
      ],
    },
  };
  if (chatId) {
    console.log(image)
    bot.sendPhoto(chatId, image, options);
  } else {
    console.log(
      "Chat ID not set. Make sure /start has been triggered by a user."
    );
  }
};
