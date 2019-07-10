import React, {Component} from 'react';
import {
    Container,
} from 'native-base';
import {connect} from 'react-redux';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Alert,
    Platform,
    AppState
} from 'react-native';
import Loader from '../../components/Loader';
import DialogInput from 'react-native-dialog-input';
import {login, logout} from '../../actions/auth';
import {postRequest, getRequest} from "../../actions/Service";
import Config from 'react-native-config';
import Register from './register';
let {height, width} = Dimensions.get('window');
import {containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import ReeValidate from 'ree-validate';
import _ from 'lodash';
import { getLanguages } from 'react-native-i18n';

import I18n, { switchLanguage } from '../../../i18n/i18n';

class Login extends Component {
    constructor(props) {
        super(props);

        this.validator = new ReeValidate({
            email: 'required|email',
            password: 'required|min:6',
        });

        this.state = {
            credentials: {
                email: '',
                password: '',
            },
            getMaintenanceKey : '',
            maintenance : 'false',
            appState: AppState.currentState,
            errors: this.validator.errors,
            fields: this.validator.fields,
            promptVisible: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.userLogin = this.userLogin.bind(this);
    }

    getMaintenance(){
        let getMaintenanceKey = Math.floor(Math.random() * 10000000);
        this.setState({getMaintenanceKey: getMaintenanceKey})
        this.props.getMaintenance(getMaintenanceKey);
    }
    componentWillMount(){
        this.getMaintenance();
        AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
    }

    handleAppStateChange = (nextAppState) =>{
        if (nextAppState === 'active') {
            this.getMaintenance();
        }
        this.setState({appState: nextAppState});
    }

    userLogin(e) {
        e.preventDefault();
        const { credentials } = this.state;
        const { errors } = this.validator;

        this.validator.validateAll(credentials)
            .then((success) => {
                if (success) {
                    this.props.onLogin(this.state.credentials.email, this.state.credentials.password);
                } else {
                    this.setState({ errors })
                }
            });

    }

    handleChange(name, value) {
        const { errors } = this.validator;

        this.setState({credentials: { ...this.state.credentials, [name]: value }});
        errors.remove(name);

        this.validator.validate(name, value)
            .then(() => {
                this.setState({ errors })
            })
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data != null){
            if (nextProps.requestType == 'login') {
                let token = nextProps.data.data.token_type + " " + nextProps.data.data.access_token;
                this.props.didLogin(this.state.email, this.state.password, token, nextProps.data.user.role, nextProps.data.user.id, nextProps.data.user.company, nextProps.data.user.name,nextProps.data.user.company_id);
            } else if(nextProps.requestType == "forgot_password"){
                setTimeout(() => {
                    Alert.alert(
                        I18n.t('auth.success'),
                        I18n.t('auth.success_dialog_message'),
                        [
                            {
                                text: I18n.t('common.ok'), onPress: () => {
                            }
                            }
                        ],
                        {cancelable: true}
                    );
                }, 100);
            } else if(nextProps.requestType== "get_maintenance_"+ this.state.getMaintenanceKey && nextProps.data.result == "success"){
                if(nextProps.data.maintenance == 'true'){
                    this.logout();
                }
                this.setState({maintenance: nextProps.data.maintenance});

            }
        }

        if (nextProps.error != undefined) {
            if (nextProps.requestType == 'login') {
                const { errors } = this.validator;
                if(nextProps.error.response.status === 422){
                    _.forOwn(nextProps.error.response.data.errors, (message, field) => {
                        errors.add(field, message);
                    });
                } else if(nextProps.error.response.status === 401) {
                    setTimeout(() => {
                        Alert.alert(
                            I18n.t('common.error'),
                            nextProps.error.response.data.message,
                            [
                                {
                                    text: I18n.t('common.ok'), onPress: () => {
                                }
                                }
                            ],
                            {cancelable: true}
                        )
                    }, 100);
                }
            } else {
                setTimeout(() => {
                    Alert.alert(
                        I18n.t('common.error'),
                        I18n.t('auth.email_does_not_exist'),
                        [
                            {
                                text: I18n.t('common.ok'), onPress: () => {
                            }
                            }
                        ],
                        {cancelable: true}
                    )
                }, 100);
            }
        }

    }


    render(){
        return (
            <Container>
                <View style={{flex: 1}}>
                    <Loader loading={this.props.isLoading}/>
                    {(() => {
                        if(this.state.maintenance =='true'){
                            return(
                                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                                    <Text style={{fontSize: 18, color: '#611f69', textAlign: 'center', marginTop : 80}}>{I18n.t('home.maintenance_now_site_will_be_online_asap')}</Text>
                                </View>
                            );
                        } else {
                            return (
                                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                                    <ScrollView style={containerStyle}>
                                        <View style={styles.imageLogoContainer}>
                                            <Image
                                                source={require('../../imgs/logo.png')}
                                                style={styles.imgLogo}
                                            />
                                        </View>
                                        <View style={{marginTop: 30}}>
                                            <View style={[this.state.errors.has('email') ? iconInvalidInputBox : iconInputBox]}>
                                                <TextInput
                                                        style={inputStyle}
                                                        placeholder={I18n.t('common.email')}
                                                        autoCapitalize='none'
                                                        autoCorrect={false}
                                                        autoFocus={true}
                                                        keyboardType='email-address'
                                                        value={this.state.credentials.email}
                                                        underlineColorAndroid='transparent'
                                                        onChangeText={(text) => this.handleChange("email", text)}/>
                                            </View>
                                            <View style = {[this.state.errors.has('email') ? invalidViewBox : hideViewBox ]}>
                                                <Text style={invalidFeedback}>{this.state.errors.first('email')}</Text>
                                            </View>


                                            <View style={[this.state.errors.has('password') ? iconInvalidInputBox : iconInputBox]}>
                                                <TextInput
                                                        style={inputStyle}
                                                        placeholder={I18n.t('common.password')}
                                                        autoCapitalize='none'
                                                        autoCorrect={false}
                                                        secureTextEntry={true}
                                                        value={this.state.credentials.password}
                                                        underlineColorAndroid='transparent'
                                                        onChangeText={(text) => this.handleChange("password", text)}/>
                                            </View>
                                            <View style = {[this.state.errors.has('password') ? invalidViewBox : hideViewBox ]}>
                                                <Text style={invalidFeedback}>{this.state.errors.first('password')}</Text>
                                            </View>


                                            <Text style={{ textAlign: 'right', marginTop: 20}}
                                                  onPress={() => this.setState({promptVisible: true})}>
                                                {I18n.t('header.forgot_password')}
                                            </Text>

                                            <View style={{margin: 15}}/>
                                            <TouchableOpacity
                                                    style={{backgroundColor: '#611f69',borderColor: '#601f80',  paddingTop: 15, paddingBottom: 15}}
                                                    onPress={(e) => this.userLogin(e)}
                                                    underlayColor='#fff'>
                                                <Text style={{color: '#fff', textAlign: 'center', fontSize: 18}}>{I18n.t('header.login')}</Text>
                                            </TouchableOpacity>


                                            <Text style={{ textAlign: 'center', marginTop: 30}}
                                                  onPress={() => this.props.navigation.navigate("Register")}>
                                                {I18n.t('header.don_not_have_an_account_sign_up')}
                                            </Text>

                                        </View>
                                        <DialogInput isDialogVisible={this.state.promptVisible}
                                                     title={I18n.t('header.forgot_password')}
                                                     message={"Please input your  email and submit."}
                                                     hintInput={I18n.t('common.email')}
                                                     submitInput={(inputText) => {
                                                         this.props.onForgotPassword(inputText);
                                                         this.setState({promptVisible: false});
                                                     }}
                                                     closeDialog={() => this.setState({promptVisible: false})}>
                                        </DialogInput>
                                    </ScrollView>
                                </View>
                            );
                        }
                    })()}

                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    imgLogo: {
        width: 100,
        height: 100,
        marginTop: 50
    },
    inputIcon: {
        width: 20,
        height: 30
    },
    imageLogoContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (email, password) => {
            dispatch(postRequest(Config.LOGIN_URL, {email: email, password: password}, 'login'));
        },
        didLogin: (email, password, authToken, role, userId, company, name, companyId) => {
            dispatch(login(email, password, authToken, role, userId, company, name, companyId));
        },
        onForgotPassword: (email) => {
            dispatch(postRequest(Config.FORGOT_PASSWORD_URL, {email: email}, 'forgot_password'))
        },
        getMaintenance : (getMaintenanceKey) => {
            dispatch(getRequest(Config.GET_MAINTENANCE_URL, 'get_maintenance_'+ getMaintenanceKey));
        },
        logout: () => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);