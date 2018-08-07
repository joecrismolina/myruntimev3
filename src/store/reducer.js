import * as actionTypes from './actions';

const initialState = {
  user: null
}

const reducer = (state = initialState, action) => {
  if(action.type === actionTypes.USER_LOGIN) {
    return {
      user: action.user
    }
  }
  else if(action.type === actionTypes.USER_LOGOUT) {
    return {
      user: null
    }
  }
  else {
    return state;
  }
};

export default reducer;