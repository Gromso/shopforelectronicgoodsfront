import React from 'react';
import { Nav, Container } from 'react-bootstrap';
import { resolveTypeReferenceDirective } from 'typescript';


export class MainMenuItem {
    text: string = '';
    link: string = '#';

    constructor(text: string, link: string) {
        this.text = text;
        this.link = link;
    }

}

interface MainMenuProperties {
    items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties>{

   private renderMenuItems() {
        return this.props.items.map((item, index) => (
          <Nav.Link key={index} href={item.link}>
            {item.text}
          </Nav.Link>
        ));
      }


    render() {
        return (
            <Container>
                <Nav variant='tabs'>
                    {this.renderMenuItems()}
                </Nav>
            </Container>
        );
    }

}