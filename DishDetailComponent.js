import React, { Component, useState } from 'react';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { Animated, Text, View, ScrollView, FlatList, StyleSheet, Modal, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state =>{
  return{
    dishes:state.dishes,
    comments:state.comments,
    favorites:state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props){
  const recognizeComment = (...gestureState) =>{
    return true;
  };

  const recognizeDrag = (...gestureState) =>{
    return true;
  };

  const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState)){
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel'
                    },
                    {
                      text: 'OK',
                      onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            } else if(recognizeComment(gestureState)){
                props.onAddComment();
            }else{
              return true;
            }
        }
    });

  const dish = props.dish;

  if(dish != null){
    return(
      <View>
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
          {...panResponder.panHandelers}
        >
          <Card
          featuredTitle={dish.name}
          image={require('./images/uthappizza.png')}>
              <Text style={{margin: 10}}>
                  {dish.description}
              </Text>
              <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Icon
                  raised
                  reverse
                  name={props.favorite ? 'heart' : 'heart-o'}
                  type='font-awesome'
                  color='#f50'
                  onPress={()=>props.favorite ? console.log('Already favorite') : props.onPress()}
                />
                <Icon
                  raised
                  reverse
                  name={'pencil'}
                  type='font-awesome'
                  color='#512DA8'
                  onPress={()=>props.onAddComment()}
                />
              </View>
          </Card>
      </Animatable.View>

      </View>
    );
  } else{
    return(<view></view>);
  }
}

function RenderComments(props){
  const comments = props.comments;
  const renderCommentItem = ({item, index}) =>{
    return(
      <View key={index} style={{margin: 10}}>
        <Text style={{fontSize: 14}}>{item.comment}</Text>
        <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
        <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  };

  return(
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title='Comments'>
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item=>item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class Dishdetail extends Component{
  constructor(props){
      super(props);
      this.state={
        dishes: DISHES,
        comments: COMMENTS,
        favorites: [],
        showModal: false,
        rating: '',
        author: '',
        comment: ''
      }
  }

  markFavorite(dishId){
    this.props.postFavorite(dishId);
  };

  toggleModal = () => {
        this.setState({showModal: !this.state.showModal})
  };

  saveComment(dishId){
    this.toggleModal();
    this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
  }


  render(){
    const dishId = this.props.route.params.dishId;

    return(
      <Animated.ScrollView
        scrollEventThrottle={1} // <-- Use 1 here to make sure no events are ever missed
        onScroll={Animated.event(
          { useNativeDriver: true } // <-- Add this
        )}
      >
        <RenderDish
          dish={this.state.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={()=>this.markFavorite(dishId)}
          onAddComment={()=>this.toggleModal()}
        />
        <RenderComments comments={this.state.comments.filter((comment)=> comment.dishId === dishId)}/>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.showModal}
          onDismiss={()=>this.toggleModal()}
          onRequestClose={()=>this.toggleModal()}>
          <View style={styles.modal}>
            <Rating
              showRating
              startingValue='5'
              style={{ paddingVertical:10}}
              onFinishRating={rating => this.setState({rating:rating})}
            />
            <Input
              placeholder='Author'
              leftIcon={{type:'font-awesome', name:'user-o'}}
              onChangeText = { author => this.setState({ author })}/>
            <Input
              placeholder='Comment'
              leftIcon={{type:'font-awesome', name:'comment-o'}}
              onChangeText = { comment => this.setState({ comment })}/>
            <Button
              onPress={()=>this.saveComment(dishId)}
              color='#512DA8'
              title='Submit'
            />
            <Button
              onPress={()=>this.toggleModal()}
              color='#808080'
              title='Cancel'
            />
          </View>
        </Modal>
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);