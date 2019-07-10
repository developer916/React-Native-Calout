import React, {Component} from 'react';
import {
    Button,
    Header,
    Left,
    Body,
    Right,
    Title,
    Form,
    Item,
    Container,
    Label,
    Text,
} from 'native-base';
import {connect} from 'react-redux';
import {ScrollView, View,TextInput, StyleSheet, Image, Dimensions, Alert,StatusBar, Platform} from 'react-native';
import Loader from '../../components/Loader';
import {postRequest} from "../../actions/Service";
import Config from 'react-native-config';
import {bgHeader, bgContainer,containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidLabel, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import ReeValidate from 'ree-validate';
import s from '../Style';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

let {height, width} = Dimensions.get('window');
import {logout} from "../../actions/auth";
import I18n  from '../../../i18n/i18n';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            current_password: 'required|min:6',
            password: 'required|min:6',
            password_confirmation: 'required|min:6'
        });

        this.state = {
            credentials: {
                current_password: '',
                password: '',
                password_confirmation: '',
            },
            isSubmitted: false,
            passwordKey: 0,
            errors: this.validator.errors,
            fields: this.validator.fields
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount(){
        this.setState({passwordKey: Math.floor(Math.random() * 100000)});
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

    handleSubmit(e) {
        e.preventDefault()
        const {credentials} = this.state;
        const {errors} = this.validator;
        this.validator.validateAll(credentials)
        .then((success) => {
            if (success) {
                this.props.onUpdatePassword(this.state.credentials.current_password, this.state.credentials.password, this.state.credentials.password_confirmation, this.state.passwordKey);
            } else {
                this.setState({errors})
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data != null){
            if (nextProps.requestType == 'update_password_'+this.state.passwordKey) {
                setTimeout(() => {
                    Alert.alert(
                        I18n.t('auth.success'),
                        I18n.t('settings.password_updated_successfully'),
                        [
                            {
                                text: I18n.t('common.ok'), onPress: () => {
                                this.props.navigation.navigate("Settings");
                            }
                            }
                        ],
                        {cancelable: false}
                    )
                }, 100);
            }
        }

        if (nextProps.error != undefined) {
            if (nextProps.requestType == 'update_password_'+this.state.passwordKey) {
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
                            [
                                {
                                    text: I18n.t('common.ok'), onPress: () => { this.props.logout();}
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

    render(){
        return(
            <Container>
                <View style={{flex: 1}}>
                    <Loader loading={this.props.isLoading}/>
                    <ScrollView >
                        {(() => {
                            if (!this.state.isSubmitted) {
                                return (
                                    <View style={{margin: 20}}>
                                        <Form>
                                            <Item style={{marginLeft: 0 }} stackedLabel>
                                                <Label style = {[this.state.errors.has('current_password') ? invalidLabel : '' ]}>{I18n.t('settings.current_password')}</Label>
                                                <TextInput
                                                    style={[inputStyle, {width: '100%'}]}
                                                    autoCapitalize='none'
                                                    autoCorrect={false}
                                                    secureTextEntry={true}
                                                    value={this.state.credentials.current_password}
                                                    underlineColorAndroid='transparent'
                                                    onChangeText={(text) => this.handleChange("current_password", text)}/>

                                            </Item>

                                            <View style = {[this.state.errors.has('current_password') ? invalidViewBox : hideViewBox ]}>
                                                <Text style={invalidFeedback}>{this.state.errors.first('current_password')}</Text>
                                            </View>

                                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                                <Label style = {[this.state.errors.has('password') ? invalidLabel : '' ]}>{I18n.t('settings.new_password')}</Label>
                                                <TextInput
                                                    style={[inputStyle, {width: '100%'}]}
                                                    autoCapitalize='none'
                                                    autoCorrect={false}
                                                    secureTextEntry={true}
                                                    value={this.state.credentials.password}
                                                    underlineColorAndroid='transparent'
                                                    onChangeText={(text) => this.handleChange("password", text)}/>
                                            </Item>

                                            <View style = {[this.state.errors.has('password') ? invalidViewBox : hideViewBox ]}>
                                                <Text style={invalidFeedback}>{this.state.errors.first('password')}</Text>
                                            </View>

                                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                                <Label style = {[this.state.errors.has('password_confirmation') ? invalidLabel : '' ]}>{I18n.t('settings.confirm_new_password')}</Label>
                                                <TextInput
                                                    style={[inputStyle, {width: '100%'}]}
                                                    autoCapitalize='none'
                                                    autoCorrect={false}
                                                    secureTextEntry={true}
                                                    value={this.state.credentials.password_confirmation}
                                                    underlineColorAndroid='transparent'
                                                    onChangeText={(text) => this.handleChange("password_confirmation", text)}/>
                                            </Item>

                                            <View style = {[this.state.errors.has('password_confirmation') ? invalidViewBox : hideViewBox ]}>
                                                <Text style={invalidFeedback}>{this.state.errors.first('password_confirmation')}</Text>
                                            </View>

                                            <Button block style={{backgroundColor: bgHeader, marginTop: 20, marginBottom: 50, color: '#fff'}}
                                                    success onPress={(e) => this.handleSubmit(e)}>
                                                <Text>{I18n.t('common.submit')}</Text>
                                            </Button>

                                        </Form>
                                    </View>
                                );
                            }
                        })()}
                    </ScrollView>
                </View>
            </Container>
        );
    }
}
ChangePassword.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 230, color: '#fff'}}>{I18n.t('settings.change_password')}</Title>
            </Body>
            <Right>
                <Button transparent onPress={() => navigation.navigate("Dashboard")}>
                    <Icon name="md-home" style={s.menuIcon}/>
                </Button>
            </Right>
            <StatusBar
                    barStyle="light-content"
                    hidden = { false }
                    backgroundColor = "#611f69"
                    translucent = {true}
                    networkActivityIndicatorVisible={true}
            />
        </Header>
    )
});

const mapStateToProps = (state, ownProps) => {
    return {
        role: state.auth.role,
        name: state.auth.name,
        companyId: state.auth.companyId,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUpdatePassword: (current_password, password, password_confirmation, passwordKey) => {
            dispatch(postRequest(Config.UPDATE_PASSWORD_URL, {current_password: current_password, password: password, password_confirmation: password_confirmation}, 'update_password_'+passwordKey));
        },
        logout: () => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);