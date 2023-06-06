import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  description?: string;
  price: number | string;
  link_image?: string;
};

export class Products {
  async create(product: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name,description,price,link_image) VALUES($1,$2,$3,$4) RETURNING id,name,description,price,link_image';

      const conn = await Client.connect();

      const result = await conn.query(sql, [
        product.name,
        product.description,
        product.price,
        product.link_image,
      ]);

      const productResult = result.rows[0];
      +(productResult.price)
      conn.release();

      return productResult;
    } catch (error) {
      throw new Error(`Could not create product. Error: ${error}`);
    }
  }

  async getAll(): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products';
      const conn = await Client.connect();

      const result = await conn.query(sql);

      const products = result.rows;

      conn.release();

      return products;
    } catch (error) {
      throw new Error(`Could not show all products. Error: ${error}`);
    }
  }

  async getById(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (error) {
      throw new Error(`Could not show product ${id}. Error: ${error}`);
    }
  }

  async deleteById(id: number): Promise<Product | undefined> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING id,name,description,price,link_image';

      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      const productResult = result.rows[0];
      return productResult;
    } catch (error) {
      throw new Error(`Could not delete product ${id}. Error: ${error}`);
    }
  }

  async update(product: Product): Promise<Product> {
    try {
      console.log(product)
      const sql = `UPDATE products SET name = $1, description = $2, price = $3, link_image = $4 WHERE id = $5 RETURNING id,name,description,price,link_image`;
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        product.name,
        product.description,
        product.price,
        product.link_image,
        product.id,
      ]);
      console.log(result)
      conn.release();
      const productResult = result.rows[0];
      return productResult;
    } catch (error) {
      throw new Error(
        `Could not update product ${product.id}. Error: ${error}`,
      );
    }
  }
}
