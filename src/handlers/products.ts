import express, { Request, Response } from 'express';
import { Product, Products } from '../models/product';
import { verifyToken } from '../middleware/verifyToken';
import { checkProduct } from '../utiliti/checkInput';

const products = new Products();

const create = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    link_image: req.body.link_image,
  };

  try {
    const check = await checkProduct(product)
    if(check){
      const newProduct = await products.create(product);
      if (newProduct != undefined) {
        res.status(200).json(newProduct);
      } else {
        res.status(400).json('Could not create product');
      }
    } else {
      res.status(400).json('Could not create product');
    }
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const allProduct = await products.getAll();
    if (allProduct.length > 0) {
      res.status(200).json(allProduct);
    } else {
      res.status(400).json('Could not get list product');
    }
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const product = await products.getById(Number(req.params.id));
    if (product != undefined) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Could not get product.' });
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const product = await products.deleteById(Number(req.params.id));
    if (product != undefined) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Could not delete product.' });
    }
  } catch (error) {
    res.status(500);
    res.json(error);
    return;
  }
};

const update = async (req: Request, res: Response) => {
  const product: Product = {
    id: Number(req.params.id),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    link_image: req.body.link_image,
  };
  try {
    const resultProduct = await products.update(product);
    if (resultProduct != undefined) {
      res.status(200).json(resultProduct);
    } else {
      res.status(404).json({ error: 'Could not update product.' });
    }
  } catch (error) {
    res.status(400);
    res.json(error);
    return;
  }
};
const product_routers = (app: express.Application) => {
  app.post('/products',verifyToken, create);
  app.put('/products/:id',verifyToken, update);
  app.get('/products/:id',verifyToken, getById);
  app.get('/products',verifyToken, getAll);
  app.delete('/products/:id',verifyToken, deleteById);
};

export default product_routers;
