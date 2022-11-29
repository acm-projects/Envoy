import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
            label: {
                name: 'Name',
                email: 'Email',
                password: 'Password',
                language: 'Select your language:',
                signup: 'Sign Up'
            },
            navbar: {
                home: 'Home',
                library: 'Library',
                upload: 'Upload',
                login: 'Log In'
            }
        }
      },
      is: {
        translation: {
          label: {
            name: 'Nafn',
            email: 'Tölvupóstfang',
            password: 'Lykilorð',
            language: 'Veldu tungumál:',
            signup: 'Skráðu þig'
          },
          navbar: {
            home: 'Heim',
            library: 'Bókasafn',
            upload: 'Hlaða',
            login: 'Innskráning'
          }
        }
      }
    }
  });

export default i18n;