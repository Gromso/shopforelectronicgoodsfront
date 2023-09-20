import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form, Modal, Tab, Table, Tabs } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import ApiOrderDTO from "../../dtos/ApiOrderDTO";
import api, { ApiRepsonse } from "../../api/api";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faEdit, faImages, faListAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import CartType from "../../types/CartType";



function AdministratorPageOrder() {

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
    const [Orders, setOrders] = useState<ApiOrderDTO[]>([]);
    const [orderVisible, setOrderVisible] = useState(false);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = () => {
        api('/api/order/admin/orders', 'get', {})
            .then((res: ApiRepsonse) => {
                if (res.status === 'error') {
                    setLoginState(false);
                    return;
                }
                if (res.status === 'login') {
                    return;
                }
                if (res.date === undefined) {
                    return;
                }
                const orders: ApiOrderDTO[] = res.date;
                setOrders(orders);
            })
    }

    const setLoginState = (isLoggedIn: boolean) => {
        setIsUserLoggedIn(isLoggedIn);
    };

    const SetOrderVisible = (order: boolean) => {
        setOrderVisible(order);
    }

    const setAndShowOrder = (cart: CartType) => {
        SetOrderVisible(true);
    }


    const changeStatus = (orderId: number, newStatus:"pending" | "rejected" | "accepted" | "shipped") =>{
        api('/api/order/editOrder/' + orderId, 'put', {status: newStatus})
        .then((res: ApiRepsonse) => {
            if (res.status === 'error') {
                setLoginState(false);
                return;
            }
            if (res.status === 'login') {
                return;
            }
            if (res.date === undefined) {
                return;
            }
            getOrders();
        });
    }

    const printStatusChangeButtons = (order: ApiOrderDTO) =>{
        if(order.status === "pending"){
            return (
                <>
                <Button size="sm" type="button" variant="primary"
                        onClick={() =>changeStatus(order.order_id, "accepted")}>Accept</Button>
                <Button size="sm" type="button" variant="danger"
                onClick={() =>changeStatus(order.order_id, "rejected")}>Reject</Button>

                </>
            )
        }
        if(order.status === "accepted"){
            return (
                <>
                <Button size="sm" type="button" variant="primary"
                onClick={() =>changeStatus(order.order_id, "shipped")}>Ship</Button>
                <Button size="sm" type="button" variant="secondary"
                onClick={() =>changeStatus(order.order_id, "pending")}>Pending</Button>

                </>
            )
        }
        if(order.status === "shipped"){
            return (
                <>
                </>
            )
        }
        if(order.status === "rejected"){
            return (
                <>
                <Button size="sm" type="button" variant="secondary"
                onClick={() =>changeStatus(order.order_id, "pending")}>Pending</Button>
                </>
            )
        }
    }

    const renderStatus = (withStatus: "pending" | "rejected" | "accepted" | "shipped") => {
        return (
            <Table bordered hover className="text-center" size="sm">
                <thead>
                    <tr>
                        <th className="text-right">ID</th>
                        <th>Date</th>
                        <th>Cart</th>
                        <th>Options</th>
                    </tr>
                </thead>

                <tbody>
                    {Orders.filter(order => order.status === withStatus).map(ord => (
                        <tr key={ord.order_id}>
                            <td className="text-right">{ord.order_id}</td>
                            <td> {ord.created_at_order?.substring(0, 10)}</td>
                            <td>
                                <Button size="sm" variant="primary"
                                    onClick={() => setAndShowOrder(ord.cart)}>
                                    <FontAwesomeIcon icon={faBoxOpen} /> Option
                                </Button>
                            </td>
                            <td>
                                {printStatusChangeButtons(ord)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )

    }

    return (
        <Container>
            {isUserLoggedIn ? (
                <>
                    <RoleMainMenu role="admin" />
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faListAlt} /> Orders
                            </Card.Title>

                            <Tabs defaultActiveKey="pending" className="ml-0">
                                <Tab eventKey="pending" title="pending">
                                    {renderStatus('pending')}
                                </Tab>
                                <Tab eventKey="accepted" title="accepted">
                                    {renderStatus('accepted')}
                                </Tab>
                                <Tab eventKey="shipped" title="shipped">
                                    {renderStatus('shipped')}
                                </Tab>
                                <Tab eventKey="rejected" title="rejected">
                                    {renderStatus('rejected')}
                                </Tab>

                            </Tabs>
                        </Card.Body>

                    </Card>

                    <Modal size="lg" centered show={orderVisible}
                        onHide={() => SetOrderVisible(false)} >
                        <Modal.Header>
                            <Modal.Title>Order content</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Table hover size="sm">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tbody>
                                <tfoot>
                                    <tr>

                                    </tr>
                                </tfoot>

                            </Table>

                        </Modal.Body>
                    </Modal>
                </>

            ) : (
                <Navigate to="/user/login" />
            )}

        </Container>
    )
}

export default AdministratorPageOrder;

