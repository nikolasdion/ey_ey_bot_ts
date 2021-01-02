import {
  verifyApiToken,
  Message,
  sendMessage,
  getLatestMessageSince,
} from "./http-client";
import { getReply } from "./reply";

const start = async () => {
  console.log("*** STARTING APPLICATION ***");

  const apiToken = process.env.API_TOKEN;
  await verifyApiToken(apiToken);

  let latestMessage: Message | undefined;

  while (true) {
    latestMessage = await getLatestMessageSince(apiToken!!, latestMessage);
    let chatId = latestMessage.chatId;
    let reply = getReply(latestMessage.text);

    if (reply) {
      sendMessage(apiToken!!, chatId, reply);
    }
  }
};

start();
