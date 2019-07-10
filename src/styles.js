// AppBar (Header) styles

import {Platform} from 'react-native';
export const bgStatusBar = '#611f69';
export const bgHeader = '#611f69';
export const headerColor = '#fff';
export const bgContainer = '#f5f5f5';
export const inputStyle = {
    flex: 1,
    paddingLeft: 0,
    marginLeft: 10,
    borderBottomWidth: 0,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,

};

export const iconInputBox = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    marginBottom: 10
};

export const iconInvalidInputBox ={
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ff5454',
    marginBottom: 10
};

export const invalidFeedback = {
    color: '#ff5454',
    fontSize: 14,
    textAlign: 'left'
};

export const invalidViewBox = {
    marginBottom : 10
};

export const hideViewBox = {
  display: 'none'
};

export const containerStyle = {
    padding: 20,
    backgroundColor: 'transparent',
    flex: 1
};

export const invalidLabel = {
    color: '#ff5454'
};


export const selectPickerTextStyle = {
    textAlign :'left',
    color: 'black',
    width : '100%',
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 0,
    marginRight: 0
}

export const notificationPickerTextStyle={
    textAlign: 'center',
    width : '100%',
    paddingBottom: 5,
    paddingLeft: 0,
    paddingRight : 0,
    marginBottom: 0,
    color: 'black',
}
export const pickerStyle = {
    width: '100%',
    paddingBottom: 0,
    paddingTop:0,
    ...Platform.select({
        android: {
            color: 'black',
        }
    })
}

export const selectPickerStyle={
	width : '100%',
	...Platform.select({
            android: {
                color: 'black',
				paddingLeft: 0,
				paddingRight: 0,
				marginLeft: 0,
				marginRight: 0
            }
        })
	
    
    
}