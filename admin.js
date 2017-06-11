import axios from 'axios';
import store from '../../store';

import requestService from '../services/request';

export const types = {
    USERS_REQUEST: 'ADMIN/USERS_REQUEST',
    USERS_SUCCESS: 'ADMIN/USERS_SUCCESS',
    USERS_FAILURE: 'ADMIN/USERS_FAILURE'
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
        case types.USERS_REQUEST:
            return {
                ...state,
                isLoading: true,
                response: defaultResponse
            };
        case types.USERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                users: action.users
            };
        case types.USERS_FAILURE:
            return {
                ...state,
                isLoading: false,
                response: action.response
            };
        case types.RESET_RESPONSE:
            return {
                ...state,
                response: defaultResponse
            };
        case types.LOGOUT:
            return initialState;
        default:
            return state
    }
}

export const actions = {
    getUsers: function(page, limit){
        if(!limit){
            limit = 10;
        }
        return function (dispatch) {
            dispatch({type:types.USERS_REQUEST});
            return axios({
                method: 'GET',
                url: requestService.getApiUrl()+'/admin/users/'+page+'/'+limit,
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
};