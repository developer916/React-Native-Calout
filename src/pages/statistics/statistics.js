import React, {Component} from 'react';
import {
    Button,
    Header,
    Left,
    Body,
    Right,
    Title,
    ListItem,
    Text,
    Container,
    Content,
    Picker,
    Item,
    Label,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {
    View,
    Dimensions,
    StatusBar,
    Alert,
} from 'react-native';
import s from '../Style';
import {selectPickerTextStyle, bgContainer, pickerStyle} from "../../styles";
import Config from 'react-native-config';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {postRequest, getRequest} from "../../actions/Service";
let {width, height} = Dimensions.get('window');
import Purechart  from 'react-native-pure-chart';
import Loader from '../../components/Loader';
import {logout} from "../../actions/auth";
import I18n  from '../../../i18n/i18n';

class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRendering: true,
            calendars:[],
            selectCalendars:[],
            subscribers:[],
            period:[],
            type: '',
            calendar_id: '',
            statisticsKey: 0,
            company_id: this.props.companyId,
        }

    }
    componentDidMount() {
        this.setState({isRendering: true});


        let period = [];
        for(let i =0; i< 3; i++){
            period[i] = [];
            if(i == 0){
                period[i]['label'] = '1W';
                period[i]['value'] = 'week';
            } else if(i == 1){
                period[i]['label'] = '4W';
                period[i]['value'] = 'month';
            } else if(i == 2) {
                period[i]['label'] = '1Y';
                period[i]['value'] = 'year';
            }
        }
        this.setState({period, period});
        this.setState({type : 'week'});
        this.props.getCalendars();
        let key = Math.floor(Math.random() * 100000);
        this.setState({statisticsKey: key });
        this.props.getSubscribers('', this.props.companyId, 'week', key);
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.data != null) {
            if(nextProps.requestType == "statistic_get_calendars"){
                if(nextProps.data.status == "success"){
                    this.setState({calendars: nextProps.data.calendars});
                }
            }

            if(nextProps.requestType == "get_subscribers_" + this.state.statisticsKey ){
                if(nextProps.data.status == "success"){
                    this.setState({subscribers: nextProps.data.data});
                }
            }
        }

        if (nextProps.error != undefined) {
            if(nextProps.error.response.status === 401){
                setTimeout(() => {
                    Alert.alert(
                        'Error',
                        'Unauthorized',
                        [
                            {
                                text: 'OK', onPress: () => { this.props.logout();}
                            }
                        ],
                        {cancelable: false}
                    )
                }, 100);
            }
        }
    }

    changeValue(name , value){
        let key = Math.floor(Math.random() * 100000);
        this.setState({statisticsKey : key});
        if(name === 'calendar_id'){
            this.props.getSubscribers(value, this.props.companyId, this.state.type, key);
        } else if(name === 'type'){
            this.setState({type : value});
            this.props.getSubscribers(this.state.calendar_id, this.props.companyId, value, key);
        }
    }
    renderSubscriberChart(){
        const { subscribers, type } = this.state;
        let curDate = new Date(), rgbStr = "";
        if(type == 'week'){
            curDate.setDate(curDate.getDate() - 7)
            rgbStr = "255,99,132"
        } else if(type == 'month'){
            curDate.setMonth(curDate.getMonth() - 1);
            rgbStr = "75,192,192"
        } else if(type == 'year'){
            curDate.setMonth(curDate.getMonth() - 11)
            rgbStr = "32,168,216"
        }
        let sampleData = [];
        let data = [];
        if(subscribers.length >0){
            subscribers.map((each, index) =>  {
                let curDateStr = (curDate.getMonth() + 1) + '/' + curDate.getDate() + '/' +  curDate.getFullYear()
                let eachSubscriberData = {
                    x: curDateStr,
                    y: subscribers[index]
                };
                if(type == 'year'){
                    curDate.setMonth(curDate.getMonth() + 1)
                } else {
                    curDate.setDate(curDate.getDate() + 1)
                }
                data.push(eachSubscriberData);
            });

            if(type == 'year'){
                let curDateStr = (curDate.getMonth() + 1) + '/' + curDate.getDate() + '/' +  curDate.getFullYear()
                let eachSubscriberData = {
                    x: curDateStr,
                    y: 0
                };
                data.push(eachSubscriberData);
            } else {
                let curDateStr = (curDate.getMonth() + 1) + '/' + curDate.getDate() + '/' +  curDate.getFullYear()
                let eachSubscriberData = {
                    x: curDateStr,
                    y: 0
                };
                data.push(eachSubscriberData);
            }
            let eachData = {
                seriesName: 'series1',
                data: data,
                color: `rgba(${rgbStr},0.2)`,
            };
            sampleData.push(eachData);
        }

    return (<Purechart data={sampleData} type={'bar'} highlightColor={'#297AB1'}  height= {300} />);
    }
    render(){
        return(
            <View style={{ flex: 1, backgroundColor: bgContainer }}>
                <Loader loading={this.props.isLoading}/>
                <View style={{margin: 20}}>
                    {/*<View>*/}
                        {/*<Grid>*/}
                            {/*<Col>*/}
                                {/*<Item style={{marginLeft: 0}} stackedLabel>*/}
                                    {/*<Label style={{width: '100%'}}>Calendar</Label>*/}
                                    {/*<Picker*/}
                                            {/*note*/}
                                            {/*mode="dropdown"*/}
                                            {/*style={{width: '100%'}}*/}
                                            {/*textStyle={ selectPickerTextStyle }*/}
                                            {/*selectedValue={this.state.calendar_id}*/}
                                            {/*onValueChange={(value) => {*/}
                                                {/*this.setState({calendar_id : value});*/}
                                                {/*this.changeValue('calendar_id', value);*/}
                                            {/*}}*/}
                                    {/*>*/}
                                        {/*<Item label={'All Calendars'} value =''/>*/}
                                        {/*{*/}
                                            {/*this.state.calendars.map((data, i) => {*/}
                                                {/*return (*/}
                                                        {/*<Item key={i} label={data.name} value={data.id}/>*/}
                                                {/*);*/}
                                            {/*})*/}
                                        {/*}*/}
                                    {/*</Picker>*/}
                                {/*</Item>*/}
                            {/*</Col>*/}
                            {/*<Col>*/}
                                {/*<Item style={{marginLeft: 0}} stackedLabel>*/}
                                    {/*<Label style={{width: '100%'}}>Period</Label>*/}
                                    {/*<Picker*/}
                                            {/*note*/}
                                            {/*mode="dropdown"*/}
                                            {/*style={{width: '100%'}}*/}
                                            {/*textStyle={ selectPickerTextStyle }*/}
                                            {/*selectedValue={this.state.type}*/}
                                            {/*onValueChange={(value) => {*/}
                                                {/*this.setState({type : value});*/}
                                                {/*this.changeValue('type' , value);*/}
                                            {/*}}*/}
                                    {/*>*/}
                                        {/*{*/}
                                            {/*this.state.period.map((data, i) => {*/}
                                                {/*return (*/}
                                                        {/*<Item key={i} label={data.label} value={data.value}/>*/}
                                                {/*);*/}
                                            {/*})*/}
                                        {/*}*/}
                                    {/*</Picker>*/}
                                {/*</Item>*/}
                            {/*</Col>*/}
                        {/*</Grid>*/}
                    {/*</View>*/}
                    <View style={{flexWra: 'wrap', alignItem: 'flex-start', flexDirection: 'row'}}>
                        <View style={{width: '50%', flexDirection: 'column'}} >
                            <Item style={{marginLeft: 0}} stackedLabel>
                                <Label style={{width: '100%'}}>{I18n.t('common.calendar')}</Label>
                                <Picker
                                        note
                                        mode="dropdown"
                                        style={pickerStyle}
                                        textStyle={ selectPickerTextStyle }
                                        selectedValue={this.state.calendar_id}
                                        onValueChange={(value) => {
                                            this.setState({calendar_id : value});
                                            this.changeValue('calendar_id', value);
                                        }}
                                >
                                    <Item label={'All Calendars'} value =''/>
                                    {
                                        this.state.calendars.map((data, i) => {
                                            return (
                                                    <Item key={i} label={data.name} value={data.id}/>
                                            );
                                        })
                                    }
                                </Picker>
                            </Item>
                        </View>
                        <View style={{width: '50%' , flexDirection: 'column'}} >
                            <Item style={{marginLeft: 0}} stackedLabel>
                                <Label style={{width: '100%'}}>{I18n.t('menu.period')}</Label>
                                <Picker
                                        note
                                        mode="dropdown"
                                        style={pickerStyle}
                                        textStyle={ selectPickerTextStyle }
                                        selectedValue={this.state.type}
                                        onValueChange={(value) => {
                                            this.setState({type : value});
                                            this.changeValue('type' , value);
                                        }}
                                >
                                    {
                                        this.state.period.map((data, i) => {
                                            return (
                                                    <Item key={i} label={data.label} value={data.value}/>
                                            );
                                        })
                                    }
                                </Picker>
                            </Item>
                        </View>
                    </View>
                    <View style={{marginTop: 40}}>
                        <View  style={{marginBottom:20, width: width-40}}>
                            { this.renderSubscriberChart() }
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

Statistics.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                    <Icon name="md-menu" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 230, color: '#fff'}}>{I18n.t('menu.statistics')}</Title>
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
        getCalendars: () => {
            dispatch(getRequest(Config.GET_CALENDARS_URL, 'statistic_get_calendars'));
        },
        getSubscribers: (calendar_id, company_id, type, statisticsKey) =>{
            dispatch(postRequest(Config.GET_SUBSCRIBERS_URL, {calendar_id : calendar_id, company_id: company_id, type: type}, 'get_subscribers_' + statisticsKey))
        },
        logout: () => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);