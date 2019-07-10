import I18n from 'react-native-i18n';
import en from './locales/en';
import gm from './locales/gm';

I18n.fallbacks = true;
I18n.missingBehaviour = 'guess';
I18n.defaultLocale = 'gm';
I18n.locale = 'gm';
I18n.translations = {
    gm,
    en
};

export const switchLanguage = (lang, component) => {
    I18n.locale = lang;
    component.forceUpdate();
};

export const getCurrentLocale = () => {
    return I18n.locale;
}

export const translateHeaderTextByProps = (langKey, language) => {
    let  title = I18n.translate(langKey, {locale: language});
    return title;
};

export const translateHeaderText = (langKey) => ({screenProps}) => {
    const title = I18n.translate(langKey, screenProps.language);
    return {title};
};



export const strings = (name, params = {}) => I18n.t(name, params);


export default I18n;

