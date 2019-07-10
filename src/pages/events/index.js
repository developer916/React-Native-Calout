import React, {Component} from "react";

import EventList from './events';
import AddEvent from './addEvent';
import EditEvent from './editEvent';

import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    Events: {screen: EventList},
    AddEvent :{screen: AddEvent},
    EditEvent :{screen: EditEvent}
}));