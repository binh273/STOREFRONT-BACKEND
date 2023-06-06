import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { TOKEN_SECRET } = process.env;

export const getToken = async (username: string): Promise<string> => {
  return jwt.sign(
    { username: username },
    TOKEN_SECRET as unknown as string,
  );
};

