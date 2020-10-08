import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import DishDetail from './DishDetailComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { actions } from 'react-redux-form';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { postFeedback, postComment, fetchDishes,
         fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';

const mapDispatchToProps = dispatch => ({
  
  postFeedback: (firstName, lastName, telNum, email, agree, contactType, message) =>
      dispatch(postFeedback(firstName, lastName, telNum, email, agree, contactType, message)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  fetchDishes: () => { dispatch(fetchDishes()) },
  resetFeedbackForm: () => { dispatch(actions.reset('feedback')) },
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders())
});

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  };
}


class Main extends Component {
  
  constructor(props) {
    super(props);
  }
  
  onDishSelect(dishId) {
    this.setState({selectedDish: dishId});
  }
  
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }
  
  render() {
    const HomePage = () => {
      return (
        <Home
          dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
          dishesLoading={this.props.dishes.isLoading}
          dishesErrorMessage={this.props.dishes.errorMessage}
          promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
          promoLoading={this.props.promotions.isLoading}
          promoErrorMessage={this.props.promotions.errorMessage}
          leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
          leaderLoading={this.props.leaders.isLoading}
          leaderErrorMessage={this.props.leaders.errorMessage}
        />
      );
    };
    
    const DishWithId = ({ match }) => {
      return (
        <DishDetail
          dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
          isLoading={this.props.dishes.isLoaidng}
          errorMessage={this.props.dishes.errorMessage}
          comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
          commentsErrorMessage={this.props.comments.errorMessage}
          postComment={this.props.postComment}
        />
      );
    };
    
    return (
      <div>
        <Header />
        <TransitionGroup>
        <CSSTransition key={this.props.location.key} classNames='page' timeout={300}>
            <Switch>
              <Route path="/home" component={HomePage} />
              <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} />} />
              <Route path="/menu/:dishId" component={DishWithId} />
              <Route exact path="/contactus" component={() => <Contact
                  postFeedback={this.props.postFeedback}
                  resetFeedbackForm={this.props.resetFeedbackForm} />} />
              <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders} />} />
              <Redirect to="/home" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));