import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Apiconfig } from "../../config/apiConfig";
import AddToCartInput from "../AddToCartInput/AddToCartInput";


function SingleArticlePreview(props: { art: any; }) {
    const { art } = props; 
    

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
                     <AddToCartInput  art={art} />
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