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
import {ScrollView,  TextInput, View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Platform,StatusBar} from 'react-native';
import Loader from '../../components/Loader';
import {postRequest} from "../../actions/Service";
import Config from 'react-native-config';
import {bgHeader, invalidLabel, bgContainer,containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import ReeValidate from 'ree-validate';
import _ from 'lodash';
import s from '../Style';
import Icon from 'react-native-vector-icons/Ionicons';
let {height, width} = Dimensions.get('window');
import {logout} from "../../actions/auth";
import I18n  from '../../../i18n/i18n';

class CompanyAddress extends Component {
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
            addressKey : 0,
            errors: this.validator.errors,
            fields: this.validator.fields
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.props.getCompany(this.props.companyId);
        this.setState({addressKey: Math.floor(Math.random() * 100000)});
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
                this.props.onStoreCompany(this.props.userId, this.state.credentials.name, this.state.credentials.street, this.state.credentials.postalCode,
                        this.state.credentials.city, this.state.credentials.country,this.state.credentials.phone, this.state.credentials.email,
                        this.state.credentials.website, this.state.credentials.taxId, this.state.credentials.description, this.state.addressKey
                );
            } else {
                this.setState({ errors })
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data != null) {
            if (nextProps.requestType == 'update_company_'+this.state.addressKey) {
                setTimeout(() => {
                    Alert.alert(
                        I18n.t('auth.success'),
                        I18n.t('settings.company_address_updated_successfully'),
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
            if(nextProps.requestType == 'get_company'){
                if(nextProps.data.status =='success'){
                    this.setState({credentials:{
                        name : nextProps.data.company.name,
                        street : nextProps.data.company.street,
                        postalCode : nextProps.data.company.postal_code,
                        city: nextProps.data.company.city,
                        country : nextProps.data.company.country,
                        phone : nextProps.data.company.phone,
                        email : nextProps.data.company.email,
                        website : nextProps.data.company.website,
                        taxId : nextProps.data.company.tax_id,
                        description : nextProps.data.company.description,
                    }
                    });
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
                                text: I18n.t('common.ok'), onPress: () => {this.props.logout()}
                            }
                        ],
                        {cancelable: false}
                    )
                }, 100);
            }
            this.setState({ errors })
        }
    }
    render() {
        return (
            <Container>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                    <Loader loading={this.props.isLoading}/>
                    <ScrollView style={containerStyle}>
                        <View>
                            <Item style={{marginLeft: 0}} stackedLabel>
                                <Label style = {[this.state.errors.has('name') ? invalidLabel : '' ]}>{I18n.t('auth.name_of_company')}</Label>
                                <TextInput
                                    style={[inputStyle, {width: '100%'}]}
                                    placeholder={I18n.t('auth.name_of_company')}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    autoFocus={true}
                                    keyboardType='default'
                                    value={this.state.credentials.name}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(txt) =>this.handleChange("name", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('name') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('name')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                <Label style = {[this.state.errors.has('street') ? invalidLabel : '' ]}>{I18n.t('auth.street_name_and_number')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('auth.street_name_and_number')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.street}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("street", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('street') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('street')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                <Label style = {[this.state.errors.has('postalCode') ? invalidLabel : '' ]}>{I18n.t('auth.postal_code')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('auth.postal_code')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.postalCode}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("postalCode", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('postalCode') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('postalCode')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                <Label style = {[this.state.errors.has('city') ? invalidLabel : '' ]}>{I18n.t('auth.city')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('auth.city')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.city}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("city", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('city') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('city')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                <Label style = {[this.state.errors.has('country') ? invalidLabel : '' ]}>{I18n.t('auth.country')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('auth.country')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.country}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("country", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('country') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('country')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                <Label style = {[this.state.errors.has('phone') ? invalidLabel : '' ]}>{I18n.t('auth.phone_number')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('auth.phone_number')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='numeric'
                                        value={this.state.credentials.phone}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("phone", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('phone') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('phone')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                <Label style = {[this.state.errors.has('email') ? invalidLabel : '' ]}>{I18n.t('common.email')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('common.email')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='email-address'
                                        value={this.state.credentials.email}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("email", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('email') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('email')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                <Label style = {[this.state.errors.has('website') ? invalidLabel : '' ]}>{I18n.t('auth.website_url')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('auth.website_url')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.website}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.handleChange("website", txt)}/>
                            </Item>
                            <View style = {[this.state.errors.has('website') ? invalidViewBox : hideViewBox ]}>
                                <Text style={invalidFeedback}>{this.state.errors.first('website')}</Text>
                            </View>

                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                <Label style = {[this.state.errors.has('taxId') ? invalidLabel : '' ]}>{I18n.t('auth.tax_id')}</Label>
                                <TextInput
                                        style={[inputStyle, {width: '100%'}]}
                                        placeholder={I18n.t('auth.tax_id')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={false}
                                        keyboardType='default'
                                        value={this.state.credentials.taxId}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(txt) =>this.setState({credentials: { ...this.state.credentials, ["taxId"]: txt }})}/>

                            </Item>

                            <Item style={{marginLeft: 0 , marginTop: 20}} stackedLabel>
                                <Label >{I18n.t('common.description')}</Label>
                                <TextInput
                                        style={[styles.textArea, {width: '100%'}]}
                                        underlineColorAndroid="transparent"
                                        placeholder={I18n.t('common.description')}
                                        placeholderTextColor="grey"
                                        numberOfLines={5}
                                        multiline={true}
                                        value={this.state.credentials.description}
                                        onChangeText={(txt) =>this.setState({credentials: { ...this.state.credentials, ["description"]: txt }})}
                                />
                            </Item>
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

CompanyAddress.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 230, color: '#fff'}}>{I18n.t('menu.company_address')}</Title>
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
        role:  state.auth.role,
        userId : state.auth.userId,
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
        onStoreCompany: (userId, name, street, postalCode, city, country, phone, email, website, tax_id, description, addressKey) => {
            dispatch(postRequest(Config.COMPANY_ADDRESS_URL, {user_id: userId, name: name, street: street, postal_code: postalCode, city: city, country: country, phone: phone, email:email, website: website, tax_id: tax_id, description: description}, 'update_company_'+addressKey));
        },
        getCompany: (company_id) => {
            dispatch(postRequest(Config.GET_COMPANY_URL, {company_id: company_id}, 'get_company'))
        },
        logout: () => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyAddress);