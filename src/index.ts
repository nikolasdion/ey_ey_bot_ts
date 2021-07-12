import {
  verifyApiToken,
  Message,
  sendMessage,
  getLatestMessageSince,
} from "./http-client";
import { getReply } from "./reply";

const start = async () => {
  console.log("*** STARTING APPLICATION ***");

  const apiToken = await verifyApiToken(process.env.API_TOKEN);

  let latestMessage: Message | undefined;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    latestMessage = await getLatestMessageSince(apiToken, latestMessage);
    const chatId = latestMessage.chatId;
    const reply = getReply(latestMessage.text);

    if (reply) {
      sendMessage(apiToken, chatId, reply);
    }
  }
};

start();
