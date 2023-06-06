import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const TOKENSECRET = process.env.TOKEN_SECRET;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (token) {
      jwt.verify(token, TOKENSECRET as string, (error: any) => {
        if (error) {
          res.status(500).send({
            auth: false,
            message: `Failed to authenticate token. ${error}`,
          });
        }
        next();
      });
    } else {
      return res
        .status(401)
        .send({ auth: false, message: 'Token not provided.' });
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
};
