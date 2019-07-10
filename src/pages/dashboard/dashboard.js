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
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {
    ListView,
    View,
    Dimensions,
    StyleSheet,
    Alert,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import s from '../Style';
import {bgHeader, bgContainer} from "../../styles";
import Config from 'react-native-config';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {postRequest} from "../../actions/Service";
let {width} = Dimensions.get('window');
import Purechart  from 'react-native-pure-chart';
import Loader from '../../components/Loader';
import moment from 'moment';
import {logout} from "../../actions/auth";
import I18n  from '../../../i18n/i18n';

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: this._rowHasChanged.bind(this),
            }),
            dataSource: [],
            isRendering: true,
            calendars: [],
            subscribers:[],
            upcomingEvents:[],
            content: {},
            getDashboardKey : ''
        };
        this.convertUTCtoLocal = this.convertUTCtoLocal.bind(this)
    }

    componentDidMount() {
        this.setState({isRendering: true});
        let key = Math.floor(Math.random() * 100000);
        this.setState({getDashboardKey: key});
        this.props.getDashboardData(key);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null && nextProps.requestType == 'get_dashboard_data_' +  this.state.getDashboardKey) {
            this.setState({
                data: this.getUpdatedDataSource(nextProps),
                calendars: nextProps.data.calendar_data,
                subscribers: nextProps.data.subscribers_data,
                upcomingEvents: nextProps.data.upcoming_events
            });
        }
        if (nextProps.error != undefined) {
            if (nextProps.requestType == 'get_dashboard_data_'+this.state.getDashboardKey) {
                if(nextProps.error.response.status === 401){
                    setTimeout(() => {
                        Alert.alert(
                            'Error',
                            nextProps.error.response.data,
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
    }

    convertUTCtoLocal(date){
        let localTime = moment.utc(date).toDate();
        let convertLocaltime = moment(localTime);
        return convertLocaltime.format('YYYY-MM-DD HH:mm');
    }

    _rowHasChanged(r1, r2) {
        // You might want to use a different comparison mechanism for performance.
        return JSON.stringify(r1) !== JSON.stringify(r2);
    }

    getUpdatedDataSource(props){
        let rows = this.state.dataSource.concat(props.data.upcoming_events);
        this.setState({dataSource: rows});
        let ids = rows.map((obj, index) => index);
        return this.state.data.cloneWithRows(rows, ids);
    }

    renderSubscriberChart() {
        const { calendars, subscribers } = this.state;
        let testData = new Date();
        let weekAgoMilliSeconds =  7 * 24 * 60 * 60 * 1000;
        testData.setTime(testData.getTime() - weekAgoMilliSeconds);
        let sampleData = [];
        if(subscribers.length >0){
            subscribers.map((each, index) =>  {

                let testData = new Date();
                let weekAgoMilliSeconds =  7 * 24 * 60 * 60 * 1000;
                testData.setTime(testData.getTime() - weekAgoMilliSeconds);
                let currentDate = new Date(testData);

                const rgbStr = `${ random(0, 255) },${ random(0, 255) }, ${ random(0, 255) }`;
                let data = [];
                let subscriberArray = subscribers[index];
                subscriberArray.map((each , subscriberIndex) => {
                    let curDateStr = (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' +  currentDate.getFullYear()
                    let eachSubscriberData = {
                        x: curDateStr,
                        y: subscriberArray[subscriberIndex]
                    };
                    currentDate.setDate(currentDate.getDate() + 1)
                    data.push(eachSubscriberData);
                });
                let eachData = {
                    seriesName : calendars[index].name,
                    data: data,
                    color: `rgba(${rgbStr},1)`,
                };
                sampleData.push(eachData);

            });
        } else {
            let testData = new Date();
            let weekAgoMilliSeconds =  7 * 24 * 60 * 60 * 1000;
            testData.setTime(testData.getTime() - weekAgoMilliSeconds);
            let currentDate = new Date(testData);
            let data = [];
            for( let i= 0;  i<7; i++){
                currentDate.setDate(currentDate.getDate() + 1);
                let curDateStr = (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' +  currentDate.getFullYear();
                let eachSubscriberData = {
                    x: curDateStr,
                    y: 0
                };
                data.push(eachSubscriberData);
            }
            let eachData = {
                data: data,
                color: '#a32332'
            };
            sampleData.push(eachData);
        }

         return (<Purechart data={sampleData} type='line'  height={200} />);
    }


    render() {
        return (
            <Container style={{backgroundColor: bgContainer}}>
                <Header style={s.menuHeader}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                            <Icon name="md-menu" style={s.menuIcon}/>
                        </Button>
                    </Left>
                    <Body>
                    <Title style={{width: 230,color: '#ffffff'}}>{I18n.t("menu.dashboard")}</Title>
                    </Body>
                    <Right/>
                </Header>

                <StatusBar
                        barStyle="light-content"
                        hidden = { false }
                        backgroundColor = "#611f69"
                        translucent = {true}
                        networkActivityIndicatorVisible={true}
                />

                <View style={{flex: 1, backgroundColor: bgContainer}}>
                    <Loader loading={this.props.isLoading} />
                    <View style={{flex: 1, marginTop: 20, marginLeft: 20, marginRight: 20}}>
                        {(() => {
                            if (this.props.role === 'company') {
                                return(
                                    <View style={{flexWra: 'wrap', alignItem: 'flex-start', flexDirection: 'row' , marginBottom: 30}}>
                                        <TouchableOpacity style={{textAlign: 'center', width: '50%', flexDirection: 'column'}} onPress={() => this.props.navigation.navigate("AddEvent", {previous_page : "dashboard" })}>
                                            <Icon name="md-add-circle-outline" style={{width: '100%', fontSize: 20, textAlign: 'center'}}/>
                                            <Text style={{fontSize:16, textAlign: 'center'}}>{I18n.t("events.add_event")}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{textAlign: 'center' , width: '50%' , flexDirection: 'column'}} onPress={() => this.props.navigation.navigate("AddCalendar", {previous_page : "dashboard" })}>
                                            <Icon name="md-add-circle-outline" style={{width: '100%', fontSize:20, textAlign: 'center'}}/>
                                            <Text style={{fontSize:16, textAlign: 'center'}}>{I18n.t('calendars.add_calendar')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }
                        })()}

                        <View >
                            <View style={{marginBottom:20}}>
                                <Text style={{textAlign: 'center', fontSize: 18, width: '100%'}}> {I18n.t('calendars.subscribers_chart')} </Text>
                            </View>
                            <View  style={{marginBottom:20, width : width - 40}}>
                                { this.renderSubscriberChart() }
                            </View>
                        </View>
                        <Grid>
                            <Row size={2} style={{marginTop: 10}} >
                                <Text style={{textAlign: 'center', fontSize: 18, width: '100%'}}>{I18n.t('events.upcoming_events')}</Text>
                            </Row>
                            <Row size={6} style={{marginBottom:20}}>
                                {(() => {
                                    if(this.state.dataSource.length == 0 && !this.props.isLoading) {
                                        return (
                                                <Text style={{textAlign: 'center', fontSize:12, width: '100%'}}>{I18n.t('events.there_are_no_upcoming_events')}</Text>
                                        );
                                    } else {
                                        return(
                                            <ListView
                                                dataSource={this.state.data}
                                                renderRow={data => {
                                                    return (
                                                        <ListItem style={{marginLeft: 0}}>
                                                            <Body>
                                                            <Text style={styles.title}>
                                                                {data.summary}
                                                            </Text>
                                                            <Text style={styles.description}>
                                                                {data.description}
                                                            </Text>
                                                            <Text style={styles.description}>
                                                                {this.convertUTCtoLocal(data.date_from)} - {this.convertUTCtoLocal(data.date_to)}
                                                            </Text>
                                                            </Body>
                                                        </ListItem>
                                                    );
                                                }}
                                            />
                                        );
                                    }
                                })()}
                            </Row>
                        </Grid>
                    </View>
                </View>
            </Container>
        );
    }
}



const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        color: '#000',
    },
    description: {
        fontSize: 12,
    },
    textCenter: {
        textAlign: 'center'
    },
    addItem: {
        width: '100%', fontSize:20, textAlign: 'center'
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        role: state.auth.role,
        name: state.auth.name,
        companyId: state.auth.companyId,
        userId: state.auth.userId,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDashboardData: (getDashboardKey) => {
            dispatch(postRequest(Config.COMPANY_GET_DASHBOARD_DATA_URL,{}, 'get_dashboard_data_'+getDashboardKey));
        },

        logout: () => {
//            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);