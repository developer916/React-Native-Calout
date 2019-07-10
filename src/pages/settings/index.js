import React, {Component} from "react";
import Settings from './settings';
import ChangePassword from './password';
import CompanyAddress from './address';
import CompanySepa from './sepa';
import CompanySMTP from './smtp';
import Language from './language';
import {StackNavigator} from 'react-navigation';

export default (DrawNav = StackNavigator({
    Settings : {screen: Settings},
    ChangePassword: {screen: ChangePassword},
    CompanyAddress: {screen : CompanyAddress},
    CompanySepa : {screen : CompanySepa},
    CompanySMTP: {screen: CompanySMTP},
    Language : {screen: Language}
}));