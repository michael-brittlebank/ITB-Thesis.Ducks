import axios from 'axios';

import requestService from '../services/request';

export const types = {
    GET_EXERCISES_REQUEST: 'WORKOUT/GET_EXERCISES_REQUEST',
    GET_EXERCISES_SUCCESS: 'WORKOUT/GET_EXERCISES_SUCCESS',
    GET_EXERCISES_FAILURE: 'WORKOUT/GET_EXERCISES_FAILURE',
    GET_WORKOUTS_REQUEST: 'WORKOUT/GET_WORKOUTS_REQUEST',
    GET_WORKOUTS_SUCCESS: 'WORKOUT/GET_WORKOUTS_SUCCESS',
    GET_WORKOUTS_FAILURE: 'WORKOUT/GET_WORKOUTS_FAILURE',
    SAVE_WORKOUTS_REQUEST: 'WORKOUT/SAVE_WORKOUTS_REQUEST',
    SAVE_WORKOUTS_SUCCESS: 'WORKOUT/SAVE_WORKOUTS_SUCCESS',
    SAVE_WORKOUTS_FAILURE: 'WORKOUT/SAVE_WORKOUTS_FAILURE',
    GET_WORKOUT_REQUEST: 'WORKOUT/GET_WORKOUT_REQUEST',
    GET_WORKOUT_SUCCESS: 'WORKOUT/GET_WORKOUT_SUCCESS',
    GET_WORKOUT_FAILURE: 'WORKOUT/GET_WORKOUT_FAILURE',
};

let defaultExercises = [],
    defaultWorkouts = [],
    defaultCurrentWorkout = {},
    defaultResponse = {};

export const initialState = {
    workouts: defaultWorkouts,
    exercises: defaultExercises,
    isLoading: false,
    response: defaultResponse,
    currentWorkout: defaultCurrentWorkout
};

//reducers
export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_WORKOUT_REQUEST:
        case types.SAVE_WORKOUTS_REQUEST:
        case types.GET_WORKOUTS_REQUEST:
        case types.GET_EXERCISES_REQUEST:
            return {
                ...state,
                isLoading: true,
                response: defaultResponse
            };
        case types.GET_WORKOUTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                workouts: action.workouts,
                response: action.response
            };
        case types.GET_EXERCISES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                exercises: action.exercises,
                response: action.response
            };
        case types.GET_WORKOUT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentWorkout: action.currentWorkout,
                response: action.response
            };
        case types.GET_WORKOUT_FAILURE:
        case types.SAVE_WORKOUTS_SUCCESS:
        case types.SAVE_WORKOUTS_FAILURE:
        case types.GET_WORKOUTS_FAILURE:
        case types.GET_EXERCISES_FAILURE:
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
    getExercises: function(store){
        return function (dispatch) {
            dispatch({type:types.GET_EXERCISES_REQUEST});
            return axios({
                method: 'GET',
                url: requestService.getApiUrl(store)+'/workouts/exercises',
                headers: requestService.getSessionHeaders(store)
            })
                .then((response) => {
                    dispatch({
                        type: types.GET_EXERCISES_SUCCESS,
                        exercises: response.data,
                        response: response
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: types.GET_EXERCISES_FAILURE,
                        response: error.response
                    });
                });
        };
    },
    getWorkouts: function(store){
        return function (dispatch) {
            dispatch({type:types.GET_WORKOUTS_REQUEST});
            return axios({
                method: 'GET',
                url: requestService.getApiUrl(store)+'/workouts',
                headers: requestService.getSessionHeaders(store)
            })
                .then((response) => {
                    dispatch({
                        type: types.GET_WORKOUTS_SUCCESS,
                        workouts: response.data,
                        response: response
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: types.GET_WORKOUTS_FAILURE,
                        response: error.response
                    });
                });
        };
    },
    saveWorkout: function(store, exercises){
        return function (dispatch) {
            dispatch({type:types.SAVE_WORKOUTS_REQUEST});
            return axios({
                method: 'PUT',
                url: requestService.getApiUrl(store)+'/workouts',
                headers: requestService.getSessionHeaders(store),
                data: {
                    exercises: exercises
                }
            })
                .then((response) => {
                    dispatch({
                        type: types.SAVE_WORKOUTS_SUCCESS,
                        response: response
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: types.SAVE_WORKOUTS_FAILURE,
                        response: error.response
                    });
                });
        };
    },
    getWorkoutById: function(store, workoutId){
        return function (dispatch) {
            dispatch({type:types.GET_WORKOUT_REQUEST});
            return axios({
                method: 'GET',
                url: requestService.getApiUrl(store)+'/workouts/'+workoutId,
                headers: requestService.getSessionHeaders(store)
            })
                .then((response) => {
                    dispatch({
                        type: types.GET_WORKOUT_SUCCESS,
                        currentWorkout: response.data,
                        response: response
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: types.GET_WORKOUT_FAILURE,
                        response: error.response
                    });
                });
        };
    },
};