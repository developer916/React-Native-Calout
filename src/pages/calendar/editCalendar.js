import React, {Component} from 'react';
import Loader from '../../components/Loader';
import {
    Button,
    Header,
    Left,
    Body,
    Right,
    Title,
    Text,
    Form,
    Item,
    Container,
    Input,
    Label,
} from 'native-base';
import {
    View,
    Image,
    Platform,
    StyleSheet,
    Alert,
    StatusBar,
    ScrollView
} from 'react-native';
import {bgHeader, bgContainer,invalidLabel, containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import {connect} from 'react-redux';
import {formRequest, postRequest} from "../../actions/Service";
import Config from 'react-native-config';
import s from '../Style';
import Icon from 'react-native-vector-icons/Ionicons';
import ReeValidate from 'ree-validate';
import _ from 'lodash';
import { CheckBox } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker'
import {logout} from "../../actions/auth";
import I18n  from '../../../i18n/i18n';

class EditCalendar extends Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            name: 'required',
            description: 'required'
        });

        this.state = {
            calendar: {
                company_id: this.props.companyId,
                name: '',
                description: '',
                is_private: false,
                is_email_necessary: false,
                is_offline: false,
                background: ''
            },
            isRendering: true,
            isSubmitted: false,
            photo: '',
            previous_page : '',
            calendar_id : 0,
            errors: this.validator.errors,
            toCalendars: false,
            editCalendarKey : 0,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount(){
        let calendar_id  =this.props.navigation.getParam('calendar_id', 0);
        this.setState({calendar_id: calendar_id});
        if(calendar_id != 0){
            this.setState({isRendering: true});
            this.props.getCalendar(calendar_id);
        }
        this.setState({editCalendarKey: Math.floor(Math.random() * 100000)});

    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data != null) {
            if (nextProps.requestType == 'update_calendar_'+this.state.editCalendarKey) {
                if(nextProps.data.status == "success") {
                    setTimeout(() => {
                        Alert.alert(
                            I18n.t('auth.success'),
                            I18n.t('calendars.calendar_updated_successfully'),
                            [
                                {
                                    text: I18n.t('common.ok'), onPress: () => {
                                    this.redirectPage()
                                }
                                }
                            ],
                            {cancelable: false}
                        )
                    }, 100);

                } else {
                    setTimeout(() => {
                        Alert.alert(
                            I18n.t('common.error'),
                            nextProps.data.message,
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
            if(nextProps.requestType == "get_calendar" && nextProps.data.status == "success"){
                let is_private = false;
                let is_email_necessary = false;
                let is_offline = false;
                if(nextProps.data.calendar.public === false || nextProps.data.calendar.public === 'false'){
                    is_private = false;
                } else {
                    is_private = true;
                }
                if(nextProps.data.calendar.not === false || nextProps.data.calendar.not === 'false'){
                    is_email_necessary = false;
                } else {
                    is_email_necessary = true;
                }
                if(nextProps.data.calendar.status === false || nextProps.data.calendar.status === 'false'){
                    is_offline = false;
                } else {
                    is_offline = true;
                }

                this.setState({calendar:{
                        name : nextProps.data.calendar.name,
                        description : nextProps.data.calendar.description,
                        is_private : is_private,
                        is_email_necessary: is_email_necessary,
                        is_offline : is_offline,
                        background : nextProps.data.calendar.picture
                    }
                });
            }
        }
        if (nextProps.error != undefined) {
            if (nextProps.requestType == 'update_calendar_'+ this.state.editCalendarKey || nextProps.requestType == 'get_calendar') {
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
    }
    redirectPage(){
        if(this.state.previous_page === "dashboard"){
            this.props.navigation.navigate("Dashboard");
        } else {
            this.props.navigation.navigate("Calendars");
        }
    }
    handleChange(name, value) {
        const {errors} = this.validator;

        this.setState({calendar: {...this.state.calendar, [name]: value}});
        errors.remove(name);

        if (name === 'name'  || name === 'description') {
            this.validator.validate(name, value)
                    .then(() => {
                        this.setState({errors})
                    })
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        const {calendar} = this.state;
        const {errors} = this.validator;
        this.validator.validateAll(calendar)
                .then((success) => {
                    if (success) {
                        this.updateCalendar();
                    } else {
                        this.setState({errors})
                    }
                })
    }

    handleChoosePhoto = () => {
//        const options = {
//            noData: true,
//        }
//        ImagePicker.launchImageLibrary(options, response => {
//            if (response.uri) {
//                this.setState({ photo: response })
//            }
//        })
        var options = {
            title: 'Select Image',
            customButtons: [ ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                let source = response;

                if(source.fileSize > 5242880){
                    const { errors } = this.validator;
                    errors.add('image', 'The image may not be greater than 5120 kilobytes');
                    this.setState({errors});

                    return;
                } else {
                    const { errors } = this.validator;
                    if(errors.items.length >0){
                        for(var i =0; i<errors.items.length; i++){
                            if(errors.items[i].field == "image"){
                                errors.items.splice(i, 1);
                            }
                        }
                        this.setState({ errors })
                    }

                    this.setState({
                        photo: source,
                    });
                }
            }
        });
    }

    updateCalendar(){
        const data = new FormData();
        data.append('company_id', this.props.companyId);
        data.append('calendar_id', this.state.calendar_id)
        data.append('name', this.state.calendar.name);
        data.append('description', this.state.calendar.description);
        if(this.state.photo != ''){
            data.append("image", {
                name: this.state.photo.fileName,
                type: this.state.photo.type,
                uri: Platform.OS === "android" ? this.state.photo.uri : this.state.photo.uri.replace("file://", "")
            });
        }

        data.append('public', this.state.calendar.is_private);
        data.append('status', this.state.calendar.is_offline);
        data.append('not', this.state.calendar.is_email_necessary);

        this.props.onStoreCalendar(data, this.state.editCalendarKey);
    }

    render() {
        return(
            <Container style={{backgroundColor: bgContainer}}>
                {(() => {
                    if (this.state.previous_page === 'dashboard') {
                        return (
                            <Header style={s.menuHeader}>
                                <Left>
                                    <Button transparent
                                            onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                                        <Icon name="md-menu" style={s.menuIcon}/>
                                    </Button>
                                </Left>
                                <Body>
                                <Title style={{color: '#ffffff', width: 200}}>{I18n.t('calendars.edit_calendar')}</Title>
                                </Body>
                                <Right>
                                    <Button transparent
                                            onPress={() => this.props.navigation.navigate("Dashboard")}>
                                        <Icon name="md-home" style={s.menuIcon}/>
                                    </Button>
                                </Right>
                            </Header>
                        );
                    }
                })()}
                    <View style={{flex: 1, backgroundColor: bgContainer}}>
                        <Loader loading={this.props.isLoading} />
                        <ScrollView>
                            {(() => {
                                if (!this.state.isSubmitted) {
                                    return (
                                        <View style={{margin: 20}}>
                                            <Form>
                                                <Item style={{marginLeft: 0}} stackedLabel>
                                                    <Label style = {[this.state.errors.has('name') ? invalidLabel : '' ]}>{I18n.t('calendars.calendar_name')} *</Label>
                                                    <Input style={{fontSize: 15}}
                                                           value={this.state.calendar.name}
                                                           underlineColorAndroid='transparent'
                                                           onChangeText={(text) => this.handleChange("name", text)}/>
                                                </Item>

                                                <View style = {[this.state.errors.has('name') ? invalidViewBox : hideViewBox ]}>
                                                    <Text style={invalidFeedback}>{this.state.errors.first('name')}</Text>
                                                </View>


                                                <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                                    <Label  style = {[this.state.errors.has('description') ? invalidLabel : '' ]}>{I18n.t('common.description')} *</Label>
                                                    <Input style={{textAlignVertical: 'top', fontSize: 15}}
                                                           numberOfLines={5}
                                                           multiline={true}
                                                           value={this.state.calendar.description}
                                                           underlineColorAndroid='transparent'
                                                           onChangeText={(text) => this.handleChange("description", text)}/>
                                                </Item>

                                                <View style = {[this.state.errors.has('description') ? invalidViewBox : hideViewBox ]}>
                                                    <Text style={invalidFeedback}>{this.state.errors.first('description')}</Text>
                                                </View>

                                                <View style={styles.checkboxContainer}>
                                                    <CheckBox
                                                            title={I18n.t('calendars.calendar_is_private')}
                                                            checked={this.state.calendar.is_private}
                                                            onPress={() => this.handleChange('is_private', !this.state.calendar.is_private)}
                                                            containerStyle={{backgroundColor: 'transparent', borderWidth:0, margin: 0}}
                                                            textStyle = {{color: '#575757', fontSize: 15, fontWeight: '400' }}
                                                    />

                                                    <CheckBox
                                                            title={I18n.t('calendars.user_email_required')}
                                                            checked={this.state.calendar.is_email_necessary}
                                                            onPress={() => this.handleChange('is_email_necessary', !this.state.calendar.is_email_necessary)}
                                                            containerStyle={{backgroundColor: 'transparent', borderWidth:0, margin: 0}}
                                                            textStyle = {{color: '#575757', fontSize: 15, fontWeight: '400' }}
                                                    />

                                                    <CheckBox
                                                            title={I18n.t('calendars.calendar_is_offline')}
                                                            checked={this.state.calendar.is_offline}
                                                            onPress={() => this.handleChange('is_offline', !this.state.calendar.is_offline)}
                                                            containerStyle={{backgroundColor: 'transparent', borderWidth:0, margin: 0}}
                                                            textStyle = {{color: '#575757', fontSize: 15, fontWeight: '400' }}
                                                    />
                                                </View>

                                                {(() => {
                                                    if(this.state.calendar.background !== '' && this.state.calendar.background !== null && this.state.calendar.background !== 'null'){
                                                        return (
                                                            <View style={styles.checkboxContainer}>
                                                                <Image  style={{width:'100%', height: 100}} source={{uri: Config.SITE_URL +'uploads/' + this.state.calendar.background}} />
                                                            </View>
                                                        );
                                                    }
                                                })()}
                                                <View style={styles.checkboxContainer}>
                                                    <Button block onPress={this.handleChoosePhoto}  style={{backgroundColor: "#463a3c", marginTop: 20, marginBottom: 20}} >
                                                        <Text style={{color: 'white'}}>{I18n.t('calendars.background_image')} </Text>
                                                    </Button>
                                                </View>

                                                <View style = {[this.state.errors.has('image') ? invalidViewBox : hideViewBox ]}>
                                                    <Text style={invalidFeedback}>{this.state.errors.first('image')}</Text>
                                                </View>

                                                <Button block style={{backgroundColor: bgHeader, marginTop: 20, marginBottom: 50}}
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

EditCalendar.navigationOptions = ({navigation}) => ({
    header: (
            <Header style={s.menuHeader}>
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name="md-arrow-back" style={s.menuIcon}/>
                    </Button>
                </Left>
                <Body>
                <Title style={{width: 230, color: '#fff'}}>Edit Calendar</Title>
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

const styles = StyleSheet.create({
    checkboxContainer: {
        flex: 1,
        paddingTop: 20,
    },
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
        onStoreCalendar: (data, editCalendarKey) => {
            dispatch(formRequest(Config.CREATE_CALENDAR_URL, data, 'update_calendar_'+editCalendarKey));
        },
        getCalendar: (calendar_id) => {
            dispatch(postRequest(Config.GET_CALENDAR_URL, {calendar_id: calendar_id}, 'get_calendar'));
        },
        logout: () => {
            dispatch(logout());
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(EditCalendar);