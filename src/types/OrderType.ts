import CartType from "./CartType";

export default interface OrderType{
    order_id: number;
    created_at_order: string;
    cart:{
        cart_id: number,
        created_at_cart:string,
    };
    status:string;
}