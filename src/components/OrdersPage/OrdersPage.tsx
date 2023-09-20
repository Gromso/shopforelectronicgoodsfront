import React from "react"
import { Navigate } from "react-router-dom";
import OrderType from "../../types/OrderType";
import api, { ApiRepsonse } from "../../api/api";
import { Card, Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";

interface OrdersPageState {
    isUserLoggin: boolean,
    orders: OrderType[];
}

interface OrderDTO {
    orderId: number,
    created_at_order: string,
    status: "rejected" | "accepted" | "shipped" | "pending";
    cart: {
        cart_id: number,
        created_at_cart: string,
    };
}

export default class OrdersPage extends React.Component {
    state: OrdersPageState;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggin: false,
            orders: [],
        }
    }


    private setLogginstate(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggin: isLoggedIn,
        }));
    }
    private setOrdersState(orderss: OrderType[]) {
        this.setState(Object.assign(this.state, {
            orders: orderss,
        }));
    }


    componentDidMount(): void {
        this.getOrders();
    }

   

    private getOrders() {
        api('/api/order/orders', 'get', {})
            .then((res: ApiRepsonse) => {
                const data: OrderDTO[] = res.date;
                if(res.status === 'login'){
                    this.setLogginstate(true);
                    return;
                }
                if(data === null){
                    return;
                }
                const orders: OrderType[] = data.map(or => ({
                    order_id: or.orderId,
                    status: or.status,
                    created_at_order: or.created_at_order,
                    cart: {
                        cart_id: or.cart.cart_id,
                        created_at_cart: or.cart.created_at_cart,
                    }
                }));
                this.setOrdersState(orders);
            });            
    }
    

    render(): React.ReactNode {
        if (this.state.isUserLoggin === true) {
            return (
                <Navigate to="/user/login" />
            )
        }
        return (
            <Container>
                <RoleMainMenu role="user"/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faBox} /> My Orders
                        </Card.Title>
                        <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Created AT</th>
                                    <th>status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.orders.map(this.printOrderRow) }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private printOrderRow(order: OrderType){
        return (
            <tr>
                <td>{order.created_at_order}</td>
                <td>{order.status}</td>
                <td>
                    ...
                </td>
            </tr>
        )
    }

}