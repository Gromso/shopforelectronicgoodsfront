import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import {  faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api, {ApiRepsonse} from '../../api/api';



interface HomePageState {
  isUserLoggedIn: boolean;
  categories: CategoryType[];

}
interface ApiCategoryDTO{
  category_id: number;
  name : string;
}


class HomePage extends React.Component {
   state: HomePageState;

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      isUserLoggedIn: true,
      categories: [],
    }
  }

  componentDidMount(): void {
    this.getCategories();
  }

  

  private getCategories(){
    api('/api/category/categories ', 'get',{})
    .then((res: ApiRepsonse)=>{
      if(res.status === 'login' ){//  || res.status === 'login'
        return this.setLogginState(false);
        
      }
      if(res.status === 'error'){

      }

      this.putCategoriesInState(res.date);
    });

  }

  private putCategoriesInState(date: ApiCategoryDTO[]){
    if (!Array.isArray(date) || date.length === 0) {
      return <div>No categories found.</div>;
  }
    const categorie: CategoryType[] = date.map(category => {
      return {
        category_id: category.category_id,
        name : category.name,
        items:[],
      };
    });

    const newState = Object.assign(this.state, {
      categories : categorie
    });
    this.setState(newState);

  }

  private setLogginState(isLoggedIn: boolean){
    const newState = Object.assign(this.state, {
      isUserLoggedIn: isLoggedIn,
    })
    this.setState(newState);

}


  render() {
    if (this.state.isUserLoggedIn === false) {
      return (
        <Navigate to="/user/login" />
      );
    }
    
    return (<Container>
      <Card.Body>
        <Card.Title>
          <FontAwesomeIcon icon={faListAlt} />
          TOP LEVEL CATEGORT
        </Card.Title>
        <Row>
          {this.state.categories.map(this.singleCategory)}
        </Row>
      </Card.Body>
    </Container>
    );
  }

  



  private singleCategory(category: CategoryType) {  
    return (
      
      <Col md="3" sm="6" xs="12"  key={category.category_id}> 
        <Card className='mb-3'>
          <Card.Body>
            <Card.Title as="p" >
              {category.name}
            </Card.Title>
            <Link to={ `/category/${category.category_id}`}
                  className='btn btn-primary btn-block btn-sm'>
              Open category
            </Link>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}


export default HomePage;
