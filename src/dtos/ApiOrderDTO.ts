import CartType from "../types/CartType";

export default interface ApiOrderDTO{
    order_id: number;
    created_at_order?: string;
    status: "rejected" | "accepted" | "shipped" | "pending";
    cart: CartType;
}