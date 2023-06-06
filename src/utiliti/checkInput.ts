import { User } from "../models/user";
import { Product } from "../models/product";
import { Order } from "../models/orders";
import { Order_item } from "../models/order_items";

export const checkUser =  async ( user : User) : Promise<Boolean> => {
    let check : boolean = true;
    user.username == "" || user.password == "" ? check = false : check = true
    return check 
}

export const checkProduct =  async ( product : Product) : Promise<Boolean> => {
    let check : boolean = true;
    product.name == "" || +product.price <= 0 ? check = false : check = true
    return check 
}

export const checkOrder =  async ( order : Order) : Promise<Boolean> => {
    let check : boolean = true;
    order.user_id <= 0 || order.order_date == "" ? check = false : check = true
    return check 
}

export const checkOrderItems = async (order_item : Order_item) : Promise<Boolean> => {
    let check : boolean = true;
    order_item.order_id <= 0 || order_item.product_id <= 0 ? check = false : check = true
    return check 
}