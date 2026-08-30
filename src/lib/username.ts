export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 24;

const USERNAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const BLOCKED_USERNAME_PARTS = [
  "admin",
  "administrator",
  "moderator",
  "support",
  "typeittestit",
  "fuck",
  "fck",
  "shit",
  "bitch",
  "asshole",
  "dick",
  "cunt",
  "porn",
  "nazi",
];

export type UsernameValidation = {
  username: string;
  error: string | null;
};

export function validateUsername(value: string): UsernameValidation {
  const username = value.trim();

  if (username.length < USERNAME_MIN_LENGTH) {
    return { username, error: "Username must be at least " + USERNAME_MIN_LENGTH + " characters." };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return { username, error: "Username must be " + USERNAME_MAX_LENGTH + " characters or fewer." };
  }

  if (!USERNAME_PATTERN.test(username)) {
    return {
      username,
      error: "Use letters, numbers, underscores, or hyphens, and start with a letter or number.",
    };
  }

  const normalized = username.toLowerCase();
  if (BLOCKED_USERNAME_PARTS.some((part) => normalized.includes(part))) {
    return {
      username,
      error: "Please choose a respectful username without profanity, sexual language, or impersonation.",
    };
  }

  return { username, error: null };
}
