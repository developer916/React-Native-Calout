import * as ActionTypes from '../actions/ActionTypes';
import axios from 'react-native-axios';
const defaultState = {
    isLoggedIn: false,
    email: '',
    password: '',
    authToken: '',
    role: '',
    userId: '',
    company: [],
    name:'',
    confirmationLink: '',
    companyId: ''
};


export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            axios.defaults.headers.common['Authorization'] = action.authToken;

            return Object.assign({}, state, {
                isLoggedIn: true,
                email: action.email,
                password: action.password,
                authToken: action.authToken,
                role: action.role,
                userId: action.userId,
                company: action.company,
                name:action.name,
                companyId : action.companyId
            });
        case ActionTypes.REGISTER:
            return Object.assign({}, state, {
                isLoggedIn: false,
                email: action.email,
                password: action.password,
                userId: action.userId,
                name:action.name
            });
        case ActionTypes.STORE_COMPANY:
            return Object.assign({}, state, {
                isLoggedIn: false,
                company: action.company,
                companyId: action.companyId
            });
        case ActionTypes.STORE_SEPA:
            return Object.assign({}, state, {
                isLoggedIn : false,
                confirmationLink : action.confirmationLink
            });

        case ActionTypes.LOGOUT:
            return Object.assign({}, state, {
                isLoggedIn: false,
                email: '',
                password: '',
                authToken: '',
                role: '',
                userId: '',
                company: [],
                name:'',
                companyId : ''
            });
        default:
            return state;
    }
}