import {combineReducers} from 'redux';
import auth from './auth';
import service from './service';
import reference from './reference';

const rootReducer = combineReducers({
    auth,
    service,
    reference
});

export default rootReducer;