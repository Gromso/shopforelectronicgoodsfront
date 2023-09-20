import React, { useEffect, useState } from "react"
import { Card, Col, Container, Row } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";
import ApiArticleDTO from "../../dtos/ApiArticleDTO";
import api, { ApiRepsonse } from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive } from "@fortawesome/free-solid-svg-icons";
import { Apiconfig } from "../../config/apiConfig";
import AddToCartInput from "../AddToCartInput/AddToCartInput";


interface FeatureData {
    name: string;
    value: string;
}

function ArticlePage() {
    const { aId } = useParams<{ aId: string }>();
    const [message, setMessage] = useState("");
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
    const [article, setArticle] = useState<ApiArticleDTO>();
    const [features, setFeatures] = useState<FeatureData[]>([]);

    useEffect(() => {
        getArticle()
    }, [aId]);

    const setLoginState = (isLoggedIn: boolean) => {
        setIsUserLoggedIn(isLoggedIn);
    };

    const getArticle = async () => {
        await api(`/api/article/${aId}`, "get", {})
            .then((res: ApiRepsonse) => {
                if (res.status === "error") {
                    setMessage("Request error, please try refreshing the page.");
                    setLoginState(false);
                    return;
                }
                if (res.status === "login") {
                    return;
                }
                const data: ApiArticleDTO = res.date;
                //console.log(data)
                const articleWithId = {
                    ...data, // Kopirajte sve postojeće svojstva iz data objekta
                    articleId: data.article_id // Dodajte article_id kao svojstvo articleId
                };




                const feature: FeatureData[] = [];

                if (Array.isArray(data.articleFeatures)) {
                    for (const articleFeature of data.articleFeatures) {
                        const value = articleFeature.value;
                        let name = '';

                        for (const feature of data.features) {
                            if (feature.feature_id === articleFeature.feature_id) {
                                name = feature.name;
                                break;
                            }
                        }
                        feature.push({ name, value });
                    }
                }
                setFeatures(features);

                setArticle(articleWithId);
            })
    }



    return (
        <Container>
            {isUserLoggedIn ? (
                <>
                    <RoleMainMenu role="user" />
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faArchive} /> {article?.name}
                            </Card.Title>
                            {message}

                            <Row>
                                <Col xs="12" md="4" lg="3">
                                    <div className="excerpt">
                                        {article?.excerpt}
                                    </div>
                                    <hr />

                                    <b>Features:</b><br />
                                    <ul>
                                        {features.map((fea) => (
                                            <li>
                                                {fea.name}: {fea.value}
                                            </li>
                                        ))}
                                    </ul>

                                </Col>

                                <Col xs="12" md="4" >
                                    <Row>
                                        <Col xs="12" className="mb-3">
                                            <img alt={"Photo" + article?.photos[0].photo_id}
                                                src={`${Apiconfig.PHOTO_PATH}/small/${article?.photos[0].image_path}`}
                                                className="w-100"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        {article?.photos.slice(1).map(photo => (
                                            <Col key={photo.photo_id} xs="12" sm="6">
                                                <img alt={"Photo" + photo.photo_id}
                                                    src={`${Apiconfig.PHOTO_PATH}/small/${photo.image_path}`}
                                                    className="w-100"
                                                />
                                            </Col>
                                        ))}
                                    </Row>

                                    <Row>
                                        <Col xs="12" className="text-center mb-3">
                                            <b>
                                                Price: {
                                                    article?.articlePrices[article.articlePrices.length - 1].price.toFixed(2) + ' EUR'
                                                }
                                            </b>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" className="mt-3">
                                            {
                                                article ?
                                                    (<AddToCartInput art={article} />) : ''
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                </>
            ) : (
                <Navigate to="/user/login" />
            )}
        </Container>
    );

}
export default ArticlePage;