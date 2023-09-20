import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiRepsonse, saveToken, saveRefreshToken } from '../../api/api'
import { Navigate } from "react-router-dom";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";

interface UserLoginPageState {
    email: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
    isUser: boolean;
    isAdmin: boolean;
}

export default class UserLoginPage extends React.Component {
    state: UserLoginPageState;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false,
            isUser: false,
            isAdmin:false,
        }
    }

    private formInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newState = Object.assign(this.state, {
            [event.target.id]: event.target.value
        });

        this.setState(newState);
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
    private setUserState(isUserr: boolean) {
        this.setState(Object.assign(this.state, {
            isUser: isUserr,
        }));
    }
    private setAdminState(isAdmin: boolean) {
        this.setState(Object.assign(this.state, {
            isAdmin: isAdmin,
        }));
    }

    private doLogin() {
        api('/auth/user/login', 'post', {
            email: this.state.email,
            password: this.state.password,
        })
            .then((res: ApiRepsonse) => {
                if (res.status === 'error') {
                    this.setErrorMessage("E-mail or Password his wrong");
                    this.setLogginState(true)
                    return;
                }
                if (res.status === 'ok') {

                    if (res.date.statusCode !== undefined) {
                        let message = '';
                        switch (res.date.statusCode) {
                            case -3001: message = 'Bad e-mail or Password!'; break;
                            case -3002: message = 'Bad Password or e-mail!'; break;
                        }
                        this.setErrorMessage(message);
                        return;

                    }
                    
                    if (res.date.user.authorities[0].authority === "USER") {
                        this.setUserState(true);
                    }
                    if (res.date.user.authorities[0].authority === "ADMIN") {
                        this.setAdminState(true);
                    }
                    saveToken(res.date.token);
                    saveRefreshToken(res.date.refreshToken)
                    
                    

                }
            })
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Navigate to="/" />
            )
        }
        if (this.state.isAdmin === true) {
            return (
                <Navigate to="/admin/dashboard/" />
            )
        }
        if (this.state.isUser === true) {
            return (
                <Navigate to="/" />
            )
        }
        return (
            <Container>
                <RoleMainMenu role="visiter"/>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faSignInAlt} /> User Login
                            </Card.Title>

                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="email">E-mail</Form.Label>
                                    <Form.Control type="email" id="email"
                                        value={this.state.email}
                                        onChange={event => this.formInputChange(event)}
                                        autoComplete="username"
                                        required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">password</Form.Label>
                                    <Form.Control type="password" id="password"
                                        value={this.state.password}
                                        onChange={event => this.formInputChange(event)}
                                        autoComplete="current-password"
                                        required />
                                </Form.Group>
                                <Form.Group>
                                    <Button className="mt-2" variant="primary"
                                        onClick={() => this.doLogin()}>Log in</Button>
                                </Form.Group>
                            </Form>
                            <Alert variant="danger"
                                className={this.state.errorMessage ? '' : 'd-none'}>
                                {this.state.errorMessage}
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container >
        );
    }

}