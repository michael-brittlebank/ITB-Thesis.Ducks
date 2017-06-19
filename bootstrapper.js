// Ducks
import userReducer from './ducks/user';
import adminReducer from './ducks/admin';
import configReducer from './ducks/config';
import workoutReducer from './ducks/workout';

export default {
    configState: configReducer,
    userState: userReducer,
    adminState: adminReducer,
    workoutState: workoutReducer
};