// symbol polyfills
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');

// collection fn polyfills
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import {StyleSheet, Text, View, StatusBar, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {store, persistor} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import App from './src/app';
import {getStatusBarHeight} from 'react-native-status-bar-height';
// import { I18nextProvider } from "react-i18next";
// import i18n from "./i18n";

export default class CalendarSubscriptionApp extends Component {
    render() {
        return (
            // <I18nextProvider i18n={i18n}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <View style={styles.container}>
                            <View style = {{backgroundColor: '#611f69', height : Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight }}>
                                <StatusBar
                                        barStyle="light-content"
                                        hidden = { false }
                                        backgroundColor = "#611f69"
                                        translucent = {true}
                                        networkActivityIndicatorVisible={true}
                                />
                            </View>
                            <App/>
                        </View>

                    </PersistGate>
                </Provider>
            // </I18nextProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },


});



AppRegistry.registerComponent('CalendarSubscriptionApp', () => CalendarSubscriptionApp);