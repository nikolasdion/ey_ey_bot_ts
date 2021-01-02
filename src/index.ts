import axios from "axios";

const API_TOKEN = process.env.API_TOKEN;

const verifyToken = (token: string | undefined) => {
  if (token === undefined) {
    throw Error("Trying to verify token but token is not defined.");
  }

  const url = `https://api.telegram.org/bot${token}/getMe`;
  axios
    .get(url)
    .then((result) => {
      switch (result.status) {
        case 200:
          if (result.data.ok && result.data.result.is_bot) {
            console.log(
              `Bot token verified, response: ${JSON.stringify(result.data)}`
            );
          } else {
            throw Error(
              `Token is not for a bot, response: ${JSON.stringify(result.data)}`
            );
          }

          return;
        default:
          throw Error(`Bot token verification did not succeed: ${result}`);
      }
    })
    .catch((reason) => {
      throw Error(`Bot token verification error: ${reason}`);
    });
};

const start = () => {
  console.log("*** STARTING APPLICATION ***");

  verifyToken(API_TOKEN);
};

start();
