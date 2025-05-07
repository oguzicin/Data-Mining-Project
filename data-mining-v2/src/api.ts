import { AuthorText } from "./types";

const BASE_URL = "http://127.0.0.1:5000";

export const fetchAuthorTexts = async (author: string): Promise<AuthorText[]> => {
  const res = await fetch(`${BASE_URL}/author/${author}`);
  return res.json();
};

