// List of strings which triggers an echo response
const ECHOED_WORDS = ["ey", "ea", "gelow", "anying"];

export const getReply = (text: string | undefined) => {
  if (!text) {
    return null;
  } else {
    return getEcho(text);
  }
};

const getEcho = (text: string) => {
  let echo = null;

  ECHOED_WORDS.some((word) => {
    const match = getEchoMatch(text, word);
    if (match) {
      echo = match;
      return false;
    }
  });

  return echo;
};

const getEchoMatch = (text: string, wordToMatch: string) => {
  const truncatedText = text.substring(0, wordToMatch.length);
  if (truncatedText.toLowerCase() === wordToMatch) {
    return truncatedText;
  } else {
    return null;
  }
};
