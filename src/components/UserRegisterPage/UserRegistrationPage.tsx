import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, { ApiRepsonse } from "../../api/api";


interface UserRegistrationPageState {
    formData: {
        email: string;
        password: string;
        forename: string;
        surname: string;
        phone: string;
        address: string;
    };
    message: string;
    isRegistrationComplete: boolean;
}




export class UserRegistrationPage extends React.Component {
    state: UserRegistrationPageState;

    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            formData: {
                email: '',
                password: '',
                forename: '',
                surname: '',
                phone: '',
                address: ''
            },
            message: '',
            isRegistrationComplete: false
        };
    }



    private formInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newFormData = Object.assign(this.state.formData, {
            [event.target.id]: event.target.value
        });

        const newState = Object.assign(this.state, {
            formData: newFormData,
        });
        this.setState(newState);
    }



    render() {
        return (
            <Container>
                <Col md={{ span: 8, offset: 2 }}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faUserPlus} />User Registration
                            </Card.Title>
                            {this.state.isRegistrationComplete ? (
                                this.renderRegistrationCompleteMessage()
                            ) : (
                                this.renderForm()
                            )}

                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        );
    }



    private renderForm() {
        return (
            <>
                <Form>
                    <Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="email">E-mail</Form.Label>
                                <Form.Control type="email" id="email"
                                    value={this.state.formData.email}
                                    onChange={event => this.formInputChange(event)}
                                    autoComplete="username"
                                    required />
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="password">password</Form.Label>
                                <Form.Control type="password" id="password"
                                    value={this.state.formData.password}
                                    onChange={event => this.formInputChange(event)}
                                    autoComplete="current-password"
                                    required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="forename">forename</Form.Label>
                                <Form.Control type="text" id="forename"
                                    value={this.state.formData.forename}
                                    onChange={event => this.formInputChange(event)}
                                    autoComplete="forename"
                                    required />
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="surname">surname</Form.Label>
                                <Form.Control type="text" id="surname"
                                    value={this.state.formData.surname}
                                    onChange={event => this.formInputChange(event)}
                                    autoComplete="surname"
                                    required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group>
                        <Form.Label htmlFor="phone">phone-number</Form.Label>
                        <Form.Control type="phone" id="phone"
                            value={this.state.formData.phone}
                            onChange={event => this.formInputChange(event)}
                            autoComplete="phone"
                            required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="address">postal-address</Form.Label>
                        <Form.Control id="address"
                            as="textarea" rows={4}
                            value={this.state.formData.address}
                            onChange={event => this.formInputChange(event)}
                            autoComplete="address"
                            required />
                    </Form.Group>
                    <Form.Group>
                        <Button className="mt-2" variant="primary"
                            onClick={() => { this.doRegister() }}>Register</Button>
                    </Form.Group>
                </Form>
                <Alert variant="danger"
                    className={this.state.message ? '' : 'd-none'}>
                    {this.state.message}
                </Alert>
            </>
        );
    }

    private renderRegistrationCompleteMessage() {
        return (
            <p>
                The account has been registered.<br />
                <Link to={"/user/login"}>Click here</Link>
                Click here to go to the login page.
            </p>
        );
    }

    private doRegister() {
        const data = {
            email: this.state.formData.email,
            password: this.state.formData.password,
            forename: this.state.formData.forename,
            surname: this.state.formData.surname,
            phone_number: this.state.formData.phone,
            postal_address: this.state.formData.address
        }
        api('auth/user/register', 'post', data)
            .then((res: ApiRepsonse) => {
                if (res.status === 'error') {
                    this.setErrorMessage("System error... Try agein!")
                    return;
                }
                if (res.data.statusCode !== undefined) {
                    this.handleErrors(res.data);
                    return;
                }
                this.registretionComplete();
            });
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        })
        this.setState(newState);
    }

    private handleErrors(data: any) {
        let message = '';

        switch (data) {
            case -6001: message = 'This account alredy exists'; break;
        }
        this.setErrorMessage(message);
    }

    private registretionComplete() {
        this.setState({ isRegistrationComplete: true });
    }




}