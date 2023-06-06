import client from "../../database"
import { getHashPassword } from "../../helpers/getHashPassword";
import { getToken } from "../../helpers/jwt";
import { Users,User } from "../../models/user";
import supertest from "supertest";

const arrUsers : User[] = [
    {
        username : 'user1',
        password : '123456',
        email : 'nguyngocthanhbinh97@gmail.com',
        phone : '0905876273'
    },
    {
        username : 'user2',
        password : '123456',
        email : 'nguyngocthanhbinh97@gmail.com',
        phone : '0905876273'
    },
]

const userCreate : User = {
    username : 'user3',
    password : '123456',
    email : 'nguyngocthanhbinh97@gmail.com',
    phone : '0905876273'
}

const userUpdate : User = {
    id : 3,
    username : 'user3_update',
    password : '123456',
    email : 'nguyngocthanhbinh97@gmail.com',
    phone : '0905876273'
}

let token : string;

const endPoint = 'http://localhost:3000'

const request = supertest(endPoint)
const users = new Users()

const resetIdDB = async () => {
    try {
        const conn = await client.connect();
        await conn.query('DELETE FROM users');
        await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
        conn.release();
    } catch (error) {
    console.log(error);
    }
}

const createRecord = async (arrUsers:User[]) => {
    const conn = await client.connect();
    const sql = `INSERT INTO users(username, password_digest,email,phone) VALUES($1, $2, $3, $4) RETURNING id,username,email,phone`;
  for (const user of arrUsers) {
    await conn.query(sql, [
      user.username,
      await getHashPassword(user.password),
      user.email,
      user.phone,
    ]);
  }
  conn.release();
}

describe('User model :', () => {
    beforeAll(async () => {
        await resetIdDB();
        await createRecord(arrUsers);
      });

    it('Method create user success ',async () => {
        const userResult = await users.create(userCreate)
        expect(userResult).toEqual({
            id : 3,
            username : 'user3',
            email : 'nguyngocthanhbinh97@gmail.com',
            phone : '0905876273'
        })
    })
    it('Method getById user success ',async () => {
        const userResult = await users.getById(3)
        expect(userResult).toEqual({
            id : 3,
            username : 'user3',
            email : 'nguyngocthanhbinh97@gmail.com',
            phone : '0905876273'
        })
    })
    it('Method getAll user success ',async () => {
        const userResult = await users.getAll()
        expect(userResult).toEqual([
            {
                id: 1,
                username : 'user1',
                email : 'nguyngocthanhbinh97@gmail.com',
                phone : '0905876273'
            },
            {
                id: 2,
                username : 'user2',
                email : 'nguyngocthanhbinh97@gmail.com',
                phone : '0905876273'
            },
            {
                id : 3,
                username : 'user3',
                email : 'nguyngocthanhbinh97@gmail.com',
                phone : '0905876273'
            },
        ])
    })
    it('Method update user success ',async () => {
        const userResult = await users.update(userUpdate)
        expect(userResult).toEqual({
            id : 3,
            username : 'user3_update',
            email : 'nguyngocthanhbinh97@gmail.com',
            phone : '0905876273'
        })
    })
    it('Method delete user success ',async () => {
        const userResult = await users.deleteById(3)
        expect(userResult).toEqual({
            id : 3,
            username : 'user3_update',
            email : 'nguyngocthanhbinh97@gmail.com',
            phone : '0905876273'
        })
    })

})

describe('Handler user :',() => {
    beforeAll(async () => {
        await resetIdDB();
        await createRecord(arrUsers);
        token = `beare ${await getToken('binhnnt')}`;
      });
    it('Create user success - status 200 ',async () => {
        const response = await request.post(`/users/`).set(`Authorization`, token).send(userCreate)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id : 3,
            username : 'user3',
            email : 'nguyngocthanhbinh97@gmail.com',
            phone : '0905876273'
        })
    });
    it('Create user faile - status 400 ',async () => {
        const response = await request.post(`/users/`).set(`Authorization`, token).send({    username : '',
        password : '123456',
        email : 'nguyngocthanhbinh97@gmail.com',
        phone : '0905876273'})
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ err: 'Could not create user'})
    });

    it('Get all user success - status 200 ',async () => {
        const response = await request.get(`/users/`).set(`Authorization`, token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([
            {
                id: 1,
                username : 'user1',
                email : 'nguyngocthanhbinh97@gmail.com',
                phone : '0905876273'
            },
            {
                id: 2,
                username : 'user2',
                email : 'nguyngocthanhbinh97@gmail.com',
                phone : '0905876273'
            },
            {
                id : 3,
                username : 'user3',
                email : 'nguyngocthanhbinh97@gmail.com',
                phone : '0905876273'
            },
        ])
    });
    it('Get all user faile - status 500 ',async () => {
        const response = await request.post(`/users/`).set(`Authorization`, token).send({})
        expect(response.statusCode).toBe(500)
    });
    it('Get user by id success - status 200 ',async () => {
        const response = await request.get(`/users/3`).set(`Authorization`, token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id : 3,
            username : 'user3',
            email : 'nguyngocthanhbinh97@gmail.com',
            phone : '0905876273'
        })
    });
    it('Get user by id faile - status 404 ',async () => {
        const response = await request.get(`/users/0`).set(`Authorization`, token)
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ err: 'Could not get user.' })
    });
    it('Update by id success - status 200 ',async () => {
        const response = await request.put(`/users/3`).set(`Authorization`, token).send(userUpdate)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id : 3,
            username : 'user3_update',
            email : 'nguyngocthanhbinh97@gmail.com',
            phone : '0905876273'
        })
    });
    it('Update by id faile - status 404 ',async () => {
        const response = await request.put(`/users/0`).set(`Authorization`, token).send(userUpdate)
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ err: 'Could not update user.' })
    });
    it('Delete by id success - status 200 ',async () => {
        const response = await request.delete(`/users/3`).set(`Authorization`, token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            id : 3,
            username : 'user3_update',
            email : 'nguyngocthanhbinh97@gmail.com',
            phone : '0905876273'
        })
    });
    it('Delete by id faile - status 404 ',async () => {
        const response = await request.delete(`/users/0`).set(`Authorization`, token)
        expect(response.statusCode).toBe(404)
        expect(response.body).toEqual({ err: 'Could not delete user.' })
    });
});