import React, {Component} from 'react';
import {
    Container,
    Content,
} from 'native-base';
import {connect} from 'react-redux';
import {ScrollView, Text, TextInput, View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Platform} from 'react-native';
import {containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import I18n  from '../../../i18n/i18n';

class RegisterConfirm extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <Container>
                <Content>
                    <View style={{flex: 1, backgroundColor: 'transparent'}}>
                        <ScrollView style={containerStyle}>
                            <View style={{marginTop: 40}}>
                                <Text style={{fontSize:16}}>{I18n.t('auth.confirm_description_1')}</Text>
                                <Text style={{fontSize:16, marginBottom:40}}>{I18n.t('auth.confirm_description_2')}</Text>
                                <TouchableOpacity
                                        style={{backgroundColor: '#611f69',borderColor: '#601f80',  paddingTop: 15, paddingBottom: 15, marginTop: 15}}
                                        onPress={() => this.props.navigation.navigate("Login")}
                                        underlayColor='#fff'>
                                    <Text style={{color: '#fff', textAlign: 'center', fontSize: 18}}>{I18n.t('auth.confirm_description_3')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Content>
            </Container>
        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        userId : state.auth.userId,
        companyId: state.auth.companyId,
        confirmationLink: state.auth.confirmationLink,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType
    };
};


export default connect(mapStateToProps)(RegisterConfirm);