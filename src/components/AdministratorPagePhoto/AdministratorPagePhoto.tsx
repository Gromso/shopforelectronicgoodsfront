import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Container, Card, Col, Table, Button, Modal, Form, Alert, Row, Nav } from 'react-bootstrap';
import { faAdd, faBackward, faEdit, faImages, faListUl, faMinus, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import api, { ApiRepsonse, apifile } from '../../api/api'
import { Navigate, useParams, Link } from "react-router-dom";
import ApiFeatureDTO from "../../dtos/ApiFeatureDTO";
import PhotoType from "../../types/PhotoType";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";
import { Apiconfig } from "../../config/apiConfig";



function AdministratorPagePhoto() {
    const { aId } = useParams<{ aId: string }>();
    const [message, setMessage] = useState("");
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
    const [photos, setPhotos] = useState<PhotoType[]>([]);


    useEffect(() => {
        getPhotos();
    }, [aId]);

    const setLoginState = (isLoggedIn: boolean) => {
        setIsUserLoggedIn(isLoggedIn);
    };


    const getPhotos = () => {
        api(`/api/photo/photos/${aId}`, "get", {})
            .then((res: ApiRepsonse) => {
                if (res.status === "error") {
                    setMessage("Request error, please try refreshing the page.");
                    setLoginState(false);
                    return;
                }
                if (res.status === "login") {
                    return;
                }
                putPhotosInState(res.date);
            });
    };

    const putPhotosInState = (data: PhotoType[]) => {
        if(data.length === 0 || data === null ){
            return;
        }
        if(data === undefined){
            getPhotos();
        }
        const photos: PhotoType[] = data.map((photo) => ({
            photo_id: photo.photo_id,
            image_path: photo.image_path
        }));
        
        setPhotos(photos);
    };

    const doUpload = () =>{
        let fileCount: any = document.getElementById("add-photo");
        if (fileCount?.files.length === null) {
            setMessage("You must select a file to upload");
            return;
        }
        const articleId: number = Number(aId);
        const file = fileCount.files[0];
        uploadPhoto(articleId,file);
        fileCount = '';
        getPhotos();

    }

    const uploadPhoto =  async (articleId: number, file: File) => {
        return await apifile('/api/photo/article/' + articleId, 'file', file);
    }

    const deletePhoto = (photoId: number) =>{
        if(!window.confirm('Are you sure?')){
            return;
        }
        api('/api/photo/' + photoId, "delete",{})
        .then((res:ApiRepsonse) =>{
            if (res.status === "error") {
                setMessage("Request error, please try refreshing the page.");
                setLoginState(false);
                return;
            }
            if (res.status === "login") {
                return;
            }
            getPhotos();
        })
    }


    return (
        <Container>
            {isUserLoggedIn ? (
                <>
                    <RoleMainMenu role="admin" />
                    <Card>
                        <Col md={{ span: 6, offset: 3 }}>
                            <Card.Body>
                                <Card.Title>
                                    <FontAwesomeIcon icon={faImages} /> Photos
                                </Card.Title>
                                <Nav>
                                    <Nav.Item className="mb-3">
                                        <Link to="/admin/dashboard/articles" className="btn btn-sm btn-info">
                                            <FontAwesomeIcon icon={ faBackward} /> Go Back to Articles
                                        </Link>
                                    </Nav.Item>
                                </Nav>
                                <Row>
                                    {photos.map((photo) => (
                                        <Col key={photo.photo_id} xs="12" sm="6" ms="4" lg="3">
                                            <Card>
                                                <Card.Body>
                                                    <img alt={"Photo" + photo.photo_id}
                                                        src={`${Apiconfig.PHOTO_PATH}/small/${photo.image_path}`}
                                                        className="w-100"
                                                    />
                                                </Card.Body>
                                                <Card.Footer>
                                                    {photos.length > 1 ? (
                                                        <Button variant="danger" className="block"
                                                        onClick={() => deletePhoto(photo.photo_id)}>
                                                            <FontAwesomeIcon icon={faMinus} />  Delete photo
                                                        </Button>
                                                    ) : ""}
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                <Form className="mt-5">
                                    <p>
                                        <strong>Add a new photo to this article</strong>
                                    </p>
                                    <Form.Group>
                                        <Form.Label htmlFor="add-photo">Article Photo</Form.Label>
                                        <Form.Control type="file" id="add-photo" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Button variant="primary" className="mt-2"
                                                onClick={() => doUpload()}>
                                            <FontAwesomeIcon icon={ faAdd } /> upload photo
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Col>
                    </Card>

                </>
            ) : (
                <Navigate to="/user/login" />
            )}
        </Container>
    );
}


export default AdministratorPagePhoto;



