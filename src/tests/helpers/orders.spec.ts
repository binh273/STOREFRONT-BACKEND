import client from "../../database"
import { getToken } from "../../helpers/jwt";
import { Order,Orders } from "../../models/orders";
import supertest from "supertest";

const arrOrders : Order[] = [
    {
        user_id : 1,
        order_date : "2023-05-23 15:15:00",
        total_amount : 1
    },
    {
        user_id : 1,
        order_date : "2023-05-24 15:15:00",
        total_amount : 2
    },
    {
        user_id : 1,
        order_date : "2023-05-25 15:15:00",
        total_amount : 3
    }
]

const orderCreate : Order = {
    user_id : 1,
    order_date : "2023-05-23 15:15:00",
    total_amount : 4
}

const orderUpdate : Order = {
    id: 4,
    user_id : 1,
    order_date : "2023-05-24 15:15:00",
    total_amount : 6
}

let token : string;

const endPoint = 'http://localhost:3000'

const orders = new Orders();

const request = supertest(endPoint)

const resetIdDB = async () => {
    try {
        const conn = await client.connect();
        await conn.query('DELETE FROM orders');
        await conn.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
        conn.release();
    } catch (error) {
    console.log(error);
    }
}

const createRecord = async (arrOrders : Order[]) => {
    const conn = await client.connect();
    const sqlOrder = `INSERT INTO orders(user_id, order_date,total_amount) VALUES($1, $2, $3) RETURNING user_id, order_date,total_amount`;
    for (const order of arrOrders) {
        await conn.query(sqlOrder, [
            order.user_id,
            order.order_date,
            order.total_amount
        ]);
    }
  conn.release();
}

describe('Orders model :', () => {
    beforeAll(async () => {
        await resetIdDB();
        await createRecord(arrOrders);
      });

    it('Method create orders success ',async () => {
        const productResult = await orders.create(orderCreate)
        expect(productResult).toEqual({
            id: 4,
            user_id : 1,
            order_date : new Date ("2023-05-23T08:15:00.000Z"),
            total_amount : "4.00"
        })
    })
    it('Method getById orders success ',async () => {
        const productResult = await orders.getById(4)
        expect(productResult).toEqual({
            id : 4,
            user_id : 1,
            order_date : new Date("Tue May 23 2023 15:15:00 GMT+0700 (Indochina Time)"),
            total_amount : "4.00"
        })
    })
    it('Method getAll orders success ',async () => {
        const productResult = await orders.getAll()
        expect(productResult).toEqual([
            {
                id : 1,
                user_id : 1,
                order_date : new Date("Tue May 23 2023 15:15:00 GMT+0700 (Indochina Time)"),
                total_amount : "1.00"
            },
            {
                id : 2,
                user_id : 1,
                order_date : new Date("Wed May 24 2023 15:15:00 GMT+0700 (Indochina Time)"),
                total_amount : "2.00"
            },
            {
                id : 3,
                user_id : 1,
                order_date :new Date("Thu May 25 2023 15:15:00 GMT+0700 (Indochina Time)"),
                total_amount : "3.00"
            },
            {
                id : 4,
                user_id : 1,
                order_date : new Date("Tue May 23 2023 15:15:00 GMT+0700 (Indochina Time)"),
                total_amount : "4.00"
            }
        ])
    })
    it('Method update orders success ',async () => {
        const productResult = await orders.updateById(orderUpdate)
        expect(productResult).toEqual({
            id: 4,
            user_id : 1,
            order_date : new Date("Wed May 24 2023 15:15:00 GMT+0700 (Indochina Time)"),
            total_amount : "6.00"
        })
    })
    it('Method delete orders success ',async () => {
        const productResult = await orders.deleteById(4)
        expect(productResult).toEqual({
            id: 4,
            user_id : 1,
            order_date : new Date("Wed May 24 2023 15:15:00 GMT+0700 (Indochina Time)"),
            total_amount : "6.00"
        })
    })

})

describe('Handler orders :',() => {
    beforeAll(async () => {
        await resetIdDB();
        await createRecord(arrOrders);
        token = `beare ${await getToken('binhnnt')}`;
      });
    it('Create orders success - status 200 ',async () => {
        const response = await request.post(`/orders/`).set(`Authorization`, token).send(orderCreate)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id: 4,
            user_id : 1,
            order_date : '2023-05-23T08:15:00.000Z',
            total_amount : "4.00"
        })
    });
    it('Create orders faile - status 400 ',async () => {
        const response = await request.post(`/orders/`).set(`Authorization`, token).send({user_id : 0,
            order_date : "2023-05-23T08:15:00.000Z",
            total_amount : 4})
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual('Could not create order')
    });

    it('Get all orders success - status 200 ',async () => {
        const response = await request.get(`/orders/`).set(`Authorization`, token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([
            {
                id : 1,
                user_id : 1,
                order_date : '2023-05-23T08:15:00.000Z',
                total_amount : "1.00"
            },
            {
                id : 2,
                user_id : 1,
                order_date : '2023-05-24T08:15:00.000Z',
                total_amount : "2.00"
            },
            {
                id : 3,
                user_id : 1,
                order_date :'2023-05-25T08:15:00.000Z',
                total_amount : "3.00"
            },
            {
                id : 4,
                user_id : 1,
                order_date : '2023-05-23T08:15:00.000Z',
                total_amount : "4.00"
            }
        ])
    });
    it('Get all orders faile - status 400 ',async () => {
        const response = await request.post(`/orders/`).set(`Authorization`, token).send({})
        expect(response.statusCode).toBe(400)
    });
    it('Get orders by id success - status 200 ',async () => {
        const response = await request.get(`/orders/4`).set(`Authorization`, token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id : 4,
            user_id : 1,
            order_date : '2023-05-23T08:15:00.000Z',
            total_amount : "4.00"
        })
    });
    it('Get orders by id faile - status 400 ',async () => {
        const response = await request.get(`/orders/0`).set(`Authorization`, token)
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual('Could not get order')
    });
    it('Update orders by id success - status 200 ',async () => {
        const response = await request.put(`/orders/4`).set(`Authorization`, token).send(orderUpdate)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id: 4,
            user_id : 1,
            order_date : '2023-05-24T08:15:00.000Z',
            total_amount : "6.00"
        })
    });
    it('Update orders by id faile - status 400 ',async () => {
        const response = await request.put(`/orders/0`).set(`Authorization`, token).send(orderUpdate)
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual('Could not update order')
    });
    it('Delete orders by id success - status 200 ',async () => {
        const response = await request.delete(`/orders/4`).set(`Authorization`, token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id: 4,
            user_id : 1,
            order_date : '2023-05-24T08:15:00.000Z',
            total_amount : "6.00"
        })
    });
    it('Delete orders by id faile - status 400 ',async () => {
        const response = await request.delete(`/orders/0`).set(`Authorization`, token)
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual('Could not delete order')
    });
});

