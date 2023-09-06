import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container, Nav } from "react-bootstrap";
import { HashRouter } from "react-router-dom";
import CategoryType from "../../types/CategoryType";

interface CategoryPageProperties{
    match: {
        params:{
            cId: number
        }
    }
}

interface CategoryPageState{
    category?: CategoryType;
}


export default class CategoryPage extends React.Component<CategoryPageProperties>{
    
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperties>){
        super(props)

        this.state = {};

    }


    render() {
        return (<Container>
            <Card.Body>
                <Card.Title>
                    <FontAwesomeIcon icon={faListAlt} /> { this.state.category?.name}
                </Card.Title>
                <Card.Text>
                    Here, we will have our articles
                </Card.Text>
            </Card.Body>
        </Container>
        );
    }

    componentWillMount() {
       this.getCategoryData();
    }

    componentWillReceiveProps(newProperties: Readonly<CategoryPageProperties>) {
        if(newProperties.match.params.cId === this.props.match.params.cId){
            return;
        }
        this.getCategoryData();
    }

    private getCategoryData(){
        setTimeout(() =>{
            const data: CategoryType = {
                name: 'Category' + this.props.match.params.cId,
                categoryId: this.props.match.params.cId,
                items: []
            };
            this.setState({
                category: data,
            })
        }, 750);
    }


}