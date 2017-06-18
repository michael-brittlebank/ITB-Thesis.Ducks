import _ from 'lodash';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { autoRehydrate, persistStore } from 'redux-persist';
import { routerReducer } from 'react-router-redux'

import reducersBootstrapper from './bootstrapper'
import { actions as userActions } from './ducks/user';
import requestService from './services/request';
import { actions as configActions} from './ducks/config';

const middleware = applyMiddleware(thunk, createLogger());

let store = compose(
    middleware,
    autoRehydrate()
)(createStore)(combineReducers(_.assign(reducersBootstrapper,{routing: routerReducer})));

persistStore(store, {}, () => {
    store.dispatch(configActions.setApiUrl(process.env.REACT_APP_API_URL));

    let sessionToken = requestService.getSessionToken(store);
    //clear last response objects after refresh
    store.dispatch(userActions.resetResponse());

    //check user session
    if (!!sessionToken){
        userActions.getProfile(store)
            .catch(() => {
                //purge store upon session cookie expiry
                persistStore(store).purge();
                return store.dispatch(userActions.logout());
            });
    }
});

export default store;