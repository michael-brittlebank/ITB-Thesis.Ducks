import _ from 'lodash';
import React from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { autoRehydrate, persistStore } from 'redux-persist';
import { REACT_APP_API_URL } from 'react-native-dotenv'

import reducersBootstrapper from './bootstrapper'
import { actions as userActions } from './ducks/user';
import requestService from './services/request';
import { actions as configActions} from './ducks/config';

import AppNavigator from '../../router';

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Login')),
    navReducer = (state = initialState, action) => {
        const nextState = AppNavigator.router.getStateForAction(action, state);
        // Simply return the original `state` if `nextState` is null or undefined.
        return nextState || state;
    },
    store = compose(
        applyMiddleware(thunk, createLogger()),
        autoRehydrate()
    )(createStore)(combineReducers(_.assign(reducersBootstrapper,{nav: navReducer})));

persistStore(store, {storage: AsyncStorage}, () => {
    store.dispatch(configActions.setApiUrl(REACT_APP_API_URL));

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

class App extends React.Component {
    render() {
        return (
            <AppNavigator navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
            })} />
        );
    }
}

const mapStateToProps = (state) => ({
        nav: state.nav
    }),
    AppWithNavigationState = connect(mapStateToProps)(App);

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
        );
    }
}

AppRegistry.registerComponent('mobile', () => Root);

export default store;