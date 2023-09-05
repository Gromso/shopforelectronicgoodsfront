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

interface MainMenuState{
    items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties>{

    state: MainMenuState;

    constructor(props: Readonly<MainMenuProperties>){
        super(props);
        this.state = {
            items: props.items,
        };
    }

    setItems(items: MainMenuItem[]){
        this.setState({
            items: items,
        });
    }


   private renderMenuItems() {
        return this.state.items.map((item, index) => (
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