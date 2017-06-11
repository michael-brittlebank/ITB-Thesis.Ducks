import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

// Reducers
import userReducer from './user';
import adminReducer from './admin';

export default combineReducers({
    userState: userReducer,
    adminState: adminReducer,
    routing: routerReducer
});