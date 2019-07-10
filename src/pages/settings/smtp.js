import React, {Component} from 'react';
import {
    Button,
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Title,
    Text,
    Item,
    Label,
} from 'native-base';
import {connect} from 'react-redux';
import {ScrollView,  TextInput, View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, StatusBar,Platform} from 'react-native';
import Loader from '../../components/Loader';
import {postRequest} from "../../actions/Service";
import Config from 'react-native-config';
import {bgHeader, invalidLabel, bgContainer,containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import ReeValidate from 'ree-validate';
import _ from 'lodash';
import s from '../Style';
import Icon from 'react-native-vector-icons/Ionicons';
import {logout} from "../../actions/auth";
import I18n  from '../../../i18n/i18n';


class CompanySMTP extends Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            userId: 'required',
            server: 'required',
            user: 'required',
            password: 'required',
            email: 'required|email',
        });

        this.state = {
            credentials: {
                userId: this.props.userId,
                server: '',
                user: '',
                password: '',
                email:''
            },
            smtp_key : 0,
            errors: this.validator.errors,
            fields: this.validator.fields
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.props.getCompany(this.props.companyId);
        this.setState({smtp_key: Math.floor(Math.random() * 100000)});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            if(nextProps.requestType == 'get_company'){
                if(nextProps.data.status =='success'){
                    this.setState({credentials:{
                        server : nextProps.data.company.smtp_server,
                        user : nextProps.data.company.smtp_user,
                        password: nextProps.data.company.smtp_password,
                        email: nextProps.data.company.smtp_from_email,
                    }
                    });
                }
            }
            if (nextProps.requestType == 'update_smtp_'+this.state.smtp_key) {
                if(nextProps.data.status =='success') {
                    setTimeout(() => {
                        Alert.alert(
                            I18n.t('auth.success'),
                            I18n.t('settings.smtp_updated_successfully'),
                            [
                                {
                                    text: I18n.t('common.ok'), onPress: () => {
                                    this.props.navigation.navigate("Settings")
                                }
                                }
                            ],
                            {cancelable: false}
                        )
                    }, 100);
                }

            }
        }

        if (nextProps.error != undefined) {
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
        e.preventDefault();
        const { credentials } = this.state;
        const { errors } = this.validator;
        this.validator.validateAll(credentials)
                .then((success) => {
                    if (success) {
                        this.props.onStoreSMTP(this.state.credentials.server, this.state.credentials.user, this.state.credentials.password,this.state.credentials.email, this.state.smtp_key  );
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
                        <View>
                            <Item style={{marginLeft: 0}} stackedLabel>
                                <Label style = {[this.state.errors.has('server') ? invalidLabel : '' ]}>{I18n.t('settings.smtp_server')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('settings.smtp_server')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={true}
                                        keyboardType='default'
                                        value={this.state.credentials.server}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("server", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('server') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('server')}</Text>
                            </View>

                            <Item style={{marginLeft: 0}} stackedLabel>
                                <Label style = {[this.state.errors.has('user') ? invalidLabel : '' ]}>{I18n.t('settings.smtp_user')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('settings.smtp_user')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.user}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("user", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('user') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('user')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 }} stackedLabel>
                                <Label style = {[this.state.errors.has('password') ? invalidLabel : '' ]}>{I18n.t('settings.smtp_password')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('settings.smtp_password')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        value={this.state.credentials.password}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => this.handleChange("password", text)}/>

                            </Item>

                            <View style = {[this.state.errors.has('password') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('password')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 }} stackedLabel>
                                <Label style = {[this.state.errors.has('email') ? invalidLabel : '' ]}>{I18n.t('settings.smtp_from_email')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('settings.smtp_from_email')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='email-address'
                                        value={this.state.credentials.email}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => this.handleChange("email", text)}/>
                            </Item>

                            <View style = {[this.state.errors.has('email') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('email')}</Text>
                            </View>



                            <Button block style={{backgroundColor: bgHeader, marginTop: 20, marginBottom: 50, color: '#fff'}}
                                    success onPress={(e) => this.handleSubmit(e)}>
                                <Text>{I18n.t('common.submit')}</Text>
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            </Container>
        );
    }
}

CompanySMTP.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 230, color: '#fff'}}>{I18n.t('settings.smtp_setting')}</Title>
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
        userId : state.auth.userId,
        companyId: state.auth.companyId,
        confirmationLink: state.auth.confirmationLink,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCompany: (company_id) => {
            dispatch(postRequest(Config.GET_COMPANY_URL, {company_id: company_id}, 'get_company'))
        },
        onStoreSMTP:( server, user, password, email, smtp_key) =>{
            dispatch(postRequest(Config.SET_SMTP_URL, {smtp_server: server, smtp_user: user, smtp_password: password, smtp_from_email: email}, 'update_smtp_'+smtp_key));
        },
        logout: () => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanySMTP);