import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {Container, Card } from 'react-bootstrap';
import { faPhone } from '@fortawesome/free-solid-svg-icons';


export default class ContactPage extends React.Component {

    render() {
        return (<Container>
            <Card.Body>
                <Card.Title>
                    <FontAwesomeIcon icon={faPhone} /> Contact details
                </Card.Title>
                <Card.Text>
                    Contac Details will be show here...
                </Card.Text>
            </Card.Body>
        </Container>
        );
    }

}