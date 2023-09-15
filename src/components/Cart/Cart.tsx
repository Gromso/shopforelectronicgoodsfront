import React from "react";
import CartType from "../../types/CartType";
import api, { ApiRepsonse } from '../../api/api';
import { Alert, Button, Modal, Nav, Table, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faMinusSquare } from "@fortawesome/free-solid-svg-icons";

interface CartState {
    count: number;
    cart?: CartType;
    visible: boolean;
    message:string,
    cartMenuColor:string,
}


export default class Cart extends React.Component {
    state: CartState;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            count: 0,
            visible: false,
            message:'',
            cartMenuColor:'#000000'
        };
    }

    private setStateCount(newCount: number) {
        this.setState(Object.assign(this.state, { count: newCount }))
    }

    private setStateCart(newCart?: CartType) {
        this.setState(Object.assign(this.state, { cart: newCart }))
    }

    private setStateVisible(newState: boolean) {
        this.setState(Object.assign(this.state, { visible: newState }));
    }

    private setStateMessage(newMessage: string){
        this.setState(Object.assign(this.state, {message : newMessage}));
    }
    private setStateMenuColor(newColor: string){
        this.setState(Object.assign(this.state, { cartMenuColor: newColor}));
    }


    private updateCart() {
        api('/api/user/cart', 'get', {})
            .then((res: ApiRepsonse) => {
                if (res.status === 'error') {
                    alert("Cart error");
                    this.setStateCount(0);
                    this.setStateCart(undefined);
                    return;
                }
                this.setStateCart(res.date);
                this.setStateCount(res.date.cartArticles.length);

                this.setStateMenuColor('#ff0000');
                setTimeout(() => this.setStateMenuColor("#000000"),2000);
            });
    }
    private calculateSum(): number {
        let sum:number = 0;
        if(this.state.cart === undefined){
            return sum;
        }else if(this.state.cart && this.state.cart.cartArticles){

        for(const item of this.state.cart?.cartArticles){
            sum += item.articles.articlePrices[item.articles.articlePrices.length -1].price * item.quantity;
        }
    }
        return sum;
    }
   

    componentDidMount(): void {
        this.updateCart();
        window.addEventListener("cart.update", () => this.updateCart());
    }

    componentWillUnmount(): void {
        window.removeEventListener("cart.update", () => this.updateCart());

    }
   

    private updateQuantity(event : React.ChangeEvent<HTMLInputElement>){
        const articleId = event.target.dataset.articleId;
        const newQuantity = event.target.value;

        const data = {
            article_id: Number(articleId),
            quantity: Number(newQuantity),
        }
        
        api('/api/user/cart/update', 'put', data)
        .then((res: ApiRepsonse) =>{
            if(res.status === 'error'){
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }
            this.setStateCart(res.date);
            this.setStateCount(res.date.cartArticles.quantity);
        });
    }

    private removeFromCart(articleId: number){
        const data = {
            article_id: Number(articleId),
            quantity: Number(0),
        }
        api('/api/user/cart/delete', 'delete', data)
        .then((res: ApiRepsonse) =>{
            if(res.status === 'error'){
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }
                this.setStateCart(res.date);
                this.setStateCount(res.date.cartArticles.quantity)
                if(res.date.cartArticles.length === 0){
                this.setStateVisible(false);
                }
                
            });
    }

    private makeOrder(){
        api('/api/user/cart/makeOrder', 'post', {})
        .then((res: ApiRepsonse) =>{
            if(res.status === 'error'){
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }
            this.setStateMessage("You have successfully completed your order");
            this.setStateCount(0);
            this.setStateCart(undefined);
        });
    }
    private hideCart(){
        this.setStateMessage('')
        this.setStateVisible(false);

    }

    render(): React.ReactNode {
        const sum = this.calculateSum().toFixed(2);     
        return (
            <>
                <Nav.Item>
                    <Nav.Link active={false} onClick={() => this.setStateVisible(true)}
                              style={{color: this.state.cartMenuColor}}>
                        <FontAwesomeIcon icon={faCartArrowDown} /> {(this.state.count)}
                    </Nav.Link>
                </Nav.Item>
                <Modal size="lg" centered show={this.state.visible} onHide={() => this.setStateVisible(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Your shopping cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Article</th>
                                    <th className="text-right">Quontity</th>
                                    <th className="text-right">price</th>
                                    <th className="text-right">Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                                
                                {this.state.cart?.cartArticles && this.state.cart.cartArticles.map(item => {
                                  
                                    if (!item || !item.articles) {
                                        alert('item or items is null or undefined please define item')
                                        return null;
                                    }
                                    if (item === undefined || item === null) {
                                        alert('item or items is null or undefined please define item')
                                        return null;
                                    }
                                    return (
                                        <tr key={item.article_id}>
                                            <td>{item.articles.category.name}</td>
                                            <td>{item.articles.name}</td>
                                            <td className="text-right">
                                                <Form.Control type="number"
                                                step="1"
                                                min="1"
                                                value={item.quantity}
                                                data-article-id={item.articles.article_id}
                                                onChange={(e) => this.updateQuantity(e as any)}

                                                 />
                                                </td>
                                            <td className="text-right">{Number(item.articles.articlePrices[item.articles.articlePrices.length - 1].price).toFixed(2)} EUR</td>
                                            <td className="text-right">{Number(item.articles.articlePrices[item.articles.articlePrices.length - 1].price * item.quantity).toFixed(2)} EUR</td>
                                            <td>
                                                <FontAwesomeIcon icon={faMinusSquare}
                                                 onClick={() => this.removeFromCart(item.articles.article_id)}  className="fs-2"/>
                                                
                                            </td>
                                        </tr>
                                    );
                                }, this)}


                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Total: </td>
                                    <td>{ sum }</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </Table>

                        <Alert variant="success" className={this.state.message ? '' : 'd-none'} >{this.state.message}</Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" 
                                onClick={() => this.makeOrder()}
                                disabled={this.state.cart?.cartArticles.length===0}>
                            Make an order
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }



}