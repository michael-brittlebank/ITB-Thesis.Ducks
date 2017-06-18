import axios from 'axios';
import _ from 'lodash';

import requestService from '../services/request';

export const types = {
    USERS_REQUEST: 'ADMIN/USERS_REQUEST',
    USERS_SUCCESS: 'ADMIN/USERS_SUCCESS',
    USERS_FAILURE: 'ADMIN/USERS_FAILURE',
    DELETE_USER_REQUEST: 'ADMIN/DELETE_USER_REQUEST',
    DELETE_USER_SUCCESS: 'ADMIN/DELETE_USER_SUCCESS',
    DELETE_USER_FAILURE: 'ADMIN/DELETE_USER_FAILURE'
};

let defaultUsers = [],
    defaultResponse = {};

export const initialState = {
    users: defaultUsers,
    isLoading: false,
    response: defaultResponse
};

//reducers
export default (state = initialState, action) => {
    switch (action.type) {
        case types.DELETE_USER_REQUEST:
        case types.USERS_REQUEST:
            return {
                ...state,
                isLoading: true,
                response: defaultResponse
            };
        case types.DELETE_USER_SUCCESS:
        case types.USERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                users: action.users,
                response: action.response
            };
        case types.RESET_RESPONSE:
            return {
                ...state,
                response: defaultResponse
            };
        case types.DELETE_USER_FAILURE:
        case types.USERS_FAILURE:
            return {
                ...state,
                isLoading: false,
                response: action.response
            };
        default:
            return state
    }
}

export const actions = {
    getUsers: function(store, page, limit){
        if(!limit){
            limit = 10;
        }
        return function (dispatch) {
            dispatch({type:types.USERS_REQUEST});
            return axios({
                method: 'GET',
                url: requestService.getApiUrl(store)+'/admin/users/'+page+'/'+limit,
                headers: requestService.getSessionHeaders(store)
            })
                .then((response) => {
                    dispatch({
                        type: types.USERS_SUCCESS,
                        users: response.data,
                        response: response
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: types.USERS_FAILURE,
                        response: error.response
                    });
                });
        };
    },
    deleteUserById: function(store, userId){
        return function (dispatch) {
            dispatch({type:types.DELETE_USER_REQUEST});
            return axios({
                method: 'DELETE',
                url: requestService.getApiUrl(store)+'/admin/user/'+userId,
                headers: requestService.getSessionHeaders(store)
            })
                .then((response) => {
                let newUsersList = store.getState().adminState.users;
                _.remove(newUsersList, {id: userId});
                    dispatch({
                        type: types.DELETE_USER_SUCCESS,
                        users: newUsersList,
                        response: response
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: types.DELETE_USER_FAILURE,
                        response: error.response
                    });
                });
        };
    },
};