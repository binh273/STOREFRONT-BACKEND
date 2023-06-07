import express, { Request, Response } from 'express';
import { Order_item, Order_items } from '../models/order_items';
import { Orders } from '../models/orders';
import { Products } from '../models/product';
import { totalIncrease, totalReduced } from '../helpers/count_price';
import { checkOrderItems } from '../utiliti/checkInput';
import { verifyToken } from '../middleware/verifyToken';

const store = new Order_items();
const orders = new Orders();
const products = new Products();

const create = async (req: Request, res: Response) => {
  const order_item: Order_item = {
    order_id: req.body.order_id,
    product_id: req.body.product_id,
    quantity: req.body.quantity,
  };
  try {
    const check = await checkOrderItems(order_item)
    if(check){
      const order = await orders.getById(order_item.order_id);
      const product = await products.getById(order_item.product_id);
      if (order == undefined || product == undefined) {
        res.status(404).json('Could not get order id or product id');
      } else {
        order.total_amount = await totalIncrease(
          +order.total_amount,
          order_item.quantity,
          +product.price,
        );
        const OIResult = await store.create(order_item);
        if (OIResult != undefined) {
          await orders.updateById(order);
          res.json(OIResult);
        } else {
          res.status(400).json('Could not create order items');
        }
      }
    }else{
      res.status(400).json('Could not create order items');
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const OIResult = await store.getAll();
    if (OIResult.length > 0) {
      res.json(OIResult);
    } else {
      res.status(400).json('Could not get list order item');
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const OIResult = await store.getById(Number(req.params.id));
    if (OIResult != undefined) {
      res.json(OIResult);
    } else {
      res.status(400).json('Could not get  order item');
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const currentOrderItems = await store.getById(Number(req.params.id));
    const order = await orders.getById(currentOrderItems.order_id);
    const product = await products.getById(currentOrderItems.product_id);

    order.total_amount = await totalReduced(
      +order.total_amount,
      currentOrderItems.quantity,
      +product.price,
    );
    const OIResult = await store.deleteById(Number(req.params.id));

    if (OIResult != undefined) {
      await orders.updateById(order);
      res.json(OIResult);
    } else {
      res.status(400).json('Could not create order items');
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const updateById = async (req: Request, res: Response) => {
  const order_item: Order_item = {
    id: Number(req.params.id),
    order_id: req.body.order_id,
    product_id: req.body.product_id,
    quantity: req.body.quantity,
  };
  try {
    const currentOrderItems = await store.getById(Number(req.params.id));
    if (currentOrderItems == undefined) {
      res.status(400).json('Could not update order items');
    } else {
      const orderOld = await orders.getById(currentOrderItems.order_id);
      const productOld = await products.getById(currentOrderItems.product_id);

      if (orderOld == undefined || productOld == undefined) {
        res.status(404).json('Could not get order id or product id');
      } else {
        orderOld.total_amount = await totalReduced(
          +orderOld.total_amount,
          currentOrderItems.quantity,
          +productOld.price,
        );
        const resultReduce = await orders.updateById(orderOld);

        const order = await orders.getById(order_item.order_id);
        const product = await products.getById(order_item.product_id);

        order.total_amount = await totalIncrease(
          +order.total_amount,
          order_item.quantity,
          +product.price,
        );
        const resultIncrease = await orders.updateById(order);

        if (resultReduce != undefined && resultIncrease != undefined) {
          const result = await store.updateById(order_item);
          if (result != undefined) {
            res.json(result);
          } else {
            res.status(400).json('Could not update order items');
          }
        } else {
          res.status(400).json('Could not update order items');
        }
      }
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const order_items = (app: express.Application) => {
  app.post('/orderitems',verifyToken, create);
  app.delete('/orderitems/:id',verifyToken, deleteById);
  app.get('/orderitems',verifyToken, getAll);
  app.get('/orderitems/:id',verifyToken, getById);
  app.put('/orderitems/:id',verifyToken, updateById);
};

export default order_items;
