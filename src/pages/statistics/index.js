import React, {Component} from "react";
import Statistics from './statistics';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    Statistics : {screen: Statistics}
}));