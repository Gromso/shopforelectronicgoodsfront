import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Card, Col, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faEdit, faListAlt, faListUl, faPlus } from '@fortawesome/free-solid-svg-icons';
import api, { ApiRepsonse } from '../../api/api'
import { Navigate } from "react-router-dom";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";
import { Link } from "react-router-dom";
import CategoryType from "../../types/CategoryType";
import ApiCategoryDTO from "../../dtos/ApiCategoryDTO";


interface AdministratorPageCategoryState {
    isLoggedIn: boolean;
    categories: CategoryType[];
    
    addModal: {
        visible: boolean;
        errorMessage: string;
        name: string;
        image_path: string;
        parentCategoryId: number | null;
    },
    editModal: {
        category_id?: number
        visible: boolean;
        errorMessage: string;
        name: string;
        image_path: string;
        parentCategoryId: number | null;
    }
}

export default class AdministratorPageCategory extends React.Component {

    state: AdministratorPageCategoryState;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            isLoggedIn: false,
            categories: [],

            addModal: {
                visible: false,
                errorMessage: '',
                name: '',
                image_path: '',
                parentCategoryId: null,
            },
            editModal: {
                visible: false,
                errorMessage: '',
                name: '',
                image_path: '',
                parentCategoryId: null,
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


    private putCategoriesInState(date: ApiCategoryDTO[]) {
        if (!Array.isArray(date) || date.length === 0) {
            return <div>No categories found.</div>;
        }
        const categorie: CategoryType[] = date.map(category => {
            return {
                category_id: category.categoryId,
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



    componentDidMount(): void {
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
                                <FontAwesomeIcon icon={faListAlt} /> Categories
                                { }
                            </Card.Title>
                            <Table bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>...</th>
                                        <th colSpan={2}></th>
                                        <th className="text-center">
                                            <Button variant="primary" size="sm"
                                                onClick={() => this.showAddModal()}>
                                                <FontAwesomeIcon icon={faPlus} /> Add
                                            </Button>
                                        </th>

                                    </tr>
                                    <tr>

                                        <th className="text-right">ID</th>
                                        <th></th>
                                        <th>Name</th>
                                        <th className="text-right">Parent ID</th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.categories.map(cat => (
                                        <tr key={cat.categoryId}>
                                            <td className="text-right">{cat.categoryId}</td>
                                            <td> {cat.name}</td>
                                            <td className="text-right"> {cat.parentCategoryId}</td>
                                            <td className="text-center">
                                                <Link to={"/admin/dashboard/features/" + cat.categoryId}
                                                    className="btn btn-sm btn-info ml-2 ">
                                                    <FontAwesomeIcon icon={faListUl} /> Feature
                                                </Link>
                                                <Button variant="info" size="sm"
                                                    onClick={() => this.showEditModal(cat)}>
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
                    onHide={() => this.setAddModalVisibleState(false)}>
                    <Modal.Header>
                        <Modal.Title>Add new Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" type="text" value={this.state.addModal.name}
                                onChange={(e) => this.setAddModalStringFildState('name', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="imagePath">Name</Form.Label>
                            <Form.Control id="imagePath" type="url" value={this.state.addModal.image_path}
                                onChange={(e) => this.setAddModalStringFildState('image_path', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="parentCategoryId">parent Category</Form.Label>
                            <Form.Control
                                id="name"
                                as="select"
                                value={this.state.addModal.parentCategoryId !== null ? this.state.addModal.parentCategoryId.toString() : "null"}
                                onChange={(e) => this.setAddModalNumberFildState('parentCategoryId', e.target.value)}
                            >
                                <option value="null">parent category</option>
                                {this.state.categories.map((categ) => (
                                    <option key={categ.categoryId} value={categ.categoryId?.toString()}>
                                        {categ.name}
                                    </option>
                                ))}
                            </Form.Control>
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



                <Modal size="lg" centered show={this.state.editModal.visible}
                    onHide={() => this.setEditModalVisibleState(false)}>
                    <Modal.Header>
                        <Modal.Title>Edit Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" type="text" value={this.state.editModal.name}
                                onChange={(e) => this.setEditModalStringFildState('name', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="imagePath">imagePath</Form.Label>
                            <Form.Control id="imagePath" type="url" value={this.state.editModal.image_path}
                                onChange={(e) => this.setEditModalStringFildState('image_path', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="parentCategoryId">parent Category</Form.Label>
                            <Form.Control
                                id="name"
                                as="select"
                                value={this.state.editModal.parentCategoryId !== null ? this.state.editModal.parentCategoryId.toString() : "null"}
                                onChange={(e) => this.setEditModalNumberFildState('parentCategoryId', e.target.value)}
                            >
                                <option value="null">parent category</option>
                                {this.state.categories
                                    .filter(catetogy => catetogy.categoryId !== this.state.editModal.category_id)
                                    .map((categ) => (
                                        <option key={categ.categoryId} value={categ.categoryId?.toString()}>
                                            {categ.name}
                                        </option>
                                    ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button
                                value="primary"
                                onClick={() => this.doEditCategory()}>
                                <FontAwesomeIcon icon={faEdit}
                                /> edit new category
                            </Button>
                        </Form.Group>
                        {this.state.editModal.errorMessage ? (
                            <Alert variant="danger" >{this.state.editModal.errorMessage}</Alert>
                        ) : ''}
                    </Modal.Body>
                </Modal>
            </Container >
        );
    }

    private showAddModal() {
        this.setAddModalStringFildState('name', '');
        this.setAddModalStringFildState('imagePath', '');
        this.setAddModalNumberFildState('parentCategoryId', 'null');
        this.setAddModalNumberFildState('errorMessage', '');
        this.setAddModalVisibleState(true);
    }

    private doAddCategory() {
        api('/api/category/add', 'post', {
            name: this.state.addModal.name,
            image_path: this.state.addModal.image_path,
            parentCategoryId: this.state.addModal.parentCategoryId,
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
                this.setAddModalVisibleState(false);
                this.getCategories();
            })
    }

    private showEditModal(cat: CategoryType) {
        this.setEditModalStringFildState('name', String(cat.name));
        this.setEditModalStringFildState('image_path', String(cat.image_path));
        this.setEditModalNumberFildState('parentCategoryId', cat.parentCategoryId);
        this.setEditModalNumberFildState('category_id', cat.categoryId);

        this.setEditModalNumberFildState('errorMessage', '');
        this.setEditModalVisibleState(true);
    }


    private doEditCategory() {
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
                this.getCategories();
            })
    }
}
