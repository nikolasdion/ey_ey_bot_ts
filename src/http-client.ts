import axios from "axios";

const createUrl = (token: string) => {
  return `https://api.telegram.org/bot${token}`;
};

export type Message = {
  chatId: number;
  text: string | undefined;
  updateId: number | undefined;
};

/** Update from server. */
type Update = {
  message: {
    chat: {
      id: number;
    };
    text: string | undefined;
  };
  update_id: number | undefined;
};

export const verifyApiToken = async (
  apiToken: string | undefined
): Promise<string> => {
  if (apiToken === undefined) {
    throw Error("Trying to verify token but token is not defined.");
  }

  const url = `${createUrl(apiToken)}/getMe`;

  try {
    const response = await axios.get(url);
    // We should get a User as the result data here.
    const user = response.data.result;
    if (user.is_bot) {
      console.log(`Bot token verified: ${JSON.stringify(response.data)}`);
      return apiToken;
    } else {
      throw Error(
        `Token is not for a bot, but for: ${JSON.stringify(response.data)}`
      );
    }
  } catch (reason) {
    throw Error(`Bot token verification error: ${reason}`);
  }
};

export const sendMessage = async (
  apiToken: string,
  chatId: number,
  text: string
): Promise<void> => {
  const url = createUrl(apiToken) + "/sendMessage";
  const params = {
    chat_id: chatId,
    text: text,
  };

  try {
    const response = await axios.post(url, params);
    console.log(
      `Sent message ${text} to ${chatId}, response: ${JSON.stringify(
        response.data
      )}`
    );
  } catch (reason) {
    console.log(
      `Failed to send message ${text} to ${chatId}, reason: ${reason}`
    );
  }
};

export const getLatestMessageSince = async (
  apiToken: string,
  prevMessage: Message | undefined
): Promise<Message> => {
  const update = await getLatestUpdateSince(apiToken, prevMessage);
  return {
    chatId: update.message.chat.id,
    text: update.message.text,
    updateId: update.update_id,
  };
};

const getLatestUpdateSince = async (
  apiToken: string,
  prevMessage: Message | undefined
): Promise<Update> => {
  console.log("Getting latest update ...");

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const updates = await getUpdatesSince(apiToken, prevMessage);

    if (updates && updates[0]) {
      console.log("Got latest update.");
      const latestUpdate = updates[updates.length - 1];
      return latestUpdate;
    } else {
      console.log("No updates since last time, try sending request again");
    }
  }
};

const getUpdatesSince = (
  apiToken: string,
  prevMessage: Message | undefined
): Promise<Update[] | null> => {
  const params = {
    timeout: 100,
    offset: prevMessage?.updateId ? prevMessage.updateId + 1 : 0,
  };

  const url = createUrl(apiToken) + "/getUpdates";

  return axios
    .get(url, { params })
    .then((response) => {
      if (response?.data?.result) {
        return response.data.result;
      } else {
        console.log(
          `Response doesn't contain result. Full response: ${JSON.stringify(
            response
          )}`
        );
        return null;
      }
    })
    .catch((reason) => {
      console.log(`Failed to get latest updates, reason: ${reason}`);
    });
};
