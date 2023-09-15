import React from "react";
import { MainMenu, MainMenuItem } from "../MainMenu/MainMenu";


interface RoleMainMenuProperties {
    role: 'user' | 'admin' | 'visiter';
}


export default class RoleMainMenu extends React.Component<RoleMainMenuProperties>{

    render(): React.ReactNode {

        let items: MainMenuItem[] = [];

        switch (this.props.role) {
            case 'visiter': items = this.getVisiterMenuItems(); break;
            case 'user': items = this.getUserMenuItems(); break;
            case 'admin': items = this.getAdminMenuItems(); break;
        }

        let showCart = false;

        if(this.props.role === 'user'){
            showCart = true;
        }
        return <MainMenu items={items} showCart = { showCart } />
    }

    getUserMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Home", "/"),
            new MainMenuItem("Contact", "/contact/"),
            new MainMenuItem("Orders" , "/user/order"),
            new MainMenuItem("Log out", "/user/logout/") 
        ];
    }

    getAdminMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Admin Page", "/admin/dashboard"),
            new MainMenuItem("Log out", "/user/logout/"),
        ];
    }

    getVisiterMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Log in", "/user/login/"),
            new MainMenuItem("Register", "/user/register"),
        ];
    }

}