import client from "../../database"
import { getToken } from "../../helpers/jwt";
import { Products,Product } from "../../models/product";
import supertest from "supertest";

const arrProducts : Product[] = [
    {
        name : "IPHONE 19",
        description : "IPHONE FAKE GIA SIU RE1",
        price : 100,
        link_image : "Link anh se bo sung sau khi ban"
    },
    {
        name : "IPHONE 20",
        description : "IPHONE FAKE GIA SIU RE2",
        price : 150,
        link_image : "Link anh se bo sung sau khi ban"
    },
    {
        name : "IPHONE 21",
        description : "IPHONE FAKE GIA SIU RE3",
        price : 200,
        link_image : "Link anh se bo sung sau khi ban"
    }
]

const productCreate : Product = {
    name : "IPHONE 22",
    description : "IPHONE FAKE GIA SIU RE1",
    price : 50,
    link_image : "Link anh se bo sung sau khi ban"
}

const productUpdate : Product = {
    id: 4,
    name : "IPHONE 22222222",
    description : "IPHONE FAKE GIA SIU RE1",
    price : 75,
    link_image : "Link anh se bo sung sau khi ban"
}

let token : string;

const endPoint = 'http://localhost:3000'

const products = new Products();

const request = supertest(endPoint)

const resetIdDB = async () => {
    try {
        const conn = await client.connect();
        await conn.query('DELETE FROM products');
        await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
        conn.release();
    } catch (error) {
    console.log(error);
    }
}

const createRecord = async (arrProducts : Product[]) => {
    const conn = await client.connect();
    const sql = `INSERT INTO products(name, description,price,link_image) VALUES($1, $2, $3, $4) RETURNING name, description,price,link_image`;
  for (const product of arrProducts) {
    await conn.query(sql, [
      product.name,
      product.description,
      product.price,
      product.link_image,
    ]);
  }
  conn.release();
}

describe('Product model :', () => {
    beforeAll(async () => {
        await resetIdDB();
        await createRecord(arrProducts);
      });

    it('Method create product success ',async () => {
        const productResult = await products.create(productCreate)
        expect(productResult).toEqual({
            id: 4,
            name : "IPHONE 22",
            description : "IPHONE FAKE GIA SIU RE1",
            price : '50.00',
            link_image : "Link anh se bo sung sau khi ban"
        })
    })
    it('Method getById product success ',async () => {
        const productResult = await products.getById(4)
        expect(productResult).toEqual({
            id : 4,
            name : "IPHONE 22",
            description : "IPHONE FAKE GIA SIU RE1",
            price : `50.00`,
            link_image : "Link anh se bo sung sau khi ban"
        })
    })
    it('Method getAll product success ',async () => {
        const productResult = await products.getAll()
        expect(productResult).toEqual([
            {
                id: 1,
                name : "IPHONE 19",
                description : "IPHONE FAKE GIA SIU RE1",
                price : `100.00`,
                link_image : "Link anh se bo sung sau khi ban"
            },
            {
                id: 2,
                name : "IPHONE 20",
                description : "IPHONE FAKE GIA SIU RE2",
                price : `150.00`,
                link_image : "Link anh se bo sung sau khi ban"
            },
            {
                id : 3,
                name : "IPHONE 21",
                description : "IPHONE FAKE GIA SIU RE3",
                price : `200.00`,
                link_image : "Link anh se bo sung sau khi ban"
            },
            {
                id : 4,
                name : "IPHONE 22",
                description : "IPHONE FAKE GIA SIU RE1",
                price : `50.00`,
                link_image : "Link anh se bo sung sau khi ban"
            }
        ])
    })
    it('Method update product success ',async () => {
        const productResult = await products.update(productUpdate)
        expect(productResult).toEqual({
            id : 4,
            name : "IPHONE 22222222",
            description : "IPHONE FAKE GIA SIU RE1",
            price : `75.00`,
            link_image : "Link anh se bo sung sau khi ban"
        })
    })
    it('Method delete product success ',async () => {
        const productResult = await products.deleteById(4)
        expect(productResult).toEqual({
            id : 4,
            name : "IPHONE 22222222",
            description : "IPHONE FAKE GIA SIU RE1",
            price : `75.00`,
            link_image : "Link anh se bo sung sau khi ban"
        })
    })

})

