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
    Form,
    Item,
    Label,
    ListItem,
    Text,
} from 'native-base';
import {
    ListView,
    View,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Alert,
    StatusBar,
} from 'react-native';
import {bgHeader, bgContainer, selectPickerTextStyle, selectPickerStyle, pickerStyle} from "../../styles";
import {connect} from 'react-redux';
import {postRequest, getRequest} from "../../actions/Service";
import Config from 'react-native-config';
import {Col, Row, Grid} from 'react-native-easy-grid';
import s from '../Style';
import Icon from 'react-native-vector-icons/Ionicons';
import {SearchBar} from 'react-native-elements';
let {height, width} = Dimensions.get('window');
import moment from 'moment';
import {logout} from "../../actions/auth";
import _ from 'lodash';
import I18n  from '../../../i18n/i18n';

class EventList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            calendars:[],
            isRendering: true,
            keyword: '',
            delete_event_id: 0,
            calendar_id: 0,
            selectCalendars:[],
            getCalendarsKey: '',
            getEventsKey : '',
            isStateLoading: false
        };

        this.arrayholder = [];

        this.convertUTCtoLocal = this.convertUTCtoLocal.bind(this)
    }

    componentWillMount(){
        this.props.navigation.setParams({role: this.props.role});
    }


    componentDidMount() {
        this.setState({isRendering: true});
        let calendar_id =this.props.navigation.getParam('calendar_id', 0);
        console.log("calendar_id", calendar_id);
        let getCalendarsKey = Math.floor(Math.random() * 100000);
        this.setState({getCalendarsKey : getCalendarsKey});
        this.setState({calendar_id, calendar_id});
        this.props.getCalendars(getCalendarsKey);


        let getEventsKey = Math.floor(Math.random() * 100000);
        this.setState({getEventsKey : getEventsKey});
        if(calendar_id != 0){
            this.props.getEvents(calendar_id, getEventsKey);
        } else {
            this.props.getEvents("all", getEventsKey);
        }
    }

    convertUTCtoLocal(date){
        let localTime = moment.utc(date).toDate();
        let convertLocaltime = moment(localTime);
        return convertLocaltime.format('YYYY-MM-DD HH:mm');
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            if(nextProps.requestType == "get_calendars_"+this.state.getCalendarsKey){
                if(nextProps.data.status == "success"){
                    this.setState({calendars: nextProps.data.calendars});
                }
            }

            if(nextProps.requestType == "get_events_" + this.state.getEventsKey){
                if(nextProps.data.status == "success"){
                    this.setState({data:this.getUpdatedDataSource(nextProps.data.event_data)});
                    this.arrayholder = nextProps.data.event_data;
                }
            }

            if(nextProps.requestType == "delete_event"){
                let rows = [];
                let newArrayholder = [];
                for (let i = 0; i < this.state.dataSource.length; i ++) {
                    if (this.state.dataSource[i].id != this.state.delete_event_id) {
                        rows.push(this.state.dataSource[i]);
                    }
                }
                for(let i =0 ; i <this.arrayholder.length; i++){
                    if(this.arrayholder[i].id != this.state.delete_event_id){
                        newArrayholder.push(this.arrayholder[i]);
                    }
                }
                this.arrayholder = newArrayholder;
                this.setState({dataSource: rows, delete_event_id: ''});
                let ids = rows.map((obj, index) => index);
                this.setState({data: this.state.data.cloneWithRows(rows, ids)});
            }
        }

        if (nextProps.error != undefined) {
            if(nextProps.error.response.status === 401){
                setTimeout(() => {
                    Alert.alert(
                        I18n.t('common.error'),
                        I18n.t('common.unauthorized'),
                        [
                            {
                                text: I18n.t('common.ok'), onPress: () => { this.props.logout() }
                            }
                        ],
                        {cancelable: false}
                    )
                }, 100);
            }
        }
    }


    getUpdatedDataSource(newData){
        let rows = newData;
        this.setState({dataSource: rows});
        let ids = rows.map((obj, index) => index);
        return this.state.data.cloneWithRows(rows, ids);
    }

    _rowHasChanged(r1, r2) {
        // You might want to use a different comparison mechanism for performance.
        return JSON.stringify(r1) !== JSON.stringify(r2);
    }

    searchFilterFunction(text) {
        this.setState({dataSource: []});
        this.setState({keyword: text});
        const newData = this.arrayholder.filter(function(item) {
            const itemData = item.summary ? item.summary.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return ( itemData.indexOf(textData) > -1);
        });
        this.setState({data:this.getUpdatedDataSource(newData)});
    }

    selectCalendar(value){
        // this.setState({dataSource: []});
        // let  newData = [];
        // if(value == 0){
        //      newData = this.arrayholder;
        // } else {
        //     newData = this.arrayholder.filter(function(item){
        //         if(item.calendar.id == value){
        //             return item;
        //         }
        //     });
        // }
        // this.setState({data:this.getUpdatedDataSource(newData)});
        this.setState({calendar_id: value});
        this.setState({dataSource: []});
        this.setState({keyword: ""});
        let getEventsKey = Math.floor(Math.random() * 100000);
        this.setState({getEventsKey : getEventsKey});
        if(value != 0){
            this.props.getEvents(value, getEventsKey);
        } else {
            this.props.getEvents('all', getEventsKey);
        }



    }

    deleteEvent(event_id){
        Alert.alert(
            I18n.t('events.delete_event'),
            I18n.t('events.delete_event_message'),
            [
                {
                    text: I18n.t('common.ok'), onPress: () => {this.setState({delete_event_id: event_id}); this.props.deleteEvent(event_id);}
                },
                {
                    text: I18n.t('common.cancel'), onPress: () => {}
                }
            ],
            {cancelable: true}
        )
    }

    render(){
        return(
            <View style={{ flex:1, backgroundColor: bgContainer}}>
                <Loader loading={this.props.isLoading} />
                <SearchBar
                    lightTheme
                    onChangeText={ text => this.searchFilterFunction(text) }
                    onClear = { text => this.searchFilterFunction("")}
                    value={this.state.keyword}
                    inputStyle={styles.searchBar}
                    placeholder={I18n.t("calendars.type_here")} />

                <View style={{margin: 20}}>
                    <Form>
                        <Item style={{marginLeft: 0, marginRight :0}} stackedLabel>
                            <Label style={{ width: '100%'}}>{I18n.t("calendars.calendars")}</Label>
                            <Picker
                                note
                                mode="dropdown"
                                style={pickerStyle}
                                textStyle={ selectPickerTextStyle }
                                selectedValue={this.state.calendar_id}
                                onValueChange={(value) => this.selectCalendar(value)}
                                itemStyle = {{width : '100%'}}
                                itemTextStyle={{ width: '100%', color: 'blue' }}
                            >
                                <Item label={'All'} value={0}/>
                                {
                                    this.state.calendars.map((data, i) => {
                                        return (
                                                <Item key={i} label={data.name} value={data.id} />
                                        );
                                    })
                                }
                            </Picker>
                        </Item>
                    </Form>
                </View>
                <View style={{flex: 1}}>
                    {(() => {
                        if (this.state.dataSource.length == 0 && !this.props.isLoading) {
                            return (
                                <Text style={{textAlign: 'center', marginTop: 50, width: '100%'}}>{I18n.t('events.there_are_no_events')}</Text>
                            );
                        } else {
                            return (
                                <View style={{marginLeft: 20}}>
                                    <ListView
                                        dataSource={this.state.data}
                                        enableEmptySections={ true }
                                        renderRow={data => {
                                            return (
                                                <ListItem style={{
                                                    marginLeft: 0,
                                                    marginRight: 0,
                                                    borderBottomWidth: 0,
                                                    borderBottomColor: '#fff',
                                                    marginBottom: 20
                                                }}>
                                                    <Body style={{borderWidth: 1, borderColor: '#e1e6ef'}}>
                                                        {(() => {
                                                            if (data.calendar.picture !== '' && data.calendar.picture !== null && data.calendar.picture !== 'null') {
                                                                return (
                                                                        <Image style={{
                                                                            width: '100%',
                                                                            height: 100
                                                                        }}
                                                                               source={{uri: Config.SITE_URL + 'uploads/' + data.calendar.picture}}/>
                                                                );
                                                            }
                                                        })()}
                                                        <View style={{
                                                            padding: 10,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: '#e1e6ef',
                                                            flex: 1
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 18,
                                                                marginBottom: 10
                                                            }}>{data.summary}</Text>
                                                            <Text style={{fontSize: 14, marginBottom: 10}}>{I18n.t('events.event_date_from')} - {I18n.t('events.event_date_to')} : {this.convertUTCtoLocal(data.date_from)}
                                                                - {this.convertUTCtoLocal(data.date_to)}</Text>
                                                            <Text style={{fontSize: 14, marginBottom: 10}}>{I18n.t("events.total_subscribers")}: {data.total_subscriber}</Text>
                                                            <Text style={{fontSize: 14, marginBottom: 10}}>{I18n.t('events.new_subs_last_week')}: {data.week_subscriber}</Text>
                                                        </View>
                                                        <View style={{padding: 10, flex: 1}}>
                                                            <Grid >
                                                                {(() => {
                                                                    if (this.props.role == "company" || this.props.role == "admin") {
                                                                        return (
                                                                                <Col onPress={()=>this.props.navigation.navigate("EditEvent", {event_id : data.id})}>
                                                                                    <Icon name="md-create"
                                                                                          style={{
                                                                                              width: '100%',
                                                                                              fontSize: 20,
                                                                                              textAlign: 'center'
                                                                                          }}/>
                                                                                    <Text style={{
                                                                                        fontSize: 14,
                                                                                        width: '100%',
                                                                                        textAlign: 'center',
                                                                                        marginLeft: 0,
                                                                                        marginRight: 0
                                                                                    }}>{I18n.t("common.edit")}</Text>
                                                                                </Col>
                                                                        );
                                                                    }
                                                                })()}

                                                                {(() => {
                                                                    if (this.props.role == "company" || this.props.role == "admin") {
                                                                        return (
                                                                                <Col onPress={() => this.deleteEvent(data.id)}>
                                                                                    <Icon name="md-trash"
                                                                                          style={{
                                                                                          width: '100%',
                                                                                          fontSize: 20,
                                                                                          textAlign: 'center'
                                                                                      }}/>
                                                                                <Text style={{
                                                                                    fontSize: 14,
                                                                                    width: '100%',
                                                                                    textAlign: 'center',
                                                                                    marginLeft: 0,
                                                                                    marginRight: 0
                                                                                }}>{I18n.t("common.delete")}</Text>
                                                                            </Col>
                                                                    );
                                                                }
                                                            })()}
                                                            </Grid>
                                                        </View>
                                                        </Body>
                                                    </ListItem>
                                                );
                                            }}
                                        />
                                    </View>
                                );
                            }
                        })()}
                </View>

            </View>
        );
    }
}

EventList.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
                <Title style={{width: 230, color: '#fff'}}>{I18n.t('menu.events')}</Title>
            </Body>
            <Right>
                {(() =>{
                    let {params} = navigation.state
                    if(!_.isEmpty(params) && params.role == 'company'){
                        return(
                            <Button transparent onPress={() => navigation.navigate("AddEvent")}>
                                <Icon name="md-add" style={s.menuIcon}/>
                            </Button>
                        );
                    }
                })()}

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
    searchBar: {
        ...Platform.select({
            android: {
                paddingTop: 10,
            },
        }),
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
        getCalendars: (getCalendarsKey) => {
            dispatch(getRequest(Config.GET_CALENDARS_URL, 'get_calendars_'+getCalendarsKey));
        },
        getEvents:(calendar_id, getEventsKey) =>{
            dispatch(postRequest(Config.GET_EVENTS_BY_CALENDAR_URL, {calendar_search: calendar_id}, 'get_events_'+getEventsKey))
        },
        deleteEvent: (event_id) => {
            dispatch(postRequest(Config.DELETE_EVENT_URL, {event_id: event_id}, 'delete_event'))
        },
        logout: () => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);