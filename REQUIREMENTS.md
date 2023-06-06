## API Endpoints
#### Products
- GetAllProduct [token required] : `'/products' [GET]`
- AddNewProduct (args: name,description,price,link_image) [token required] : `'/products' [POST]`
- GetProductById (args: productid) [token required] : `'/products/:id' [GET]`
- GetAllProduct () [token required] : `'/products/:id' [PUT]`
- DeleteProduct (args: productid) [token required] : `'/products/:id' [DELETE]`

#### Users

- GetAllUser [token required] : `'/users' [GET]`
- AddNewUser (args: username, password,email,phone) : `'/users' [POST]`
- GetUserById (args: userid) [token required] : `'/users/:id' [GET]`
- UpdateUser (args: userid, username, password,email,phone) [token required] : `'/users/:id' [PUT]`
- DeleteUser (args: userid) [token required] : `'/users/:id' [DELETE]`
- Login (args: username, password) [token required] : `'/login' [POST]`
- Authenticate (args: username, password) [token required] : `'/authenticate' [POST]`


#### Orders
- AddNewOrder (args: user_id,order_date,total_amount) [token required] : `'/orders' [POST]`
- UpdateOrder (args: order_id,user_id,order_date,total_amount) [token required] : `'/orders/:id' [POST]`
- GetAllOrder () [token required] : `'/users' [GET]`
- RemoveOrder (args: userid, productid) [token required] : `'/orders/:id' [DELETE]`


## Data Shapes

### Users

| Column                | Type                |
| --------------------- | ------------------- |
| id                    | SERIAL PRIMARY KEY  |
| password_digest       | varchar             |
| email                 | VARCHAR(255)        |
| phone                 | VARCHAR(100)        |

### Products

| Column       | Type                |
| ------------ | ------------------- |
| id           | SERIAL PRIMARY KEY  |
| name         | VARCHAR(255)        |
| description  | VARCHAR(255)        |
| price        | DECIMAL(10, 2)      |
| link_image   | VARCHAR(255)        |

### Orders

| Column           | Type                |
| ---------------- | ------------------- |
| id               | SERIAL PRIMARY KEY  |
| user_id          | INT                 |
| order_date       | TIMESTAMP           |
| total_amount     | DECIMAL(10, 2)      |

### Order_items

| Column        | Type                |
| ------------- | ------------------- |
| id            | SERIAL PRIMARY KEY  |
| order_id      | INT                 |
| product_id    | INT                 |
| quantity      | INT                 |