describe('Handler products :',() => {
    beforeAll(async () => {
        await resetIdDB();
        await createRecord(arrProducts);
        token = `beare ${await getToken('binhnnt')}`;
      });
    it('Create products success - status 200 ',async () => {
        const response = await request.post(`/products/`).set(`Authorization`, token).send(productCreate)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id: 4,
            name : "IPHONE 22",
            description : "IPHONE FAKE GIA SIU RE1",
            price : '50.00',
            link_image : "Link anh se bo sung sau khi ban"
        })
    });
    it('Create products faile - status 400 ',async () => {
        const response = await request.post(`/products/`).set(`Authorization`, token).send({    name : "",
        description : "IPHONE FAKE GIA SIU RE1",
        price : 0,
        link_image : "Link anh se bo sung sau khi ban"})
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual('Could not create product')
    });

    it('Get all products success - status 200 ',async () => {
        const response = await request.get(`/products/`).set(`Authorization`, token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([
            {
                id: 1,
                name : "IPHONE 19",
                description : "IPHONE FAKE GIA SIU RE1",
                price : `100.00`,
                link_image : "Link anh se bo sung sau khi ban"
            },
            {
                id: 2,
                name : "IPHONE 20",
                description : "IPHONE FAKE GIA SIU RE2",
                price : `150.00`,
                link_image : "Link anh se bo sung sau khi ban"
            },
            {
                id : 3,
                name : "IPHONE 21",
                description : "IPHONE FAKE GIA SIU RE3",
                price : `200.00`,
                link_image : "Link anh se bo sung sau khi ban"
            },
            {
                id : 4,
                name : "IPHONE 22",
                description : "IPHONE FAKE GIA SIU RE1",
                price : `50.00`,
                link_image : "Link anh se bo sung sau khi ban"
            }
        ])
    });
    it('Get all products faile - status 500 ',async () => {
        const response = await request.post(`/products/`).set(`Authorization`, token).send({})
        expect(response.statusCode).toBe(500)
    });
    it('Get products by id success - status 200 ',async () => {
        const response = await request.get(`/products/4`).set(`Authorization`, token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id : 4,
            name : "IPHONE 22",
            description : "IPHONE FAKE GIA SIU RE1",
            price : `50.00`,
            link_image : "Link anh se bo sung sau khi ban"
        })
    });
    it('Get products by id faile - status 404 ',async () => {
        const response = await request.get(`/products/0`).set(`Authorization`, token)
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ error: 'Could not get product.' })
    });
    it('Update products by id success - status 200 ',async () => {
        const response = await request.put(`/products/4`).set(`Authorization`, token).send(productUpdate)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id : 4,
            name : "IPHONE 22222222",
            description : "IPHONE FAKE GIA SIU RE1",
            price : `75.00`,
            link_image : "Link anh se bo sung sau khi ban"
        })
    });
    it('Update products by id faile - status 404 ',async () => {
        const response = await request.put(`/products/0`).set(`Authorization`, token).send(productUpdate)
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ error: 'Could not update product.' })
    });
    it('Delete by id success - status 200 ',async () => {
        const response = await request.delete(`/products/4`).set(`Authorization`, token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id : 4,
            name : "IPHONE 22222222",
            description : "IPHONE FAKE GIA SIU RE1",
            price : `75.00`,
            link_image : "Link anh se bo sung sau khi ban"
        })
    });
    it('Delete by id faile - status 404 ',async () => {
        const response = await request.delete(`/products/0`).set(`Authorization`, token)
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ error: 'Could not delete product.' })
    });
});

