import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Card, Col, Alert, Nav, Navbar } from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import api, { ApiRepsonse } from '../../api/api'
import { Navigate } from "react-router-dom";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";
import { Link } from "react-router-dom";


interface AdminLoginPageState {
    errorMessage: string;
    isUser: boolean;
    isLoggedIn: boolean;
}

export default class AdministratorPage extends React.Component {



    state: AdminLoginPageState;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            errorMessage: '',
            isUser: false,
            isLoggedIn: false,

        }
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message,
        })
        this.setState(newState);
    }
    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        })
        this.setState(newState);
    }

    private adminPage() {
        api('/admin/all', 'get', {})
            .then((res: ApiRepsonse) => {
                if (res.status === 'error') {
                    this.setErrorMessage("Somting is wrong");
                    return;
                }
                if (res.status === 'login') {
                    this.setLogginState(true);
                    return;
                }
            })
    }

    componentDidMount(): void {
        this.adminPage();
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Navigate to="/user/login" />
            )
        }
        return (
            <Container>
                <RoleMainMenu role="admin" />
                <Card>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faHome} /> Administrator Dashboard
                                { }
                            </Card.Title>
                            <Navbar  bg="primary" data-bs-theme="dark">
                                <Container>
                                    <Nav className="me-auto">
                                        <Nav.Link href="/#/admin/dashboard/category">Categories</Nav.Link>
                                        <Nav.Link href="/#/admin/dashboard/articles">Articles</Nav.Link>
                                        <Nav.Link href="/#/admin/dashboard/orders">Orders</Nav.Link>
                                    </Nav>
                                </Container>
                            </Navbar>
                        </Card.Body>
                    </Col>
                </Card>
            </Container >
        );
    }

}