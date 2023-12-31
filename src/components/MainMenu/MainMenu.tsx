import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cart from '../Cart/Cart';


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
    showCart?: boolean;
}

interface MainMenuState {
    items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties>{

    state: MainMenuState;

    constructor(props: MainMenuProperties | Readonly<MainMenuProperties>) {
        super(props);
        this.state = {
            items: props.items,
        };
    }

    public setItems(items: MainMenuItem[]) {
        this.setState({
            items: items,
        });
    }


    render() {
        return (
            <Nav variant='tabs'>
                {this.state.items.map(this.makeNewLink)}
                {this.props.showCart ? <Cart /> : ''}
            </Nav>
        );
    }

    private makeNewLink(item: MainMenuItem, index: number) {
        return (
            <Link key={index} to={item.link} className='nav-link' >
                {item.text}
            </Link>
        );
    }

}