import React, {Component} from "react";
import {Container, Content, Text, List, ListItem, Left, Body} from "native-base";
import Icon from 'react-native-vector-icons/Ionicons';
import s from '../Style';
import {logout} from "../../actions/auth";
import {connect} from 'react-redux';
import I18n  from '../../../i18n/i18n';


class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routes: [
                {
                    routeName: 'Dashboard',
                    name: I18n.t('menu.dashboard'),
                    icon: 'md-home'
                },
                {
                    routeName: 'Calendars',
                    name: I18n.t('menu.calendars'),
                    icon: 'md-calendar'
                },
                {
                    routeName: 'Events',
                    name: I18n.t('menu.events'),
                    icon: 'md-book'
                },
                {
                    routeName: 'Statistics',
                    name: I18n.t('menu.statistics'),
                    icon: 'md-stats'
                },
                {
                    routeName: 'Settings',
                    name: I18n.t('menu.settings'),
                    icon: 'md-settings'
                },
                {
                    routeName: '',
                    name: I18n.t('menu.sign_out'),
                    icon: 'md-log-out'
                }
            ]
        };

    }

    logout() {
        this.props.logout();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.languageProps  != "") {
            let routes;
            routes = [
                {
                    routeName: 'Dashboard',
                    name: I18n.t('menu.dashboard'),
                    icon: 'md-home'
                },
                {
                    routeName: 'Calendars',
                    name: I18n.t('menu.calendars'),
                    icon: 'md-calendar'
                },
                {
                    routeName: 'Events',
                    name: I18n.t('menu.events'),
                    icon: 'md-book'
                },
                {
                    routeName: 'Statistics',
                    name: I18n.t('menu.statistics'),
                    icon: 'md-stats'
                },
                {
                    routeName: 'Settings',
                    name: I18n.t('menu.settings'),
                    icon: 'md-settings'
                },
                {
                    routeName: '',
                    name: I18n.t('menu.sign_out'),
                    icon: 'md-log-out'
                }
            ]
            this.setState({
                routes: routes
            });
        }

    }
    render() {
        return (
            <Container>
                <Content style={{backgroundColor: '#262626'}}>
                    <Text style={{marginTop: 30, color: '#fff', paddingLeft: 20}}>
                        {I18n.t("header.welcome")}
                    </Text>
                    <Text style={{textAlign: 'center', color: '#fff', fontSize: 25, marginTop: 10, marginBottom: 10}}>
                        <Icon name='md-person' style={{fontSize: 25}}/>&nbsp;&nbsp; {this.props.name}
                    </Text>
                    <List
                        style={{width: '100%'}}
                        dataArray={this.state.routes}
                        renderRow={data => {
                            return (
                                <ListItem
                                    icon
                                    onPress={() => {
                                        if (data.routeName) {
                                            this.props.navigation.navigate(data.routeName)
                                        } else {
                                            this.logout();
                                        }
                                    }}>
                                    <Left>
                                        <Icon name={data.icon} style={s.menuIcon}/>
                                    </Left>
                                    <Body>
                                        <Text style={{color: '#fff'}}>{data.name}</Text>
                                    </Body>
                                </ListItem>
                            );
                        }}
                    />
                </Content>
            </Container>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        role: state.auth.role,
        email: state.auth.email,
        name: state.auth.name,
        languageProps : state.reference.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
