import Client from '../database';

export type Order_item = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class Order_items {
  async create(order_item: Order_item): Promise<Order_item> {
    try {
      const sql =
        'INSERT INTO order_items (order_id,product_id,quantity) VALUES($1,$2,$3) RETURNING *';

      const conn = await Client.connect();
      const result = await conn.query(sql, [
        order_item.order_id,
        order_item.product_id,
        order_item.quantity,
      ]);
      const OIResult = result.rows[0];

      conn.release();

      return OIResult;
    } catch (error) {
      throw new Error(
        `Could not add item ${order_item.product_id} to order ${order_item.order_id} : ${error}`,
      );
    }
  }
  async getAll(): Promise<Order_item[]> {
    try {
      const sql = 'SELECT * FROM order_items';

      const conn = await Client.connect();
      const result = await conn.query(sql);
      const OIResult = result.rows;

      conn.release();

      return OIResult;
    } catch (error) {
      throw new Error(`Could not get order_items : ${error}`);
    }
  }
  async getById(id: number): Promise<Order_item> {
    try {
      const sql = 'SELECT * FROM order_items WHERE id = $1';

      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const OIResult = result.rows[0];

      conn.release();

      return OIResult;
    } catch (error) {
      throw new Error(`Could not get order_items id = ${id} : ${error}`);
    }
  }

  async deleteById(id: number): Promise<Order_item> {
    try {
      const sql = 'DELETE FROM order_items WHERE id=($1) RETURNING *';

      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const OIResult = result.rows[0];

      conn.release();

      return OIResult;
    } catch (error) {
      throw new Error(`Could not delete order_items id = ${id} : ${error}`);
    }
  }

  async updateById(order_item: Order_item): Promise<Order_item> {
    try {
      const sql =
        'UPDATE order_items SET order_id = $1, product_id = $2, quantity = $3 WHERE id = $4 RETURNING *';

      const conn = await Client.connect();
      const result = await conn.query(sql, [
        order_item.order_id,
        order_item.product_id,
        order_item.quantity,
        order_item.id,
      ]);
      const OIResult = result.rows[0];
      conn.release();

      return OIResult;
    } catch (error) {
      throw new Error(
        `Could not delete order_items id = ${order_item.id} : ${error}`,
      );
    }
  }
}
