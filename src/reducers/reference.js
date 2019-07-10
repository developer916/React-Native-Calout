import {CHANGE_LANGUAGE}  from '../actions/ActionTypes';
import {getCurrentLocale} from '../../i18n/i18n';

const initialState = {language: getCurrentLocale()};


const userPreferences = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_LANGUAGE: {
            console.log("action", action);
            return {...state, language: action.language};
        }
        default:
            return state;
    }
};

export default userPreferences;