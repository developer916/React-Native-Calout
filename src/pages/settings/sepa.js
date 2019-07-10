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
import {ScrollView,  TextInput, View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert,StatusBar, Platform} from 'react-native';
import Loader from '../../components/Loader';
import {store_sepa} from '../../actions/auth';
import {postRequest} from "../../actions/Service";
import Config from 'react-native-config';
import {bgHeader, invalidLabel, bgContainer,containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import ReeValidate from 'ree-validate';
import _ from 'lodash';
import s from '../Style';
import Icon from 'react-native-vector-icons/Ionicons';
import {logout} from "../../actions/auth";
import I18n  from '../../../i18n/i18n';

class CompanySepa extends Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            userId: 'required',
            iban: 'required',
            bic: 'required',
        });

        this.state = {
            credentials: {
                userId: this.props.userId,
                iban: '',
                bic: '',
            },
            sepaKey : 0,
            errors: this.validator.errors,
            fields: this.validator.fields
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.props.getCompany(this.props.companyId);
        this.setState({sepaKey: Math.floor(Math.random() * 100000)});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            if(nextProps.requestType == 'get_company'){
                if(nextProps.data.status =='success'){
                    this.setState({credentials:{
                            iban : nextProps.data.company.iban,
                            bic : nextProps.data.company.bic,
                        }
                    });
                }
            }
            if (nextProps.requestType == 'update_sepa_'+this.state.sepaKey) {
                if(nextProps.data.status =='success') {
                    setTimeout(() => {
                        Alert.alert(
                            I18n.t('auth.success'),
                            I18n.t('settings.sepa_update_successfully'),
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
                    this.props.onStoreSepa(this.props.userId, this.state.credentials.iban, this.state.credentials.bic, this.state.sepaKey);
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
                                <Label style = {[this.state.errors.has('iban') ? invalidLabel : '' ]}>{I18n.t('auth.iban')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('auth.iban')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={true}
                                        keyboardType='default'
                                        value={this.state.credentials.iban}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("iban", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('iban') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('iban')}</Text>
                            </View>

                            <Item style={{marginLeft: 0}} stackedLabel>
                                <Label style = {[this.state.errors.has('bic') ? invalidLabel : '' ]}>{I18n.t('auth.bic')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('auth.bic')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.bic}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("bic", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('bic') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('bic')}</Text>
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

CompanySepa.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 230, color: '#fff'}}>{I18n.t('common.sepa_of_company')}</Title>
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
        onStoreSepa:( userId, iban, bic, sepaKey) =>{
            let data = {
                user_id: userId,
                iban: iban,
                bic: bic,
                update_sepa: 1
            };
            dispatch(postRequest(Config.COMPANY_SEPA_URL, data, 'update_sepa_'+sepaKey));
        },
        logout: () => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanySepa);