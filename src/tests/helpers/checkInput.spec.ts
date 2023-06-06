import { checkUser,checkOrder,checkOrderItems,checkProduct } from "../../utiliti/checkInput";
import { Order } from "../../models/orders";
import { Product } from "../../models/product";
import { User } from "../../models/user";
import { Order_item } from "../../models/order_items";

const user : User[] = [
    {
        username : 'user1',
        password : '123456',
        email : 'nguyngocthanhbinh97@gmail.com',
        phone : '0905876273'
    },
    {
        username : '',
        password : '123456',
        email : 'nguyngocthanhbinh97@gmail.com',
        phone : '0905876273'
    },
]

const order : Order[] = [
    {
        user_id :1,
        order_date : "2023-05-23 15:15:00",
        total_amount : 0
    },
    {
        user_id :2,
        order_date : "",
        total_amount : 0
    }
]

const product : Product[] = [
    {
        name : "IPHONE 20",
        description : "IPHONE FAKE GIA SIU RE",
        price : 100,
        link_image : "Link anh se bo sung sau khi ban"
    },
    {
        name : "IPHONE 20",
        description : "IPHONE FAKE GIA SIU RE",
        price : 0,
        link_image : "Link anh se bo sung sau khi ban"
    },
    
]

const order_item : Order_item[] = [
    {
        order_id : 1,
        product_id : 2,
        quantity : 10
    },
    {
        order_id : 0,
        product_id : 0,
        quantity : 10
    }
]
describe('Check Input', () => {
    it('Check User success ',() => {
        return expect(checkUser(user[0])).toBeTrue
    })
    it('Check User flase',() => {
        return expect(checkUser(user[1])).toBeFalse
    })
    it('Check Order success',() => {
        return expect(checkOrder(order[0])).toBeTrue
    })
    it('Check Order flase',() => {
        return expect(checkOrder(order[1])).toBeFalse
    })
    it('Check Product success',() => {
        return expect(checkProduct(product[0])).toBeTrue
    })
    it('Check Product flase',() => {
        return expect(checkProduct(product[1])).toBeFalse
    })
    it('Check OrderItem success',() => {
        return expect(checkOrderItems(order_item[0])).toBeTrue
    })
    it('Check OrderItem flase',() => {
        return expect(checkOrderItems(order_item[1])).toBeFalse
    })
})

