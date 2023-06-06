import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const PEPPER = process.env.PEPPER;
const SALTROUNDS = process.env.SALT_ROUNDS;

export const getHashPassword = async (password: string): Promise<string> => {
  const salt = bcrypt.genSaltSync(Number(SALTROUNDS));
  const passwordHash = bcrypt.hashSync(password + PEPPER, salt);
  return passwordHash.toString();
};