import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {useMainContext} from '../hooks/useMainContext';
import PTBR from './locales/pt/pt-br.json';
import ENUS from './locales/en/en-us.json';
import ES from './locales/es/es.json';

const resources = {
    'pt-BR': PTBR,
    'en-US': ENUS,
    'es': ES
}

const config = {
    resources: resources,
    lng: 'en-US',
    interpolation:{
        escapeValue: false
    }
}

i18n.use(initReactI18next).init(config)

export default i18n;