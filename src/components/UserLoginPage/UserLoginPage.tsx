import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {Container, Card } from 'react-bootstrap';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';


export class UserLoginPage extends React.Component {
    render() {
        return (<Container>
            <Card.Body>
                <Card.Title>
                    <FontAwesomeIcon icon={faSignInAlt} /> User Login
                </Card.Title>
                <Card.Text>
                    ... the form will be shown here ...
                </Card.Text>
            </Card.Body>
        </Container>
        );
    }

}