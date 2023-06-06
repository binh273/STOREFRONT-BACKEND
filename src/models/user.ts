import Client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const PEPPER = process.env.BCRYPT_PASSWORD;
const SALTROUNDS = process.env.SALT_ROUNDS;
const TOKENSECRET = process.env.TOKEN_SECRET;

export type User = {
  id?: number;
  username: string;
  password: string;
  email: string;
  phone: string;
};

export type UserResult = {
  id?: number;
  username: string;
  email: string;
  phone: string;
};

export class Users {
  async create(user: User): Promise<UserResult> {
    try {
      const sql = `INSERT INTO users(username, password_digest,email,phone) VALUES($1, $2, $3, $4) RETURNING id,username,email,phone`;

      const salt = bcrypt.genSaltSync(Number(SALTROUNDS));
      const hash = bcrypt.hashSync(user.password + PEPPER, salt);

      const conn = await Client.connect();
      const result = await conn.query(sql, [
        user.username,
        hash,
        user.email,
        user.phone,
      ]);
      const userResult = result.rows[0];

      conn.release();

      return userResult;
    } catch (error) {
      throw new Error(`Failed to create user. Error : ${error}`);
    }
  }
  async getById(id: number): Promise<UserResult> {
    try {
      const sql = `SELECT id,username,email,phone From users WHERE id = $1`;

      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const userResult: UserResult = result.rows[0];

      conn.release();

      return userResult;
    } catch (error) {
      throw new Error(`Failed to get user by id. Error : ${error}`);
    }
  }
  async getAll(): Promise<UserResult[]> {
    try {
      const sql = `SELECT id,username,email,phone From users`;

      const conn = await Client.connect();
      const result = await conn.query(sql);
      const userResult: UserResult[] = result.rows;

      conn.release();

      return userResult;
    } catch (error) {
      throw new Error(`Failed to get all user. Error : ${error}`);
    }
  }
  async update(user: User): Promise<UserResult> {
    try {
      const sql = `UPDATE users SET username = $1,password_digest = $2,email = $3,phone =$4 WHERE id = $5 RETURNing id,username,email,phone`;

      const salt = bcrypt.genSaltSync(Number(SALTROUNDS));
      const hash = bcrypt.hashSync(user.password + PEPPER, salt);

      const conn = await Client.connect();
      const result = await conn.query(sql, [
        user.username,
        hash,
        user.email,
        user.phone,
        user.id,
      ]);
      const userResult: UserResult = result.rows[0];

      conn.release();
      return userResult;
    } catch (error) {
      throw new Error(`Failed to update user id. Error : ${error}`);
    }
  }
  async deleteById(id: number): Promise<UserResult> {
    try {
      const sql = `DELETE FROM users WHERE id=$1 RETURNING id,username,email,phone`;

      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const userResult: UserResult = result.rows[0];
      conn.release();

      return userResult;
    } catch (error) {
      throw new Error(`Failed to delete user by id. Error : ${error}`);
    }
  }
  async authenticate(
    username: string,
    password: string,
  ): Promise<UserResult | undefined> {
    try {
      const sql = 'SELECT * FROM users WHERE username=($1)';

      const conn = await Client.connect();
      const result = await conn.query(sql, [username]);
      if (result.rows.length) {
        const user = result.rows[0];

        if (bcrypt.compareSync(password + PEPPER, user.password_digest)) {
          const userResult: UserResult = {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
          };
          return userResult;
        }
      }
      return;
    } catch (error) {
      throw new Error(`Failed to authentication. Error : ${error} `);
    }
  }
  async login(username: string, password: string): Promise<object | undefined> {
    try {
      const result = await this.authenticate(username, password);
      if (result) {
        const accessToken = jwt.sign(
          { userId: result.id },
          TOKENSECRET as string,
          {
            expiresIn: '30m',
          },
        );

        const refreshToken = jwt.sign(
          { userId: result.id },
          TOKENSECRET as string,
          {
            expiresIn: '7d',
          },
        );
        return { accessToken, refreshToken };
      } else {
        return;
      }
    } catch (error) {
      throw new Error(`Failed to login. Error : ${error} `);
    }
  }
}
