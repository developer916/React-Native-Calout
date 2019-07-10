import i18n from 'i18next';
// import Expo from 'expo';
//
//
// const languageDetector = {
//     type: 'languageDetector',
//     async: true, // async detection
//     detect: (cb) => {
//         return Expo.Util.getCurrentLocaleAsync()
//             .then(lng => { cb(lng); })
//     },
//     init: () => {},
//     cacheUserLanguage: () => {}
// }


import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // fallbackLng: 'en',
        fallbackLng: 'gm',
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        // resources: {
        //     en: {
        //         home: {
        //             title: 'Welcome'
        //         }
        //     },
        //     de: {
        //         home: {
        //             title: 'Willkommen'
        //         }
        // },

        react:{
            wait : true,
        }
    });
export default i18n;