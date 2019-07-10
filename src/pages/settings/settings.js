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
    Badge,
    Segment,
    ActionSheet,
    Card,
    CardItem,
    Picker,
    Container,
    Content
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {
    View,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import s from '../Style';
import {bgHeader, bgContainer} from "../../styles";
import {Col, Row, Grid} from 'react-native-easy-grid';
import _ from 'lodash';
import I18n, {translateHeaderTextByProps, getCurrentLocale}  from '../../../i18n/i18n';


class Settings extends Component {
    constructor(props) {
        super(props);
        let currentLanguage = getCurrentLocale();
        this.props.navigation.setParams({headerTitle: translateHeaderTextByProps('menu.settings', currentLanguage)});
        let newRoutes;
        if (this.props.role == "user") {
            newRoutes = [
                {
                    routeName: 'ChangePassword',
                    name: I18n.t('settings.change_password'),
                    icon: 'md-key'
                },
                {
                    routeName: 'Language',
                    name: I18n.t('settings.set_language'),
                    icon: 'ios-globe'
                }
            ]
        } else {
            newRoutes = [
                {
                    routeName: 'ChangePassword',
                    name: I18n.t('settings.change_password'),
                    icon: 'md-key'
                },
                {
                    routeName: 'Language',
                    name: I18n.t('settings.set_language'),
                    icon: 'ios-globe'
                },
                {
                    routeName: 'CompanyAddress',
                    name: I18n.t('menu.company_address'),
                    icon: 'md-paper'
                },
                {
                    routeName: 'CompanySepa',
                    name: I18n.t('menu.company_sepa'),
                    icon: 'md-list'
                },
                {
                    routeName: 'CompanySMTP',
                    name: I18n.t('menu.smtp_setting'),
                    icon: 'md-desktop'
                }
            ]
        }
        this.state = {
            routes: newRoutes,
            currentLanguage: currentLanguage
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.languageProps  != "") {
            if(nextProps.languageProps != this.state.currentLanguage){
                let routes;
                if (this.props.role == "user") {
                    routes = [
                        {
                            routeName: 'ChangePassword',
                            name: I18n.t('settings.change_password'),
                            icon: 'md-key'
                        },
                        {
                            routeName: 'Language',
                            name: I18n.t('settings.set_language'),
                            icon: 'ios-globe'
                        }
                    ]
                } else {
                    routes = [
                        {
                            routeName: 'ChangePassword',
                            name: I18n.t('settings.change_password'),
                            icon: 'md-key'
                        },
                        {
                            routeName: 'Language',
                            name: I18n.t('settings.set_language'),
                            icon: 'ios-globe'
                        },
                        {
                            routeName: 'CompanyAddress',
                            name: I18n.t('menu.company_address'),
                            icon: 'md-paper'
                        },
                        {
                            routeName: 'CompanySepa',
                            name: I18n.t('menu.company_sepa'),
                            icon: 'md-list'
                        },
                        {
                            routeName: 'CompanySMTP',
                            name: I18n.t('menu.smtp_setting'),
                            icon: 'md-desktop'
                        }
                    ]
                }

                let currentLanguage = getCurrentLocale();
                console.log("setting_props_currentLanguage", currentLanguage);
                this.props.navigation.setParams({headerTitle: translateHeaderTextByProps('menu.settings', currentLanguage)});
                this.setState({
                    routes: routes,
                    currentLanguage : currentLanguage
                });
            }
        }
    }


    remoteRoutes(routesArray, routeName) {
        let newRoutes = [];
        for (let i = 0; i < routesArray.length; i ++) {
            if (routesArray[i].routeName != routeName) {
                newRoutes.push(routesArray[i]);
            }
        }
        return newRoutes;
    }

    openPage(routeName) {
        this.props.navigation.navigate(routeName);
    }

    render() {
        return (
            <Content>
                <View style={{flex: 1, backgroundColor: bgContainer, margin: 20}}>
                    <View style={{width: '100%', height: '100%'}}>
                        <Grid>
                            <Col>
                                {
                                    this.state.routes.map((data, i) => {
                                        if (i % 2 == 0) {
                                            return (
                                                <Row style={{height: 100}} key={i}>
                                                    <TouchableOpacity
                                                            style={{height: 100, width: '100%'}}
                                                            onPress={() => this.openPage(data.routeName)}>
                                                        <Card style={{backgroundColor: bgHeader}}>
                                                            <CardItem style={{width: '100%', backgroundColor: bgHeader, paddingLeft: 0, paddingRight: 0}}>
                                                                <Body style={{
                                                                    flex: 1,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}>
                                                                <Icon name={data.icon} style={{fontSize: 40, color: '#fff'}} />
                                                                <Text style={{color: '#fff', fontSize: 13}}>{data.name}</Text>
                                                                </Body>
                                                            </CardItem>
                                                        </Card>
                                                    </TouchableOpacity>
                                                </Row>
                                            )
                                        }
                                    })
                                }
                            </Col>
                            <Col>
                                {
                                    this.state.routes.map((data, i) => {
                                        if (i % 2 == 1) {
                                            return (
                                                <Row style={{height: 100}} key={i}>
                                                    <TouchableOpacity
                                                            style={{height: 100, width: '100%'}}
                                                            onPress={() => this.openPage(data.routeName)}>
                                                        <Card style={{backgroundColor: bgHeader}}>
                                                            <CardItem style={{width: '100%', backgroundColor: bgHeader, paddingLeft: 0, paddingRight: 0}}>
                                                                <Body style={{
                                                                    flex: 1,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}>
                                                                <Icon name={data.icon} style={{fontSize: 40, color: '#fff'}} />
                                                                <Text style={{color: '#fff', fontSize: 13}}>{data.name}</Text>
                                                                </Body>
                                                            </CardItem>
                                                        </Card>
                                                    </TouchableOpacity>
                                                </Row>
                                            )
                                        }
                                    })
                                }
                            </Col>
                        </Grid>
                    </View>
                </View>
            </Content>
        );
    }
}


Settings.navigationOptions = ({navigation}) => ({
    header: (
            <Header style={s.menuHeader}>
                <Left>
                    <Button transparent onPress={() => navigation.navigate("DrawerOpen")}>
                        <Icon name="md-menu" style={s.menuIcon}/>
                    </Button>
                </Left>
                <Body>
                <Title style={{width: 230, color: '#fff'}}>
                    {(() =>{
                        let {params} = navigation.state
                        if(!_.isEmpty(params)){
                            return (params.headerTitle)
                        } else {
                            return(I18n.t('menu.settings'));
                        }
                    })()}
                </Title>

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

const mapStateToProps = (state, reference) => {
    return {
        role: state.auth.role,
        name: state.auth.name,
        companyId: state.auth.companyId,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType,
        languageProps : state.reference.language,
        reference
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);