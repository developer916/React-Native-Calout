import React, {Component} from 'react';
import {
    Container,
    Content,
} from 'native-base';
import {connect} from 'react-redux';
import {ScrollView, Text, TextInput, View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Platform} from 'react-native';
import Loader from '../../components/Loader';
import {store_sepa} from '../../actions/auth';
import {postRequest} from "../../actions/Service";
import Config from 'react-native-config';
import {containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import ReeValidate from 'ree-validate';
import _ from 'lodash';
import I18n  from '../../../i18n/i18n';

class Sepa extends Component {

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
            errors: this.validator.errors,
            fields: this.validator.fields
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        if(this.props.userId != ''){
             if(this.props.companyId == ''){
                 this.props.navigation.navigate("Address");
             }
        } else{
            this.props.navigation.navigate("Register");
        }

        if(this.props.confirmationLink){
            this.props.navigation.navigate("Confirm");
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
                    this.props.onStoreSepa(this.state.credentials.userId, this.state.credentials.iban, this.state.credentials.bic);
                } else {
                    this.setState({ errors })
                }
            })
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.confirmationLink){
            this.props.navigation.navigate("RegisterConfirm");
        }
        if(nextProps.data != null) {
            if (nextProps.requestType == 'store_sepa') {
                this.props.didStoreSepa(nextProps.data.confirmationLink);
                this.props.navigation.navigate("Confirm");
            }
        }
        if (nextProps.error != undefined) {
            if (nextProps.requestType == 'store_sepa') {
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
                                    text: I18n.t('common.ok'), onPress: () => {this.props.navigation.navigate("Login"); }
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

    render() {
        return (
            <Container>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                    <Loader loading={this.props.isLoading}/>
                    <ScrollView style={containerStyle}>
                        <View style={{marginTop: 20}}>
                            <Text style={{fontSize:20, marginBottom:40}}>{I18n.t('common.sepa_of_company')}</Text>
                            <View style={[this.state.errors.has('iban') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.iban')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={true}
                                        keyboardType='default'
                                        value={this.state.credentials.iban}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("iban", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('iban') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('iban')}</Text>
                            </View>

                            <View style={[this.state.errors.has('bic') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.bic')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.bic}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("bic", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('bic') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('bic')}</Text>
                            </View>

                            <TouchableOpacity
                                    style={{backgroundColor: '#611f69',borderColor: '#601f80',  paddingTop: 15, paddingBottom: 15, marginTop: 15, marginBottom: 40}}
                                    onPress={(e) => this.handleSubmit(e)}
                                    underlayColor='#fff'>
                                <Text style={{color: '#fff', textAlign: 'center', fontSize: 18}}>{I18n.t('auth.store_sepa')}</Text>
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
        onStoreSepa:( userId, iban, bic) =>{
            dispatch(postRequest(Config.COMPANY_SEPA_URL, {user_id: userId, iban: iban, bic: bic}, 'store_sepa'));
        },
        didStoreSepa: (confirmationLink) =>{
            dispatch(store_sepa(confirmationLink));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Sepa);