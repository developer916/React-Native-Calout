import React, {Component} from 'react';
import {
    Container,
    Content,
} from 'native-base';
import {connect} from 'react-redux';
import {ScrollView, Text, TextInput, View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Platform} from 'react-native';
import Loader from '../../components/Loader';
import {register} from '../../actions/auth';
import {postRequest} from "../../actions/Service";
import Config from 'react-native-config';
import {containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import ReeValidate from 'ree-validate';
import _ from 'lodash';
import I18n  from '../../../i18n/i18n';
let {height, width} = Dimensions.get('window');

class Register extends Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            name: 'required|min:6',
            email: 'required|email',
            password: 'required|min:6',
            password_confirmation: 'required|min:6'
        });

        this.state = {
            credentials: {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            },
            errors: this.validator.errors,
            fields: this.validator.fields
        };
        this.handleChange = this.handleChange.bind(this);
        if(this.props.userId){
            this.props.navigation.navigate("Address");
        }
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
        if(nextProps.userId){
            this.props.navigation.navigate("Address");
        }
        if(nextProps.data != null){
            if (nextProps.requestType == 'register') {
                this.props.didRegister(this.state.credentials.name,this.state.credentials.email, this.state.credentials.password, nextProps.data.user.id);

            }
        }
        if (nextProps.error != undefined) {
            if (nextProps.requestType == 'register') {
                const { errors } = this.validator;
                if(nextProps.error.response.status === 422){
                    _.forOwn(nextProps.error.response.data.errors, (message, field) => {
                        errors.add(field, message);
                    });
                } else if(nextProps.error.response.status === 401){
                    setTimeout(() => {
                        Alert.alert(
                            I18n.t('common.error'),
                            I18n.t('common.unauthorized'),
//                                nextProps.error.response.data.message,
                            [
                                {
                                    text: I18n.t('common.ok'), onPress: () => { this.props.navigation.navigate("Login"); }
                                }
                            ],
                            {cancelable: false}
                        )
                    }, 100);
                }
                this.setState({ errors })
            }
        }
    }

    userRegister(e) {
        e.preventDefault();
        const { credentials } = this.state;
        const { errors } = this.validator;

        this.validator.validateAll(credentials)
        .then((success) => {
            if (success) {
                this.props.onRegister(this.state.credentials.name, this.state.credentials.email, this.state.credentials.password, this.state.credentials.password_confirmation);
            } else {
                this.setState({ errors })
            }
        })
    }
    render() {
        return (
            <Container>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                    <Loader loading={this.props.isLoading}/>
                    <ScrollView style={containerStyle}>
                        <View style={{marginTop: 20}}>
                            <Text style={{fontSize:20, marginBottom:20}}> {I18n.t('auth.create_your_company_account')}</Text>
                            <View style={[this.state.errors.has('name') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.user_name')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={true}
                                        keyboardType='default'
                                        value={this.state.credentials.name}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("name", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('name') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('name')}</Text>
                            </View>

                            <View style={[this.state.errors.has('email') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('common.email')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
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

                            <View style={[this.state.errors.has('password_confirmation') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('common.confirm_password')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        secureTextEntry={true}
                                        value={this.state.credentials.password_confirmation}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => this.handleChange("password_confirmation", text)}/>
                            </View>
                            <View style = {[this.state.errors.has('password_confirmation') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('password_confirmation')}</Text>
                            </View>

                            <TouchableOpacity
                                    style={{backgroundColor: '#611f69',borderColor: '#601f80',  paddingTop: 15, paddingBottom: 15, marginTop: 15}}
                                    onPress={(e) => this.userRegister(e)}
                                    underlayColor='#fff'>
                                <Text style={{color: '#fff', textAlign: 'center', fontSize: 18}}> {I18n.t('auth.create_account')}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Container>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        userId : state.auth.userId,
        company: state.auth.company,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRegister: (name, email, password, password_confirmation) => {
            dispatch(postRequest(Config.REGISTER_URL, {name: name, email: email, password: password, password_confirmation: password_confirmation}, 'register'));
        },
        didRegister:(name, email,password, userId) => {
            dispatch(register(name, email, password,   userId));
        }

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);

