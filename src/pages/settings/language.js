import React, {Component} from 'react';
import {
    Button,
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Title,
    Text,
    Item,
    Label,
} from 'native-base';

import {connect} from 'react-redux';
import {ScrollView,  TextInput, View, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Platform,StatusBar} from 'react-native';
import {bgHeader, invalidLabel, bgContainer,containerStyle, iconInputBox,inputStyle, iconInvalidInputBox, invalidFeedback, invalidViewBox, hideViewBox} from "../../styles";
import Loader from '../../components/Loader';
import s from '../Style';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import { CheckBox } from 'react-native-elements'
import I18n,{getCurrentLocale, switchLanguage, translateHeaderTextByProps}  from '../../../i18n/i18n';
import {changeLanguage} from "../../actions/Service";

class Language extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language : "gm",
            select_gm : false,
            select_en : false,
        }
    }
    componentDidMount(){
        let language = getCurrentLocale();
        if(language == "gm"){
            this.setState({
                select_gm : true,
                select_en : false,
            });
        } else {
            this.setState({
                select_gm : false,
                select_en : true,
            });
        }
        this.props.navigation.setParams({title: translateHeaderTextByProps('settings.set_language', language)});
    }

    handleChange (name, value){
        if(name == 'select_gm'){
            this.setState({ select_gm : value, select_en : !this.state.select_en});
            switchLanguage("gm", this);
            this.props.changeLanguage('gm');
        } else {
            this.setState({ select_en : value, select_gm : !this.state.select_gm});
            switchLanguage("en", this);
            this.props.changeLanguage('en');
        }
        console.log("language", getCurrentLocale());
        let currentLanguage = getCurrentLocale();
        this.props.navigation.setParams({title: translateHeaderTextByProps('settings.set_language', currentLanguage)});
    }

    render() {
        return (
            <Container>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                    <Loader loading={this.props.isLoading}/>
                    <ScrollView style={containerStyle}>
                        <View style={{marginTop: 20}}>
                            <Text style={{fontSize:20, marginBottom:20}}> {I18n.t('settings.select_language')} </Text>
                            <View style={{marginTop: 20}}>
                                <CheckBox
                                    title={I18n.t('header.german')}
                                    checked={this.state.select_gm}
                                    onPress={() => this.handleChange('select_gm', !this.state.select_gm)}
                                    containerStyle={{backgroundColor: 'transparent', borderWidth:0, margin: 0}}
                                    textStyle = {{color: '#575757', fontSize: 15, fontWeight: '400' }}
                                />

                                <CheckBox
                                    title={I18n.t('header.english')}
                                    checked={this.state.select_en}
                                    onPress={() => this.handleChange('select_en', !this.state.select_en)}
                                    containerStyle={{backgroundColor: 'transparent', borderWidth:0, margin: 0}}
                                    textStyle = {{color: '#575757', fontSize: 15, fontWeight: '400' }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Container>
        )
    }
}
Language.navigationOptions = ({navigation, screenProps }) => ({
    header: (
        <Header style={s.menuHeader}>
            <Left>
                <Button transparent onPress={() => navigation.goBack()}>
                    <Icon name="md-arrow-back" style={s.menuIcon}/>
                </Button>
            </Left>
            <Body>
            <Title style={{width: 230, color: '#fff'}}>
                {(() =>{
                    let {params} = navigation.state
                    if(!_.isEmpty(params)){
                        return (params.title)
                    } else {
                        return(I18n.t('settings.set_language'));
                    }
                })()}
                {/*{I18n.t('settings.set_language')}*/}

            </Title>
            </Body>
            <Right>
                <Button transparent onPress={() => navigation.navigate("Dashboard")}>
                    <Icon name="md-home" style={s.menuIcon}/>
                </Button>
            </Right>
            <StatusBar
                barStyle="light-content"
                hidden = { false }
                backgroundColor = "#611f69"
                translucent = {true}
                networkActivityIndicatorVisible={true}
            />
        </Header>
    )
});

const mapStateToProps = (state, reference) => {
    return {
        role:  state.auth.role,
        userId : state.auth.userId,
        name: state.auth.name,
        companyId: state.auth.companyId,
        isLoading: state.service.isLoading,
        error: state.service.error,
        data: state.service.data,
        requestType: state.service.requestType,
        languageProps : state.reference.language,
        reference
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        changeLanguage: (language) => {
            dispatch(changeLanguage(language));
        }
    };
};
export default connect (mapStateToProps, mapDispatchToProps) (Language);