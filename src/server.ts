import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import users_routes from './handlers/users';
import product_routers from './handlers/products';
import orders_Router from './handlers/orders';
import order_items from './handlers/order_items';

const app: express.Application = express();
const address = '127.0.0.1:3000';

app.use(bodyParser.json());

app.listen(3000, function () {
  console.log(`starting app on: http://${address}`);
});

users_routes(app);
product_routers(app);
orders_Router(app);
order_items(app);
