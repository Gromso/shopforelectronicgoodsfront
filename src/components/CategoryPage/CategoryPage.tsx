import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { faListAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Navigate, useParams } from "react-router-dom";
import api, { ApiRepsonse } from "../../api/api";
import CategoryType from "../../types/CategoryType";
import ArticleType from "../../types/ArticleType";
import SingleArticlePreview from "../SingleArticlePreview/SingleArticlePreview";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";



interface ArticleDTO {
    article_id: number,
    name: string,
    excerpt?: string,
    description?: string,
    photos?: {
        image_path: string
    }[],
    articlePrices?: {
        price: number,
        created_at_price: string,
    }[],


}

interface Filters {
    keyWords: string,
    priceMinimum: number,
    priceMaximum: number,
    order: "name asc" | "name desc" | "price asc" | "price desc",


}


function CategoryPage() {
    const initialFilters: Filters = {
        keyWords: '',
        priceMinimum: 0,
        priceMaximum: 100000,
        order: "price asc"
    }

    const { cId } = useParams<{ cId: string }>();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [message, setMessage] = useState("");
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [category, setCategory] = useState<CategoryType | undefined>();
    const [subCategories, setSubCategories] = useState<CategoryType[]>([]);
    const [articles, setArticles] = useState<ArticleType[]>([]);

    useEffect(() => {
        getCategoryData();
    }, [cId]);

    const setLoginState = (isLoggedIn: boolean) => {
        setIsUserLoggedIn(isLoggedIn);
    };

    const printOptionMessage = () => {
        if (!message) {
            return null;
        }
        return <Card.Text>{message}</Card.Text>;
    };



    const showArticles = () => {
        if (!articles || articles.length === 0) {
            return (
                <div>There are no articles in this Category</div>
            );
        }
        return (
            <Row>
                {articles.map((art) => (
                    <SingleArticlePreview key={art.articleId} art={art} />
                ))}
            </Row>
        );
    };

    const setNewFilter = (newFilter: Partial<Filters>) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilter,
        }));
    };

    const filterKeyWordsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewFilter(Object.assign(filters, {
            keyWords: event.target.value
        }));

    }
    const filterPriceMinChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewFilter(Object.assign(filters, {
            priceMinimum: Number(event.target.value)
        }));
    }
    const filterPriceMaxChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewFilter(Object.assign(filters, {
            priceMaximum: Number(event.target.value)
        }));
    }
    const filterOrderChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewFilter(Object.assign(filters, {
            order: event.target.value,
        }));
    }
    const applyFillters = () => {
        getCategoryData();
    }
    const printFilters = () => {
        return (
            <>
                <Form.Group>
                    <Form.Label htmlFor="keyWords">Search KeyWords: </Form.Label>
                    <Form.Control type="text" id="keyWords"
                        value={filters.keyWords}
                        onChange={(e) => filterKeyWordsChanged(e as any)}
                    />
                </Form.Group>
                <Form.Group>
                    <Row>

                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="priceMin">Min. price</Form.Label>
                            <Form.Control type="number" id="priceMin"
                                step={10} min="0" max="90000"
                                value={filters.priceMinimum}
                                onChange={(e) => filterPriceMinChanged(e as any)} />
                        </Col>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="priceMax">Max. price</Form.Label>
                            <Form.Control type="number" id="priceMax"
                                step={100} min="0" max="100000"
                                value={filters.priceMaximum}
                                onChange={(e) => filterPriceMaxChanged(e as any)} />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Form.Control as="select" id="sortOrder" className="mt-2"
                        value={filters.order}
                        onChange={(e) => filterOrderChanged(e as any)}>
                        <option value="name asc">Sort by name- ascending</option>
                        <option value="name desc">Sort by name- descending</option>
                        <option value="price asc">Sort by price- ascending</option>
                        <option value="price desc">Sort by price- descending</option>

                    </Form.Control>
                </Form.Group>

                <h2>Features</h2>
                <Form.Group>
                    <Button variant="primary" className="mt-2"
                        onClick={() => applyFillters()}>
                        <FontAwesomeIcon icon={faSearch} /> Search
                    </Button>
                </Form.Group>
            </>
        );
    }



    const showSubCategories = () => {
        if (!subCategories || subCategories.length === 0) {
            return (
                <div>There are no SubCategories in this Category</div>
            );
        }
        return (
            <Row>
                {subCategories.map((category) => (
                    <Col md="3" sm="6" xs="12" key={category.categoryId}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title as="p">{category.name}</Card.Title>
                                <Link
                                    to={`/category/${category.categoryId}`}
                                    className="btn btn-primary btn-block btn-sm"
                                >
                                    Open category
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    const orderParts = filters.order.split(" ");
    const orderBy = orderParts[0];
    const orderDirection = orderParts[1];

    const getCategoryData = () => {
        api(`/api/category/${cId}`, "get", {})
            .then((res: ApiRepsonse) => {
                if (res.status === "login") {
                    setLoginState(true);
                    return;
                } else if (res.status === "error") {
                    setMessage("Request error, please try refreshing the page.");
                } else {
                    if (!res.date) {
                        setMessage("No categories found.");
                    } else {
                        const categoryData: CategoryType = {
                            categoryId: res.date.categoryId,
                            
                            name: res.date.name,
                        };         
                        setCategory(categoryData);
                        /*const subCategoriesData: CategoryType[] = res.date.categories.map(
                          (category: CategoryDTO) => ({
                            category_id: category.category_id,
                            name: category.name,
                          })
                        );*/

                        //setSubCategories(subCategoriesData);
                    }
                    
                }

                api('api/article/searchh', 'post', {
                    category_id: cId,
                    keyWords: filters.keyWords,
                    priceMin: filters.priceMinimum,
                    priceMax: filters.priceMaximum,
                    orderBy: orderBy,
                    orderDirection: orderDirection,
                })
                    .then((res: ApiRepsonse) => {
                        if (res.status === "login") {
                            setLoginState(true);
                            return;
                        } else if (res.status === "error") {
                            setMessage("Request error, please try refreshing the page.");
                        }
                        if (Array.isArray(res.date)) {
                            const articles: ArticleType[] =

                                res.date.map((article: ArticleDTO) => {
                                    const object: ArticleType = {
                                        articleId: article.article_id,
                                        name: article.name,
                                        excerpt: article.excerpt,
                                        description: article.description,
                                        imageUrl: '',
                                        price: 0
                                    }
                                    if (article.photos !== undefined && article.photos.length > 0) {
                                        object.imageUrl = article.photos[article.photos.length - 1].image_path

                                    }
                                    if (article.articlePrices !== undefined && article.articlePrices.length > 0) {
                                        object.price = article.articlePrices[article.articlePrices.length - 1].price

                                    }

                                    return object;
                                });

                            setArticles(articles);
                        }
                    });
            });
    };

    if (isUserLoggedIn) {
        return <Navigate to="/user/login" />;
    }

    return (
        <Container>
            <RoleMainMenu role="user"/>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={faListAlt} />
                        {category?.name}
                    </Card.Title>
                    {printOptionMessage()}
                    {showSubCategories()}
                    <Row>
                        <Col xs="12" md="4" lg="3">
                            {printFilters()}
                        </Col>

                        <Col xs="12" md="8" lg="9">
                            {showArticles()}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CategoryPage;