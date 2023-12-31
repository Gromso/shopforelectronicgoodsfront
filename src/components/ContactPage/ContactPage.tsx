import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Card } from 'react-bootstrap';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";


export default class ContactPage extends React.Component {

    render() {
        return (
            <Container>
                <RoleMainMenu role='user'/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faPhone} /> Contact details
                        </Card.Title>
                        <Card.Text>
                            Contac Details will be show here...
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

}