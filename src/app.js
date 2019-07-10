import React, {Component} from 'react';
import {connect} from 'react-redux';
import Login from './pages/auth';
import {logout} from "./actions/auth";
import axios from 'react-native-axios';
import Dashboard from './pages/dashboard';
import {NetInfo, AppState} from 'react-native';
import {getRequest, networkStatus, postRequest} from "./actions/Service";
import Config from 'react-native-config';

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        NetInfo.getConnectionInfo().then((reach) => {
            this.props.changeNetworkStatus(reach != 'NONE');
        });
        NetInfo.addEventListener(
            'change',
            this.handleFirstConnectivityChange.bind(this)
        );
    }
    componentWillUnmount() {
        NetInfo.removeEventListener(
                'change',
                this.handleFirstConnectivityChange.bind(this)
        );
    }

    handleFirstConnectivityChange(reach) {
        this.props.changeNetworkStatus(reach != 'NONE');
    }

    render() {
        if (this.props.isLoggedIn) {
            axios.defaults.headers.common['Authorization'] = this.props.authToken;
            return <Dashboard />;
        } else {
            return <Login />
        }
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        isLoggedIn: state.auth.isLoggedIn,
        authToken: state.auth.authToken,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    }
};

const mapDispatchToProps = (dispatch) =>{
    return {
        changeNetworkStatus: (status) => {
            dispatch(networkStatus(status));
        },
        logout: () => {
            dispatch(logout());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);