import React, {Component} from "react";
import Dashboard from './dashboard';
import Calendars from '../calendar';
import Events from '../events';
import AddCalendar from '../calendar/addCalendar';
import AddEvent from '../events/addEvent';
import Statistics from '../statistics';
import Settings from '../settings';
import SideBar from '../sidebar/SideBar';
import {DrawerNavigator, StackNavigator} from 'react-navigation';

export default (DrawNav = DrawerNavigator({

        Dashboard: {screen: Dashboard},
        Calendars: {screen: Calendars},
        Events: {screen: Events},
        Statistics: {screen: Statistics},
        AddCalendar:{screen: AddCalendar},
        AddEvent :{screen: AddEvent},
        Settings : {screen: Settings}

    },
    {
        contentComponent: props => <SideBar {...props} />
    }
));



