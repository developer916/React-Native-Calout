import React, {Component} from "react";
import Login from './login';
import Register from './register'
import Address from './address';
import Sepa from './sepa';
import RegisterConfirm from './confirm';
import {DrawerNavigator, StackNavigator} from 'react-navigation';
import I18n from '../../../i18n/i18n';

export default (DrawNav = DrawerNavigator({
    Login: {screen: Login},
    Register: {screen: Register},
    Address : {screen: Address},
    Sepa : {screen : Sepa},
    Confirm: {screen: RegisterConfirm}
}));
