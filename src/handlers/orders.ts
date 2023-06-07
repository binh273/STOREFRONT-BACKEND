import express, { Request, Response } from 'express';
import { Order, Orders } from '../models/orders';
import { verifyToken } from '../middleware/verifyToken';
import { checkOrder } from '../utiliti/checkInput';

const orders = new Orders();

const create = async (req: Request, res: Response) => {
  const order: Order = {
    user_id: req.body.user_id,
    order_date: req.body.order_date,
    total_amount: req.body.total_amount,
  };

  try {
    const check = await checkOrder(order);
    if(check){
      const createOrder = await orders.create(order);
      if (createOrder != undefined) {
        res.status(200).json(createOrder);
      } else {
        res.status(400).json('Could not create order');
      }
    } else {
      res.status(400).json('Could not create order');
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const showAll = await orders.getAll();
    if (showAll.length > 0) {
      res.json(showAll);
    } else {
      res.status(400).json('Could not get list order');
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const showOne = await orders.getById(Number(req.params.id));
    if (showOne != undefined) {
      res.status(200).json(showOne);
    } else {
      res.status(400).json('Could not get order');
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const order = await orders.deleteById(Number(req.params.id));
    if (order != undefined) {
      res.status(200).json(order);
    } else {
      res.status(400).json('Could not delete order');
    }
  } catch (error) {
    res.status(400);
    res.json(error);
    return;
  }
};

const updateById = async (req: Request, res: Response) => {
  const order: Order = {
    id: Number(req.params.id),
    user_id: req.body.user_id,
    order_date: req.body.order_date,
    total_amount: req.body.total_amount,
  };

  try {
    const createOrder = await orders.updateById(order);
    if (createOrder != undefined) {
      res.status(200).json(createOrder);
    } else {
      res.status(400).json('Could not update order');
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};
const orders_Router = (app: express.Application) => {
  app.post('/orders',verifyToken, create);
  app.delete('/orders/:id',verifyToken, deleteById);
  app.put('/orders/:id',verifyToken, updateById);
  app.get('/orders',verifyToken, getAll);
  app.get('/orders/:id',verifyToken, getById);
};

export default orders_Router;
