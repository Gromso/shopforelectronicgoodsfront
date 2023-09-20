import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Container, Card, Col, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faBackward, faEdit, faListUl, faPlus } from '@fortawesome/free-solid-svg-icons';
import api, { ApiRepsonse } from '../../api/api'
import { Navigate, useParams, Link } from "react-router-dom";
import FeatureType from "../../types/FeatureType";
import ApiFeatureDTO from "../../dtos/ApiFeatureDTO";


interface AdministratorPageFeatureState {
    isLoggedIn: boolean;
    features: FeatureType[];

    addModal: {
        visible: boolean;
        errorMessage: string;
        name: string;
    };
    editModal: {
        feature_id?: number;
        visible: boolean;
        errorMessage: string;
        name: string;
    };
}

function AdministratorPageFeature() {
    const { cId } = useParams<{ cId: string }>();
    const [message, setMessage] = useState("");
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [features, setFeatures] = useState<FeatureType[]>([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModal, setEditModal] = useState<AdministratorPageFeatureState["editModal"]>({
        feature_id: undefined,
        visible: false,
        errorMessage: "",
        name: "",
    });

    useEffect(() => {
        getFeatures();
    }, [cId]);

    const setLoginState = (isLoggedIn: boolean) => {
        setIsUserLoggedIn(isLoggedIn);
    };

    const setAddModalVisibleState = (newState: boolean) => {
        setAddModalVisible(newState);
    };

    const getFeatures = () => {
        api(`/api/feature/features`, "get", {})
            .then((res: ApiRepsonse) => {
                if (res.status === "error") {
                    setMessage("Request error, please try refreshing the page.");
                    setLoginState(true);
                    return;
                }
                if (res.status === "login") {
                    return;
                }
                putFeaturesInState(res.date);
            });
    };

    const putFeaturesInState = (data: ApiFeatureDTO[]) => {
        const features: FeatureType[] = data.map((feature) => ({

            feature_id: feature.feature_id,
            category_id: feature.category_id,
            name: feature.name,
        }));
        
        setFeatures(features);
    };

    const showAddModal = () => {
        setAddModalVisibleState(true);
    };

    

    const doAddFeature = () => {
        api(`/api/feature/add/${cId}`, "post", {
            name: editModal.name,
            category_id: cId,
        })
            .then((res: ApiRepsonse) => {
                if (res.status === "error") {
                    setEditModal({ ...editModal, errorMessage: "Something is wrong with your data" });
                    setLoginState(true);
                    return;
                }
                if (res.status === "login") {
                    return;
                }
                setAddModalVisibleState(false);
                getFeatures();
            });
    };

    const showEditModal = (feature: FeatureType) => {
        setEditModal({
            ...editModal,
            feature_id: feature.feature_id,
            name: feature.name,
            errorMessage: "",
            visible: true,
        });
    };

    const doEditFeature = () => {
        api(`/api/feature/edit/${editModal.feature_id}`, "put", {
            name: editModal.name,
            category_id: cId,
        })
            .then((res: ApiRepsonse) => {
                if (res.status === "error") {
                    setEditModal({ ...editModal, errorMessage: "Something is wrong with your data" });
                    setLoginState(true);
                    return;
                }
                if (res.status === "login") {
                    return;
                }
                setEditModal({ ...editModal, visible: false });
                getFeatures();
            });
    };

    return (
        <Container>
            {isUserLoggedIn ? (
                <Navigate to="/user/login" />
            ) : (
                <>
                    <Card>
                            <Card.Body>
                                <Card.Title>
                                    <FontAwesomeIcon icon={faListUl} /> Features
                                </Card.Title>

                                <Table bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>...</th>
                                            <th colSpan={1}>
                                                <Link to="/admin/dashboard/category" className="btn btn-sm btn-secondary">
                                                    <FontAwesomeIcon icon={faBackward} /> Back to categories
                                                </Link>
                                            </th>
                                            <th className="text-center">
                                                <Button variant="primary" size="sm" onClick={showAddModal}>
                                                    <FontAwesomeIcon icon={faPlus} /> Add
                                                </Button>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="text-right">ID</th>
                                            <th>Name</th>
                                            <th className="text-center">Edit</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {features.map((fet) => (
                                            <tr key={fet.feature_id}>
                                                <td className="text-right">{fet.feature_id}</td>
                                                <td> {fet.name}</td>
                                                <td className="text-center">
                                                    <Button variant="info" size="sm" onClick={() => showEditModal(fet)}>
                                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                    </Card>

                    <Modal size="lg" centered show={addModalVisible} onHide={() => setAddModalVisibleState(false)}>
                        <Modal.Header>
                            <Modal.Title>Add new Feature</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label htmlFor="name">Name</Form.Label>
                                <Form.Control
                                    id="name"
                                    type="text"
                                    value={editModal.name}
                                    onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Button value="primary" onClick={doAddFeature}>
                                    <FontAwesomeIcon icon={faPlus} /> Add new feature
                                </Button>
                            </Form.Group>
                            {editModal.errorMessage ? <Alert variant="danger">{editModal.errorMessage}</Alert> : ""}
                        </Modal.Body>
                    </Modal>

                    <Modal size="lg" centered show={editModal.visible} onHide={() => setEditModal({ ...editModal, visible: false })}>
                        <Modal.Header>
                            <Modal.Title>Edit Category</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label htmlFor="name">Name</Form.Label>
                                <Form.Control
                                    id="name"
                                    type="text"
                                    value={editModal.name}
                                    onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Button value="primary" onClick={doEditFeature}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit feature
                                </Button>
                            </Form.Group>
                            {editModal.errorMessage ? <Alert variant="danger">{editModal.errorMessage}</Alert> : ""}
                        </Modal.Body>
                    </Modal>
                </>
            )}

            
        </Container>
    );
}

export default AdministratorPageFeature;



