import React, {Component} from 'react';
import {
    Container,
    Content,
} from 'native-base';
import {connect} from 'react-redux';
import {ScrollView, Text, TextInput, View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Platform} from 'react-native';
import Loader from '../../components/Loader';
import {store_company} from '../../actions/auth';
import {postRequest} from "../../actions/Service";
import Config from 'react-native-config';
import {containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import ReeValidate from 'ree-validate';
import _ from 'lodash';
import I18n  from '../../../i18n/i18n';
let {height, width} = Dimensions.get('window');


class Address extends Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            userId: 'required',
            name: 'required',
            street: 'required',
            postalCode: 'required|min:5',
            city: 'required|min:2',
            country: 'required|min:2',
            phone: 'required|min:10',
            email: 'email',
            website: 'url',
        });

        this.state = {
            credentials: {
                userId: this.props.userId,
                name: '',
                street: '',
                postalCode: '',
                city: '',
                country: '',
                phone: '',
                email: '',
                website: '',
                taxId: '',
                description: '',
            },
            errors: this.validator.errors,
            fields: this.validator.fields
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        if(this.props.userId  == ''){
            this.props.navigation.navigate("Register");
        }
        if(this.props.companyId){
            this.props.navigation.navigate("Sepa");
        }
    }

    handleDescChange(value) {
        this.setState({credentials: { ...this.state.credentials, description: value }})
    }

    // event to handle input change
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
                        this.props.onStoreCompany(this.state.credentials.userId, this.state.credentials.name, this.state.credentials.street, this.state.credentials.postalCode,
                                this.state.credentials.city, this.state.credentials.country,this.state.credentials.phone, this.state.credentials.email,
                                this.state.credentials.website, this.state.credentials.taxId, this.state.credentials.description
                        );
                    } else {
                        this.setState({ errors })
                    }
                });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.companyId){
            this.props.navigation.navigate("Sepa");
        }
        if(nextProps.data != null) {
            if (nextProps.requestType == 'store_company') {
                this.props.didStoreCompany(nextProps.data.company, nextProps.data.company.id);
            }
        }
        if (nextProps.error != undefined) {
            if (nextProps.requestType == 'store_company') {
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

    render() {

        return (
            <Container>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                    <Loader loading={this.props.isLoading}/>
                    <ScrollView style={containerStyle}>
                        <View style={{marginTop: 20}}>
                            <Text style={{fontSize:20, marginBottom:20}}> {I18n.t('common.address_of_company')}</Text>
                            <View style={[this.state.errors.has('name') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.name_of_company')}
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

                            <View style={[this.state.errors.has('street') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.street_name_and_number')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.street}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("street", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('street') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('street')}</Text>
                            </View>

                            <View style={[this.state.errors.has('postalCode') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.postal_code')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.postalCode}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("postalCode", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('postalCode') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('postalCode')}</Text>
                            </View>

                            <View style={[this.state.errors.has('city') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.city')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.city}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("city", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('city') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('city')}</Text>
                            </View>

                            <View style={[this.state.errors.has('country') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.country')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.country}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("country", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('country') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('country')}</Text>
                            </View>

                            <View style={[this.state.errors.has('phone') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.phone_number')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='numeric'
                                        value={this.state.credentials.phone}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("phone", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('phone') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('phone')}</Text>
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
                                        onChangeText={(txt) =>this.handleChange("email", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('email') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('email')}</Text>
                            </View>

                            <View style={[this.state.errors.has('website') ? iconInvalidInputBox : iconInputBox]}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.website_url')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.website}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("website", txt)}/>
                            </View>
                            <View style = {[this.state.errors.has('website') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('website')}</Text>
                            </View>

                            <View style={iconInputBox}>
                                <TextInput
                                        style={inputStyle}
                                        placeholder={I18n.t('auth.tax_id')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.taxId}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.setState({credentials: { ...this.state.credentials, ["taxId"]: txt }})}/>

                            </View>

                            <View style={styles.textAreaContainer} >
                                <TextInput
                                        style={styles.textArea}
                                        underlineColorAndroid="transparent"
                                        placeholder={I18n.t('common.description')}
                                        placeholderTextColor="grey"
                                        numberOfLines={5}
                                        multiline={true}
                                        value={this.state.credentials.description}
                                        onChangeText={(txt) =>this.setState({credentials: { ...this.state.credentials, ["description"]: txt }})}
                                />
                            </View>
                            <TouchableOpacity
                                    style={{backgroundColor: '#611f69',borderColor: '#601f80',  paddingTop: 15, paddingBottom: 15, marginTop: 15, marginBottom: 40}}
                                    onPress={(e) => this.handleSubmit(e)}
                                    underlayColor='#fff'>
                                <Text style={{color: '#fff', textAlign: 'center', fontSize: 18}}>{I18n.t('auth.store_information')} </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Container>
        );

    }
}
const styles = StyleSheet.create({
    textAreaContainer: {
        borderColor: "#eee",
        borderBottomWidth: 1,
        padding: 5,
        marginBottom:10
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top'
    }
});
const mapStateToProps = (state, ownProps) => {
    return {
        userId : state.auth.userId,
        companyId: state.auth.companyId,
        company: state.auth.company,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onStoreCompany: (userId, name, street, postalCode, city, country, phone, email, website, tax_id, description) => {
            dispatch(postRequest(Config.COMPANY_ADDRESS_URL, {user_id: userId, name: name, street: street, postal_code: postalCode, city: city, country: country, phone: phone, email:email, website: website, tax_id: tax_id, description: description}, 'store_company'));
        },
        didStoreCompany:(company, companyId) => {
            dispatch(store_company(company, companyId));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Address);