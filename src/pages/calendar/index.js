import React, {Component} from "react";
import CalendarList from './calendars';
import AddCalendar from './addCalendar';
import EditCalendar from './editCalendar';
import Events from '../events/events';
import AddEvent from '../events/addEvent';

import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    Calendars: {screen: CalendarList},
    AddCalendar : {screen: AddCalendar},
    EditCalendar: {screen: EditCalendar},
    Events: {screen: Events},
    AddEvent :{screen: AddEvent},
}));