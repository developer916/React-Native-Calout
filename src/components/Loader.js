import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';

const Loader = props => {
    const {
            loading,
            ...attributes
    } = props;

    if(loading){
        return (
            <View style={styles.positionAbsoluteBackground}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            animating={ true } />

                    </View>
                </View>
            </View>
        )
    } else {
        return (
            <View></View>
        );
    }


};

const styles = StyleSheet.create({
    positionAbsoluteBackground :{
       position: 'absolute',
       left:0,
       bottom: 0,
       width : '100%',
       height: '100%',
       zIndex: 1000,
       backgroundColor: '#00000040'
    },
    modalBackground: {
       flex: 1,
       alignItems: 'center',
       flexDirection: 'column',
       justifyContent: 'space-around',
       backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
});

export default Loader;