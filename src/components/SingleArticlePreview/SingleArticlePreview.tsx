import { render } from "@testing-library/react";
import { Col, Card, Form, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Apiconfig } from "../../config/apiConfig";
import { useState } from "react";
import api, {ApiRepsonse} from '../../api/api'


interface SingleArticlePreviewState {
    quantity: number;
}


function SingleArticlePreview(props: { art: any; }) {
    const { art } = props; 

    const initialQuantity: SingleArticlePreviewState = {
        quantity: 1,
    }
    const [quantitys, setQuantity] = useState<SingleArticlePreviewState>(initialQuantity);

    const quantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity({
            quantity: newQuantity
        });
      };


      // method for Add Article To Cart
      const addToCart = () => {
        const data = {
            article_id: art.articleId,
            quantity: quantitys.quantity
        };
        api('/api/user/cart/addToCart', 'post', data)
        .then((res :ApiRepsonse) =>{
            if(res.status === 'error' || res.status === 'login'){
                alert('Your session has timed out please logIn again');
                return;
            }
            // we use cart.update event from Cart Component
            const event = new CustomEvent('cart.update');
            window.dispatchEvent(event);
        });
    };


      
    return (
        <Col lg="4" md="6" sm="6" xs="12" key={art.articleId}>
            <Card className="mb-3">
                <Card.Header>
                    <img alt={art.name}
                        src={`${Apiconfig.PHOTO_PATH}/small/${art.imageUrl}`}
                        className="w-100"
                    />
                </Card.Header>
                <Card.Body>
                    <Card.Title as="p">
                        <strong>{art.name}</strong>
                    </Card.Title>
                    <Card.Text>
                        {art.excerpt}
                    </Card.Text>
                    <Card.Text>
                        Price: {art.price?.toFixed(2)} EUR
                    </Card.Text>
                    <Form.Group>
                        <Row>
                            <Col xs="8">
                                <Form.Control type="number" min="1" step="1" value={quantitys.quantity}
                                    onChange={(e) => quantityChange(e as any)} />
                            </Col>
                            <Col xs="4">
                                <Button variant="secondary" className="block mb-2"
                                  onClick={() => addToCart()} 
                                  >Buy</Button>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Link to={`/article/${art.articleId}`}
                        className="btn btn-primary btn-block btn-sm">
                        Open article Page
                    </Link>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default SingleArticlePreview;