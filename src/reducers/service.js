import * as ActionTypes from '../actions/ActionTypes';
import {Alert} from 'react-native';


const defaultState = {
    isLoading: false,
    error: undefined,
    data: null,
    requestType: undefined,
    isConnected: true,
    locationList: [],
    setupTypes: [],
    docTypes: []
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case ActionTypes.SERVICE_PENDING:
            return Object.assign({}, state, {
                isLoading: true,
                error: undefined,
                data: null
            });
        case ActionTypes.SERVICE_SUCCESS:
            return Object.assign({}, state, {
                isLoading: false,
                data: action.data,
                requestType: action.requestType,
                error: undefined
            });
        case ActionTypes.NETWORK_STATUS:
            if (!action.status && state.isLoading) {
                Alert.alert(
                        'Error',
                        'Your device is not connected to internet.',
                        [
                            {
                                text: 'OK', onPress: () => {
                            }
                            }
                        ],
                        {cancelable: true}
                );
            }
            return Object.assign({}, state, {
                isLoading: false,
                isConnected: action.status
            });
        case ActionTypes.CHECK_NETWORK_STATUS:
            if (!state.isConnected) {
                Alert.alert(
                        'Error',
                        'Your device is not connected to internet.',
                        [
                            {
                                text: 'OK', onPress: () => {
                            }
                            }
                        ],
                        {cancelable: true}
                );
                return Object.assign({}, state, {
                    isLoading: false,
                });
            }else {
                return Object.assign({}, state, {});
            }
        case ActionTypes.SERVICE_ERROR:
            return Object.assign({}, state, {
                isLoading: false,
                error: action.error,
                data: null,
                requestType: action.requestType
            });
        case ActionTypes.SET_LOCATION_LIST:
            return Object.assign({}, state, {
                locationList: action.locationList
            });
        case ActionTypes.SET_SETUP_TYPES:
            return Object.assign({}, state, {
                setupTypes: action.setupTypes
            });
        case ActionTypes.SET_DOC_TYPES:
            return Object.assign({}, state, {
                docTypes: action.docTypes
            });
        default:
            return state;
    }
}