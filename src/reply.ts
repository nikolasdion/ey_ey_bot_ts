// List of strings which triggers an echo response
const ECHOED_WORDS = ["ey", "ea", "gelow", "anying"];

export const getReply = (text: string | undefined): string | null =>
  text ? getEcho(text) : null;

const getEcho = (text: string): string | null => {
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

const getEchoMatch = (text: string, wordToMatch: string): string | null => {
  const truncatedText = text.substring(0, wordToMatch.length);
  return truncatedText.toLowerCase() === wordToMatch ? truncatedText : null;
};
