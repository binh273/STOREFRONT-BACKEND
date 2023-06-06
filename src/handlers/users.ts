import express, { Request, Response } from 'express';
import { User, Users } from '../models/user';
import { verifyToken } from '../middleware/verifyToken';
import { checkUser } from '../utiliti/checkInput';

const users = new Users();

const create = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
  };
  try {
    const check = await checkUser(user);

    if(check){
        const newUser = await users.create(user);
      if (newUser != undefined) {
        res.status(200).json(newUser);
      } else {
        res.status(400).json({ err:'Could not create user'});
      }
    }else {
      res.status(400).json({ err:'Could not create user'})
    }
  } catch (error) {
    res.status(500);
    res.json({ error: (error as Error).message });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const allUsers = await users.getAll();
    if (allUsers.length > 0) {
      res.status(200).json(allUsers);
    } else {
      res.status(400).json({ err:'Could not get list user'});
    }
  } catch (error) {
    res.status(500);
    res.json({ error: (error as Error).message });
  }
};

const getById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await users.getById(Number(id));
    if (user != undefined) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ err: 'Could not get user.' });
    }
  } catch (error) {
    res.status(500);
    res.json({ error: (error as Error).message });
  }
};

const deleteById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await users.deleteById(Number(id));
    if (user != undefined) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ err: 'Could not delete user.' });
    }
  } catch (error) {
    res.status(500);
    res.json({ error: (error as Error).message });
  }
};

const update = async (req: Request, res: Response) => {
  const user: User = {
    id: Number(req.params.id),
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    const userResult = await users.update(user);
    if (userResult != undefined) {
      res.status(200).json(userResult);
    } else {
      res.status(404).json({ err: 'Could not update user.' });
    }
  } catch (error) {
    res.status(500);
    res.json({ error: (error as Error).message });
  }
};

const authenticate = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const result = await users.authenticate(username, password);
    if (result != undefined) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ err: 'Authenticate faile.' });
    }
  } catch (error) {
    res.status(500);
    res.json({ error: (error as Error).message });
  }
};

const login = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await users.login(username, password);
    if (result != undefined) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ err: 'Login faile.' });
    }
  } catch (error) {
    res.status(500);
    res.json({ error: (error as Error).message });
  }
};

const users_routes = (app: express.Application) => {
  app.post('/users', create);
  app.get('/users',verifyToken, getAll);
  app.get('/users/:id',verifyToken, getById);
  app.put('/users/:id',verifyToken, update);
  app.delete('/users/:id',verifyToken, deleteById);
  app.post('/authenticate', authenticate);
  app.post('/login', login);
};

export default users_routes;
