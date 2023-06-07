import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  order_date: string | Date;
  total_amount: number | string;
};

export class Orders {
  async create(order: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (user_id,order_date,total_amount) VALUES($1,$2,$3) RETURNING *';

      const conn = await Client.connect();
      const result = await conn.query(sql, [
        order.user_id,
        order.order_date,
        order.total_amount,
      ]);
      conn.release();
      const orderResult = result.rows[0];
      return orderResult;
    } catch (error) {
      throw new Error(`Could not add orders ${error}`);
    }
  }

  async getAll(): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders';
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Counld not get order ${error}`);
    }
  }

  async getById(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      const order = result.rows[0];
      return order;
    } catch (error) {
      throw new Error(`Could not get order ${id}. Error: ${error}`);
    }
  }

  async deleteById(id: number): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';

      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();

      const order = result.rows[0];
      return order;
    } catch (error) {
      throw new Error(`Could not delete order id = ${id}. Error: ${error}`);
    }
  }

  async updateById(order: Order): Promise<Order> {
    try {
      const sql =
        'UPDATE orders SET user_id = $1, order_date = $2, total_amount = $3 WHERE id = $4 RETURNING *';

      const conn = await Client.connect();

      const result = await conn.query(sql, [
        order.user_id,
        order.order_date,
        order.total_amount,
        order.id,
      ]);

      const orderResult = result.rows[0];

      conn.release();

      return orderResult;
    } catch (error) {
      throw new Error(
        `Could not update order id = ${order.id}. Error: ${error}`,
      );
    }
  }
}
