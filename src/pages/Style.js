import {StyleSheet, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const styles = StyleSheet.flatten({
    menuIcon: {
        color: '#ffffff',
        fontSize: 20
    },
    removeIcon:{
        fontSize: 25,
        textAlign : 'center',
        alignItems: 'center',
        flexDirection : 'row',
        justifyContent : 'center'
    },

    header: {
        paddingTop: getStatusBarHeight(),
        height: 54 + getStatusBarHeight()
    },
    menuHeader: {
        backgroundColor: '#611f69',
        ...Platform.select({
            ios: {
                paddingTop: 30,
                height: 70
            }
        })
    },
    itemDetailIcon: {
        fontSize: 20,
        position: 'absolute',
        right: 5
    }
});

export default styles;