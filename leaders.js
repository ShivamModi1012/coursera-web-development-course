import * as ActionTypes from '../redux/ActionTypes';

export const Leaders = (state = {
  isLoading: true,
  errorMessage: null,
  leaders: []}, action) => {
  
  switch (action.type) {
    
    case ActionTypes.LEADERS_LOADING:
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
        leaders: []
      };
    
    case ActionTypes.LEADERS_FAILED:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      }
    
    case ActionTypes.ADD_LEADERS:
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        leaders: action.payload
      }
    
    default:
      return state;
  }
};