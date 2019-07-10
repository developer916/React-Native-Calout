import * as ActionTypes from './ActionTypes';
import axios from 'react-native-axios';
import Config from 'react-native-config';

export const changeLanguage = (language) =>({
   type: ActionTypes.CHANGE_LANGUAGE,
   language: language
});
export const networkStatus = (status) => ({
    type: ActionTypes.NETWORK_STATUS,
    status: status
});

export const serviceActionPending = () => ({
    type: ActionTypes.SERVICE_PENDING
});

export const serviceActionError = (error, requestType) => ({
    type: ActionTypes.SERVICE_ERROR,
    error: error,
    requestType: requestType
});

export const serviceActionSuccess = (data, requestType) => ({
    type: ActionTypes.SERVICE_SUCCESS,
    data: data,
    requestType: requestType
});

export const checkNetworkStatus = () => ({
    type: ActionTypes.CHECK_NETWORK_STATUS
});

export const storeLocationList = (data) => ({
    type: ActionTypes.SET_LOCATION_LIST,
    locationList: data
});

export const storeSetupTypes = (data) => ({
    type: ActionTypes.SET_SETUP_TYPES,
    setupTypes: data
});

export const storeDocTypes = (data) => ({
    type: ActionTypes.SET_DOC_TYPES,
    docTypes: data
});

export const postRequest = (url, data, requestType) => {
    return dispatch => {
        dispatch(serviceActionPending());
        dispatch(checkNetworkStatus());
        axios.post(Config.API_URL + url, data, {timeout: 10000})
                .then(response => {
                    dispatch(serviceActionSuccess(response.data, requestType))
                })
                .catch(err => {
                    dispatch(serviceActionError(err, requestType))
                });
    }
};

export const formRequest = (url, data, requestType) => {
    return dispatch => {
        dispatch(serviceActionPending());
        dispatch(checkNetworkStatus());
        axios.post(Config.API_URL + url, data, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(response => {
                    dispatch(serviceActionSuccess(response.data, requestType))
                })
                .catch(err => {
                    dispatch(serviceActionError(err, requestType))
                });
    }
};

export const formRequestPut = (url, data, requestType) => {
    return dispatch => {
        dispatch(serviceActionPending());
        dispatch(checkNetworkStatus());
        axios.put(Config.API_URL + url, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                .then(response => {
                    dispatch(serviceActionSuccess(response.data, requestType))
                })
                .catch(err => {
                    dispatch(serviceActionError(err, requestType))
                });
    }
};

export const patchRequest = (url, data, requestType) => {
    return dispatch => {
        dispatch(serviceActionPending());
        dispatch(checkNetworkStatus());
        axios.patch(Config.API_URL + url, data, {timeout: 10000})
            .then(response => {
                dispatch(serviceActionSuccess(response.data, requestType))
            })
            .catch(err => {
                dispatch(serviceActionError(err, requestType))
            });
    }
};

export const getRequest = (url, requestType) => {
    return dispatch => {
        dispatch(serviceActionPending());
        dispatch(checkNetworkStatus());
        axios.get(Config.API_URL + url, {timeout: 10000})
                .then(response => {
                    dispatch(serviceActionSuccess(response.data, requestType))
                })
                .catch(err => {
                    dispatch(serviceActionError(err, requestType))
                });
    }
};


export const deleteRequest = (url, requestType) => {
    return dispatch => {
        dispatch(serviceActionPending());
        dispatch(checkNetworkStatus());
        axios.delete(Config.API_URL + url, {timeout: 10000})
                .then(response => {
                    dispatch(serviceActionSuccess(response.data, requestType))
                })
                .catch(err => {
                    dispatch(serviceActionError(err, requestType))
                });
    }
};