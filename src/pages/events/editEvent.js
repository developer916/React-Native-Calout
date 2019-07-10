import React, {Component} from 'react';
import Loader from '../../components/Loader';
import {
    Button,
    Header,
    Left,
    Body,
    Right,
    Title,
    Picker,
    Text,
    Form,
    Item,
    Container,
    Content,
    Input,
    Label,
} from 'native-base';
import {
    TextInput,
    ListView,
    View,
    Dimensions,
    Image,
    Linking,
    Platform,
    StyleSheet,
    Alert,
    Clipboard,
    StatusBar,
    ScrollView
} from 'react-native';
import {bgHeader, bgContainer,invalidLabel, containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox, selectPickerTextStyle, notificationPickerTextStyle, pickerStyle} from "../../styles";
import {connect} from 'react-redux';
import {formRequest, getRequest, postRequest} from "../../actions/Service";
import Config from 'react-native-config';
import {Col, Row, Grid} from 'react-native-easy-grid';
import s from '../Style';
import Icon from 'react-native-vector-icons/Ionicons';
import ReeValidate from 'ree-validate';
import _ from 'lodash';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
let {height, width} = Dimensions.get('window');
import {logout} from "../../actions/auth";
import I18n  from '../../../i18n/i18n';

class EditEvent extends Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            calendar: 'required',
            summary: 'required',
            description: 'required',
            start_date: 'required',
            end_date: 'required',
        })

        this.state = {
            event: {
                company_id: this.props.companyId,
                calendar: '',
                summary: '',
                description: '',
                start_date: this.getCurrentDateTime(),
                end_date: this.getCurrentDateTime(),
            },
            calendars: [],
            isSubmitted: false,
            previous_page : '',
            event_id: 0,
            errors: this.validator.errors,
            toCalendars: false,
            reminders : [],
            units : ["minutes", "hours", "days", "weeks"],
            editEventGetCalendarKey: 0,
            getEventKey: 0,
            editEventKey: 0,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.addNotification = this.addNotification.bind(this)
        this.removeNotification = this.removeNotification.bind(this)
        this.handleNotification = this.handleNotification.bind(this)
        this.convertTimezone = this.convertTimezone.bind(this)
        this.convertUTCtoLocal = this.convertUTCtoLocal.bind(this)

    }
    componentDidMount(){
        let editEventGetCalendarKey = Math.floor(Math.random() * 10000000);
        this.setState({editEventGetCalendarKey: editEventGetCalendarKey})
        this.props.getCalendars(editEventGetCalendarKey);
        let event_id =this.props.navigation.getParam('event_id', 0);
        this.setState({event_id: event_id});
        let getEventKey = Math.floor(Math.random() * 10000000);
        if(event_id != 0){
            this.setState({getEventKey: getEventKey})
            this.props.getEvent(event_id, getEventKey);
        }
        this.setState({editEventKey: Math.floor(Math.random() * 100000)});

    }

    convertTimezone(input_date){
//        console.log("date", input_date);
//        let date = moment(new Date(input_date));
//        console.log("moment_date", date);
//        let moment_utc_date_time = moment.utc(date).format('YYYY-MM-DD HH:mm');
//        console.log("123 ", moment_utc_date_time );
//        return moment_utc_date_time;
        let convert_moment_date = moment(input_date);
        let moment_utc_date_time = moment.utc(convert_moment_date).format('YYYY-MM-DD HH:mm');
        return moment_utc_date_time;
    }

    convertUTCtoLocal(date){
        let localTime = moment.utc(date).toDate();
        let convertLocaltime = moment(localTime);
        return convertLocaltime.format('YYYY-MM-DD HH:mm');
    }

    handleChange(name, value) {
        const {errors} = this.validator;

        this.setState({event: {...this.state.event, [name]: value}});
        errors.remove(name);

        this.validator.validate(name, value)
                .then(() => {
                    this.setState({errors})
                })
    }

    handleSubmit(e) {
        e.preventDefault()
        const {event} = this.state;
        const {errors} = this.validator;
        this.validator.validateAll(event)
                .then((success) => {
                    if (success) {
                        this.updateEvent();
                    } else {
                        this.setState({errors})
                    }
                })
    }

    updateEvent(){
        let reminderList = this.state.reminders;
        let insertReminder = [];
        if(reminderList.length >0){
            for(var i =0; i< reminderList.length; i++){
                if(reminderList[i]['time'] != 0 && reminderList[i]['time'] !=''){
                    if(insertReminder.length >0){
                        var exit = 0;
                        for(var j =0; j< insertReminder.length; j++){
                            if( (reminderList[i]['time'] == insertReminder[j]['time'] ) && (reminderList[i]['unit'] == insertReminder[j]['unit'])){
                                exit ++;
                            }
                        }
                        if(exit == 0){
                            insertReminder.push(reminderList[i]);
                        }
                    } else {
                        insertReminder.push(reminderList[i]);
                    }
                }
            }
        }
        let times = [];
        let units = [];
        let data;
        let convertedStartDate = this.convertTimezone(this.state.event.start_date);
        let convertedEndDate = this.convertTimezone(this.state.event.end_date);
        data = {
            company_id: this.props.companyId,
            event_id: this.state.event_id,
            calendar_id: this.state.event.calendar,
            date_from: convertedStartDate,
            date_to: convertedEndDate,
            summary: this.state.event.summary,
            description: this.state.event.description,
        }
//        const data = new FormData();
//        data.append('company_id', this.props.companyId);
//        data.append('event_id', this.state.event_id);
//        data.append('calendar_id', this.state.event.calendar);
//        data.append('date_from', this.state.event.start_date);
//        data.append('date_to', this.state.event.end_date);
//        data.append('summary', this.state.event.summary);
//        data.append('description', this.state.event.description);
//        data.append('times', times);
//        data.append('units', units);

        if(insertReminder.length >0){
            for(var i =0 ; i< insertReminder.length; i++){
                times.push(insertReminder[i]['time']);
                units.push(insertReminder[i]['unit']);
            }
            data.times =  times;
            data.units =  units;
        }
        this.props.onStoreEvent(data, this.state.editEventKey);
    }

    addNotification(e){
        e.preventDefault();
        let remainderItem = [];
        remainderItem['time'] = "10";
        remainderItem['unit'] = 'minutes';
        let remainderArray = [] ;
        remainderArray = this.state.reminders;
        remainderArray.push(remainderItem);
        this.setState({remainder: remainderArray});
    }
    removeNotification(i){
        delete this.state.reminders[i];
        this.setState({reminders: this.state.reminders})
    }

    handleNotification(type, value, i){
        let remindersList = this.state.reminders;
        if(type == "time") {
            if ((/^\d+$/.test(value)) || value == '') {
                remindersList[i][type] = value;
            }
        } else {
            remindersList[i][type] = value;
        }
        this.setState({reminders: this.state.reminders})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            if(nextProps.requestType == "edit_event_get_calendars_"+ this.state.editEventGetCalendarKey) {
                if (nextProps.data.status == "success") {
                    this.setState({calendars: nextProps.data.calendars});
                }
            }

            if (nextProps.requestType == 'update_event_' + this.state.editEventKey && nextProps.data.status == "success") {
                // this.setState({isSubmitted: true});
               setTimeout(() => {
                   Alert.alert(
                       I18n.t('auth.success'),
                       I18n.t('events.event_updated_successfully'),
                       [
                           {
                               text: 'OK', onPress: () => {
                               this.redirectPage()
                           }
                           }
                       ],
                       {cancelable: false}
                   )
               }, 100);

            }
            if(nextProps.requestType == "edit_event_get_event_" + this.state.getEventKey ){
                if(nextProps.data.status == "success"){
                    let start_date = this.convertUTCtoLocal(nextProps.data.data.date_from);
                    let end_date = this.convertUTCtoLocal(nextProps.data.data.date_to);
//                    this.setState({
//                        event:{
//                            summary : nextProps.data.data.summary,
//                            description : nextProps.data.data.description,
//                            calendar : nextProps.data.data.calendar_id,
//                            start_date: nextProps.data.data.date_from,
//                            end_date : nextProps.data.data.date_to,
//                        }
//                    });
                    this.setState({
                        event:{
                            summary : nextProps.data.data.summary,
                            description : nextProps.data.data.description,
                            calendar : nextProps.data.data.calendar_id,
                            start_date: start_date,
                            end_date : end_date,
                        }
                    });

                    let remindersList = nextProps.data.event_reminders;
                    let stateReminders = [];
                    if(remindersList.length >0){
                        for(var i =0; i<remindersList.length; i++){
                            let remainderItem = [];
                            remainderItem['time'] = remindersList[i]['time'].toString();
                            remainderItem['unit'] = remindersList[i]['unit'];
                            stateReminders.push(remainderItem);
                        }
                        this.setState({reminders: stateReminders});
                    }
                }
            }
        }

        if (nextProps.error != undefined) {
            if (nextProps.requestType == 'update_event_'+ this.state.event_id) {
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
                                    text: 'OK', onPress: () => { this.props.logout()}
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
            this.props.navigation.navigate("Events");
        }
    }

    getCurrentDateTime() {
        let date = new Date();
        let dateTime = moment(date).format('YYYY-MM-DD HH:mm');
        return dateTime;
    }


    render(){
        return(
            <Container style={{backgroundColor: bgContainer}}>
                    <View style={{flex: 1, backgroundColor: bgContainer}}>
                        <Loader loading={this.props.isLoading} />
                        <ScrollView>
                            {(() => {
                                if (!this.state.isSubmitted) {
                                    return (
                                        <View style={{margin: 20}}>
                                            <Form>
                                                <Item style={{marginLeft: 0}} stackedLabel>
                                                    <Label style={{ width : '100%' }}>{I18n.t('common.calendar')} *</Label>
                                                    <Picker
                                                        note
                                                        mode="dropdown"
                                                        style={pickerStyle}
                                                        textStyle={ selectPickerTextStyle }
                                                        selectedValue={this.state.event.calendar}
                                                        onValueChange={(value) => this.setState({event: {...this.state.event, ['calendar']: value}})} >
                                                        {
                                                            this.state.calendars.map((data, i) => {
                                                                return (
                                                                    <Item key={i} label={data.name} value={data.id} />
                                                                );
                                                            })
                                                        }
                                                    </Picker>

                                                    {/*<Picker*/}
                                                        {/*note*/}
                                                        {/*mode="dropdown"*/}
                                                        {/*style={{width: '100%'}}*/}
                                                        {/*selectedValue={this.state.event.calendar}*/}
                                                        {/*onValueChange={(value) => this.setState({event: {...this.state.event, ['calendar']: value}})}*/}
                                                    {/*>*/}
                                                        {/*{*/}
                                                            {/*this.state.calendars.map((data, i) => {*/}
                                                                {/*return (*/}
                                                                        {/*<Picker.Item key={i} label={data.name} value={data.id}/>*/}
                                                                {/*);*/}
                                                            {/*})*/}
                                                        {/*}*/}
                                                    {/*</Picker>*/}
                                                </Item>

                                                <View style = {[this.state.errors.has('calendar') ? invalidViewBox : hideViewBox ]}>
                                                    <Text style={invalidFeedback}>{this.state.errors.first('calendar')}</Text>
                                                </View>

                                                <Item style={{marginLeft: 0}} stackedLabel>
                                                    <Label style = {[this.state.errors.has('summary') ? invalidLabel : '' ]}>{I18n.t('events.event_summary')} *</Label>
                                                    <Input style={{fontSize: 15}}
                                                           value={this.state.event.summary}
                                                           underlineColorAndroid='transparent'
                                                           onChangeText={(text) => this.handleChange("summary", text)}/>
                                                </Item>

                                                <View style = {[this.state.errors.has('summary') ? invalidViewBox : hideViewBox ]}>
                                                    <Text style={invalidFeedback}>{this.state.errors.first('summary')}</Text>
                                                </View>


                                                <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                                    <Label  style = {[this.state.errors.has('description') ? invalidLabel : '' ]}>{I18n.t('events.event_description')} *</Label>
                                                    <Input style={{textAlignVertical: 'top', fontSize: 15}}
                                                           numberOfLines={5}
                                                           multiline={true}
                                                           value={this.state.event.description}
                                                           underlineColorAndroid='transparent'
                                                           onChangeText={(text) => this.handleChange("description", text)}/>
                                                </Item>

                                                <View style = {[this.state.errors.has('description') ? invalidViewBox : hideViewBox ]}>
                                                    <Text style={invalidFeedback}>{this.state.errors.first('description')}</Text>
                                                </View>

                                                <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                                    <Label  style = {[this.state.errors.has('start_date') ? invalidLabel : '' ]}>{I18n.t('events.start_date')} *</Label>
                                                    <DatePicker
                                                            style={{width: '100%'}}
                                                            date={this.state.event.start_date}
                                                            mode="datetime"
                                                            format="YYYY-MM-DD HH:mm"
                                                            confirmBtnText="Confirm"
                                                            cancelBtnText="Cancel"
                                                            showIcon={false}
                                                            customStyles={{
                                                                dateInput: {
                                                                    marginLeft: 10,
                                                                    borderWidth: 0
                                                                },
                                                                dateText: {
                                                                    fontSize: 17
                                                                },
                                                                dateTouchBody: {
                                                                    height: 50
                                                                }
                                                            }}
                                                            onDateChange={(date) => {
                                                                this.handleChange("start_date", date)
                                                            }}
                                                    />
                                                </Item>
                                                <View style = {[this.state.errors.has('start_date') ? invalidViewBox : hideViewBox ]}>
                                                    <Text style={invalidFeedback}>{this.state.errors.first('start_date')}</Text>
                                                </View>

                                                <Item style={{marginLeft: 0, marginTop: 20}} stackedLabel>
                                                    <Label  style = {[this.state.errors.has('end_date') ? invalidLabel : '' ]}>{I18n.t('events.end_date')} *</Label>
                                                    <DatePicker
                                                            style={{width: '100%'}}
                                                            date={this.state.event.end_date}
                                                            mode="datetime"
                                                            format="YYYY-MM-DD HH:mm"
                                                            confirmBtnText="Confirm"
                                                            cancelBtnText="Cancel"
                                                            showIcon={false}
                                                            customStyles={{
                                                                dateInput: {
                                                                    marginLeft: 10,
                                                                    borderWidth: 0
                                                                },
                                                                dateText: {
                                                                    fontSize: 17
                                                                },
                                                                dateTouchBody: {
                                                                    height: 50
                                                                }
                                                            }}
                                                            onDateChange={(date) => {
                                                                this.handleChange("end_date", date)
                                                            }}
                                                    />
                                                </Item>

                                                <View style = {[this.state.errors.has('end_date') ? invalidViewBox : hideViewBox ]}>
                                                    <Text style={invalidFeedback}>{this.state.errors.first('end_date')}</Text>
                                                </View>

                                                <View style={{marginTop: 30}}>
                                                    {
                                                        this.state.reminders.map((data, i) => {
                                                            return (
                                                                <View key={i}>
                                                                    <Grid>
                                                                        <Col size= {2}>
                                                                            <TextInput style={[inputStyle, {textAlign: 'center'}]}
                                                                                       value={data.time}
                                                                                       keyboardType= 'number-pad'
                                                                                       underlineColorAndroid='transparent'
                                                                                       onChangeText={(text) => this.handleNotification("time", text, i)}/>
                                                                        </Col>

                                                                        <Col size= {4}>
                                                                            <Picker
                                                                                note
                                                                                mode="dropdown"
                                                                                style={pickerStyle}
                                                                                textStyle={ notificationPickerTextStyle }
                                                                                selectedValue={data.unit}
                                                                                onValueChange={(value) => this.handleNotification("unit",value, i)}
                                                                            >
                                                                                {
                                                                                    this.state.units.map((data_unit, unit_key) => {
                                                                                        return (
                                                                                            <Item key={unit_key} label={data_unit} value={data_unit}/>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </Picker>
                                                                        </Col>

                                                                        <Col size= {1} style = {s.removeIcon}>
                                                                            <Icon name="md-close" style={{fontSize: 25}} onPress={(e) =>this.removeNotification(i)} />
                                                                        </Col>
                                                                    </Grid>

                                                                </View>
                                                            );
                                                        })
                                                    }
                                                </View>
                                                <Button block style={{ backgroundColor: '#463a3c', marginTop: 40, marginBottom: 20}}
                                                        onPress={(e) => this.addNotification(e)}>
                                                    <Text> {I18n.t('calendars.add_notifications')} </Text>
                                                </Button>


                                                <Button block style={{backgroundColor: bgHeader, marginTop: 20, marginBottom: 50}}
                                                        success onPress={(e) => this.handleSubmit(e)}>
                                                    <Text>{I18n.t('common.submit')}</Text>
                                                </Button>
                                            </Form>
                                        </View>
                                    );
                                } else{
                                    return (
                                        <View>
                                            <View>
                                                <Image style={{
                                                    width: 120,
                                                    height: 120,
                                                    marginLeft: (width - 160) / 2,
                                                    marginTop: 50
                                                }}
                                                       source={require('../../imgs/check_icon.png')}/>
                                            </View>
                                            <Text style={{
                                                fontSize: 23,
                                                textAlign: 'center',
                                                color: '#444444',
                                                marginTop: 30,
                                                width: width - 30
                                            }}>Event updated successfully!</Text>
                                        </View>
                                    )
                                }
                            })()}
                        </ScrollView>
                    </View>
            </Container>
        );
    }
}

EditEvent.navigationOptions = ({navigation}) => ({
    header: (
            <Header style={s.menuHeader}>
                <Left>
                    <Button transparent onPress={() => navigation.navigate("Events")}>
                        <Icon name="md-arrow-back" style={s.menuIcon}/>
                    </Button>
                </Left>
                <Body>
                <Title style={{width: 230, color: '#fff'}}>{I18n.t('events.edit_event')}</Title>
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
        getCalendars: (editEventGetCalendarKey) => {
            dispatch(getRequest(Config.GET_CALENDARS_URL, 'edit_event_get_calendars_'+ editEventGetCalendarKey));
        },
        getEvent: (event_id, getEventKey) =>{
            dispatch(postRequest(Config.GET_EVENTS_URL,{id : event_id}, 'edit_event_get_event_' + getEventKey));
        },
        onStoreEvent: (data, editEventKey) => {
            dispatch(postRequest(Config.CREATE_EVENT_URL, data, 'update_event_'+ editEventKey));
        },
        logout: () => {
            dispatch(logout());
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(EditEvent);