import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiRepsonse, saveToken, saveRefreshToken } from '../../api/api'
import { useNavigate  } from "react-router-dom";
import { Navigate  } from "react-router-dom";

interface UserLoginPageState{
    email:string;
    password:string;
    errorMessage:string;
    isLoggedIn:boolean;
}

export default class UserLoginPage extends React.Component {
    state:UserLoginPageState;

    constructor(props: {} | Readonly<{}>){
        super(props);

        this.state={
            email:'',
            password: '',
            errorMessage:'',
            isLoggedIn: false,
        }
    }

    private formInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const newState = Object.assign(this.state, {
            [event.target.id]: event.target.value
        });

        this.setState(newState);
    }

    private setErrorMessage(message:string){
        const newState = Object.assign(this.state, {
            errorMessage: message,
        })
        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean){
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        })
        this.setState(newState);
    
    }

    private doLogin(){
        api('/auth/user/login',
            'post', {
            email:this.state.email,
            password: this.state.password,
        })
        .then((res: ApiRepsonse) =>{
            if(res.status === 'error'){
                this.setErrorMessage("E-mail or Password his wrong");
                return;
            }
            if(res.status === 'ok'){
                if(res.data.statusCode !== undefined){
                    let message = '';
                    switch(res.data.statusCode){
                        case -3001: message = 'Bad e-mail or Password!'; break;
                        case -3002: message = 'Bad Password or e-mail!'; break;
                    }
                    this.setErrorMessage(message);
                    return;
                }
                saveToken(res.data.token);
                saveRefreshToken(res.data.refreshToken)

                this.setLogginState(true);

            }
        })
    }

    render() {
        if(this.state.isLoggedIn === true){
            return(
                <Navigate to="/" />
            )
        }
        return (
        <Container>
            <Col md={{span:6 ,  offset:3 }}>
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
                                         required/>
                        </Form.Group>
                        <Form.Group>
                           <Form.Label htmlFor="password">password</Form.Label>
                           <Form.Control type="password" id="password" 
                                         value={this.state.password} 
                                         onChange={event => this.formInputChange(event)}
                                          autoComplete="current-password" 
                                          required/>
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
            </Col>
        </Container>
        );
    }

}