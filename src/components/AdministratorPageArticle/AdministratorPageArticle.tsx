import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Card, Col, Table, Button, Modal, Form, Alert, Row } from 'react-bootstrap';
import { faEdit, faListAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import api, { ApiRepsonse, apifile } from '../../api/api'
import { Navigate } from "react-router-dom";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";
import { Link } from "react-router-dom";
import ArticleType from "../../types/ArticleType";
import ApiArticleDTO from "../../dtos/ApiArticleDTO";
import CategoryType from "../../types/CategoryType";
import ApiCategotyDTO from "../../dtos/ApiCategoryDTO";


interface AdministratorPageArticleState {
    isLoggedIn: boolean;
    articles: ArticleType[];
    categories: CategoryType[];
    status: string[];


    addModal: {
        visible: boolean;
        errorMessage: string;

        name: string;
        categoryId: number;
        excerpt: string;
        description: string;
        price: number;

        features: {
            use: number;
            featureId: number;
            name: string;
            value: string;
        }[];

    },

    editModal: {
        visible: boolean;
        errorMessage: string;

        name: string;
        categoryId: number;
        excerpt: string;
        description: string;
        status: string;
        isPromoted: number;
        price: number;

        features: {
            use: number;
            featureId: number;
            name: string;
            value: string;
        }[];
    }
}

interface FeatureBaseType {
    featureId: number;
    name: string;
}

export default class AdministratorPageArticle extends React.Component {

    state: AdministratorPageArticleState;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            isLoggedIn: false,
            articles: [],
            categories: [],
            status: [
                "available",
                "visible",
                "hidden"
            ],

            addModal: {
                visible: false,
                errorMessage: '',
                name: '',
                categoryId: 1,
                excerpt: '',
                description: '',
                price: 0.01,
                features: [],

            },
            editModal: {
                visible: false,
                errorMessage: '',
                name: '',
                categoryId: 1,
                excerpt: '',
                description: '',
                status: 'available',
                isPromoted: 0,
                price: 0.01,
                features: [],
            }

        };
    }



    private setAddModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                visible: newState,
            })));
    }
    private setAddModalStringFildState(fildName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fildName]: newValue,
            })));
    }
    private setAddModalNumberFildState(fildName: string, newValue: any) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fildName]: (newValue === 'null') ? null : Number(newValue),
            })));
    }


    private async addModalCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setAddModalNumberFildState('categoryId', event.target.value)
        console.log(event.target.value + " feature")

        const feature = await this.getFeatureByCategoryId(Number(event.target.value));
        console.log(feature + " feature")
        console.log(feature[0].featureId)

        const stateFeatures = feature.map(feat => ({
            featureId: feat.featureId,
            name: feat.name,
            value: '',
            use: 0,
        }));
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                features: stateFeatures,
            }),
        ));
    }

    private setAddModalFeatureUse(featureId: number, use: boolean) {
        const addFeatures: { featureId: number, use: number }[] = [...this.state.addModal.features];
        for (const feature of addFeatures) {
            if (feature.featureId === featureId) {
                feature.use = use ? 1 : 0;
                break;
            }
        }
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                features: addFeatures,
            }),
        ));
    }


    private setAddModalFeatureValue(featureId: number, value: string) {
        const addFeatures: { featureId: number, value: string }[] = [...this.state.addModal.features];
        for (const feature of addFeatures) {
            if (feature.featureId === featureId) {
                feature.value = value;
                break;
            }
        }
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                features: addFeatures,
            }),
        ));
    }



    private setEditModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                visible: newState,
            })));
    }


    private setEditModalStringFildState(fildName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fildName]: newValue,
            })));
    }
    private setEditModalNumberFildState(fildName: string, newValue: any) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fildName]: (newValue === 'null') ? null : Number(newValue),
            })));
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message,
        })
        this.setState(newState);
    }
    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        })
        this.setState(newState);
    }

    private async getFeatureByCategoryId(categoryId: number): Promise<FeatureBaseType[]> {
        return new Promise(resolve => {
            api('/api/feature/category/' + categoryId, 'get', {})
                .then((res: ApiRepsonse) => {
                    if (res.status === 'error') {
                        this.setLogginState(true);
                        return resolve([]);
                    }
                    if (res.status === 'login') {
                        this.setLogginState(true);
                        return;
                    }

                    if (res.date.length !== 0) {
                        const features: FeatureBaseType[] = res.date.map((item: any) => ({
                            featureId: item.featureId,
                            name: item.name,
                        }));
                        resolve(features);
                    } else {
                        alert("there are no feature for that category")
                        return;
                    }




                })
        })

    }

    private getArticles() {
        api('/api/article/articles', 'get', {})
            .then((res: ApiRepsonse) => {
                if (res.status === 'error') {
                    this.setErrorMessage("Somting is wrong");
                    return;
                }
                if (res.status === 'login') {
                    this.setLogginState(true);
                    return;
                }
                this.putArticlesInState(res.date);
            })
    }


    private putArticlesInState(date: ApiArticleDTO[]) {
        if (!Array.isArray(date) || date.length === 0) {
            return <div>Not articles found.</div>;
        }
        const articles: ArticleType[] = date.map(article => {
            const firstPhoto = article.photos[0];
            const imageUrl = firstPhoto ? firstPhoto.image_path : '';
            const firstPrice = article.articlePrices[article.articlePrices.length - 1];
            const lastPrice = firstPrice ? firstPrice.price : 0;
            return {
                articleId: article.article_id,
                name: article.name,
                excerpt: article.excerpt,
                description: article.description,
                imageUrl: imageUrl,
                price: lastPrice,

                status: article.status,
                isPromoted: article.isPromoted,
                articleFeatures: article.articleFeatures,
                features: article.features,
                articlePrices: article.articlePrices,
                photos: article.photos,
                category: article.category,

            };
        });

        const newState = Object.assign(this.state, {
            articles: articles
        });
        this.setState(newState);
    }

    private getCategories() {
        api('/api/category/categories', 'get', {})
            .then((res: ApiRepsonse) => {
                if (res.status === 'error') {
                    this.setErrorMessage("Somting is wrong");
                    return;
                }
                if (res.status === 'login') {
                    this.setLogginState(true);
                    return;
                }

                this.putCategoriesInState(res.date);
            })
    }


    private putCategoriesInState(date: ApiCategotyDTO[]) {
        if (!Array.isArray(date) || date.length === 0) {
            return <div>No categories found.</div>;
        }
        const categorie: CategoryType[] = date.map(category => {
            return {
                categoryId: category.categoryId,
                name: category.name,
                image_path: category.image_path,
                parentCategoryId: category.parentCategoryId,
            };
        });

        const newState = Object.assign(this.state, {
            categories: categorie
        });
        this.setState(newState);
    }

    private printAddModalFeatureInput(feature: any) {
        return (
            <Form.Group >
                <Row>
                    <Col xs="4" sm="1" className="text-center">
                        <input type="checkbox" value={1} checked={feature.use === 1}
                            onChange={(e) => this.setAddModalFeatureUse(feature.featureId, e.target.checked)} />
                    </Col>
                    <Col xs="8" sm="3">
                        {feature.name}
                    </Col>
                    <Col xs="12" sm="8">
                        <Form.Control type="text" value={feature.value}
                            onChange={(e) => this.setAddModalFeatureValue(feature.featureId, e.target.value)} />
                    </Col>
                </Row>
            </Form.Group>
        )
    }


    componentDidMount(): void {
        this.getArticles();
        this.getCategories();
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Navigate to="/user/login" />
            )
        }
        return (
            <Container>
                <RoleMainMenu role="admin" />
                <Card>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faListAlt} /> Articles
                                { }
                            </Card.Title>
                            <Table bordered hover className="text-center" size="sm">
                                <thead>
                                    <tr>
                                        <th>...</th>
                                        <th colSpan={5}>Articles</th>
                                        <th className="text-center">
                                            <Button variant="primary" size="sm"
                                                onClick={() => this.showAddModal()}>
                                                <FontAwesomeIcon icon={faPlus} /> Add
                                            </Button>
                                        </th>
                                    </tr>
                                    <tr>

                                        <th className="text-right">ID</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Promoted</th>
                                        <th className="text-right">Price</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.articles.map(art => (
                                        <tr key={art.articleId}>
                                            <td className="text-right">{art.articleId}</td>
                                            <td> {art.name}</td>
                                            <td> {art.category?.name}</td>
                                            <td> {art.status}</td>
                                            <td> {art.isPromoted ? "Yes" : "No"}</td>
                                            <td className="text-right"> {art.price}</td>
                                            <td className="text-center">
                                                //....

                                                <Button variant="info" size="sm"
                                                    onClick={() => this.showEditModal(art)}>
                                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    ), this)}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Col>
                </Card>

                <Modal size="lg" centered show={this.state.addModal.visible}
                    onHide={() => this.setAddModalVisibleState(false)} >
                    <Modal.Header>
                        <Modal.Title>Add new Article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="add-categoryId">Category</Form.Label>
                            <Form.Control
                                id="add-categoryId"
                                as="select"
                                value={this.state.addModal.categoryId.toString()}
                                onChange={(e) => this.addModalCategoryChange(e as any)}>
                                {this.state.categories.map((cat) => (
                                    <option key={cat.categoryId} value={cat.categoryId?.toString()}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-name">Name</Form.Label>
                            <Form.Control id="add-name" type="text" value={this.state.addModal.name}
                                onChange={(e) => this.setAddModalStringFildState('name', e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="add-excerpt">short text</Form.Label>
                            <Form.Control id="add-excerpt" type="text" value={this.state.addModal.excerpt}
                                onChange={(e) => this.setAddModalStringFildState('excerpt', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-description">detailed text</Form.Label>
                            <Form.Control id="add-description" as="textarea" value={this.state.addModal.description}
                                onChange={(e) => this.setAddModalStringFildState('description', e.target.value)}
                                rows={10} />
                        </Form.Group>
                        {/* 
                        <Form.Group>
                            <Form.Label htmlFor="add-status">status</Form.Label>
                            <Form.Control
                                id="add-status"
                                as="select"
                                value={this.state.addModal.categoryId.toString()}
                                onChange={(e) => this.setAddModalStringFildState('status', e.target.value)}>
                                <option value="available">available</option>
                                <option value="visible">visible</option>
                                <option value="hidden">hidden</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-isPromoted">Promoted</Form.Label>
                            <Form.Control
                                id="add-isPromoted"
                                as="select"
                                value={this.state.addModal.isPromoted.toString()}
                                onChange={(e) => this.setAddModalNumberFildState('isPromoted', e.target.value)}>
                                <option value={0}>Not Promoted</option>
                                <option value={1}>Is Promoted</option>
                            </Form.Control>
                        </Form.Group>
                                */   }
                        <Form.Group>
                            <Form.Label htmlFor="add-price">Price</Form.Label>
                            <Form.Control id="add-price" type="number" min={0.01} step={0.01} value={this.state.addModal.price}
                                onChange={(e) => this.setAddModalNumberFildState('price', e.target.value)} />
                        </Form.Group>
                        <div>
                            {this.state.addModal.features.map(this.printAddModalFeatureInput, this)}
                        </div>

                        <Form.Group>
                            <Form.Label htmlFor="add-photo">Article Photo</Form.Label>
                            <Form.Control type="file" id="add-photo" />
                        </Form.Group>

                        <Form.Group>
                            <Button
                                value="primary"
                                onClick={() => this.doAddCategory()}>
                                <FontAwesomeIcon icon={faPlus}
                                /> Add new category
                            </Button>
                        </Form.Group>
                        {this.state.addModal.errorMessage ? (
                            <Alert variant="danger" >{this.state.addModal.errorMessage}</Alert>
                        ) : ''}
                    </Modal.Body>
                </Modal>




            </Container >
        );
    }

    private showAddModal() {
        this.setAddModalNumberFildState('categoryId', "1");
        this.setAddModalStringFildState('name', '');
        this.setAddModalStringFildState('excerpt', '');
        this.setAddModalStringFildState('description', '');
        this.setAddModalNumberFildState('price', "0.01");



        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                features: [],
            }),
        ));

        this.setAddModalVisibleState(true);

        const inputElement: any = document.getElementById('add-photo');
        if (inputElement) {
            inputElement.value = '';
        }

    }

    private doAddCategory() {
        const fileCount: any = document.getElementById("add-photo");

        if (fileCount?.files.length === null) {
            this.setErrorMessage("You must select a file to upload");
            return;
        }


        api('/api/article/add/articleDto', 'post', {
            categoryId: this.state.addModal.categoryId,
            name: this.state.addModal.name,
            excerpt: this.state.addModal.excerpt,
            description: this.state.addModal.description,
            price: this.state.addModal.price,
            features: this.state.addModal.features
                .filter(feature => feature.use === 1)
                .map(feature => ({
                    feature_id: feature.featureId, // feature_id or featureID
                    value: feature.value
                })),
        },)
            .then(async (res: ApiRepsonse) => {
                if (res.status === 'error') {
                    this.setErrorMessage("Somting is wrong  on your dates");
                    return;
                }
                if (res.status === 'login') {
                    this.setLogginState(true);
                    return;
                }


                const articleId: number = res.date.article_id; // article_id or articleId

                const file = fileCount.files[0];
                await this.uploadArticlePhoto(articleId, file)

                this.setAddModalVisibleState(false);
                this.getArticles();
            });
    }

    private async uploadArticlePhoto(articleId: number, file: File) {
        return await apifile('/api/photo/article/' + articleId, 'file', file);

    }

    private showEditModal(art: ArticleType) {
        this.setEditModalStringFildState('name', String(art.name));

        this.setEditModalNumberFildState('errorMessage', '');
        this.setEditModalVisibleState(true);
    }


    /*private doEditCategory() {
        api('/api/category/edit/' + this.state.editModal.category_id, 'put', {
            name: this.state.editModal.name,
            image_path: this.state.editModal.image_path,
            parentCategoryId: this.state.editModal.parentCategoryId,
        },)
            .then((res: ApiRepsonse) => {

                if (res.status === 'error') {
                    this.setErrorMessage("Somting is wrong  on your dates");
                    return;
                }
                if (res.status === 'login') {
                    this.setLogginState(true);
                    return;
                }
                this.setEditModalVisibleState(false);
                this.getArticles();
            })
    }*/
}
