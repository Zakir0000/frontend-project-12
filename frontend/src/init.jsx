import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import React from 'react';
import { Provider as RollbarProvider } from '@rollbar/react';
import App from './components/App';
import resources from './locales/index.js';
import store from './app/store';
import { connectSocket } from './services/socketService.js';
import { addMessage } from './features/messagesSlice.js';
import { addChannel, removeChannel, renameChannel } from './features/channelsSlice.js';

const rollbarConfig = {
  enabled: process.env.NODE_ENV === 'production',
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  addErrorContext: true,
  captureUncaught: true,
  captureUnhandledRejections: true,
  captureIp: true,
  environment: 'production',
};

const init = async () => {
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    debug: process.env.NODE_ENV === 'development',
    resources,
    fallbackLng: 'ru',
    lng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

  connectSocket(store.dispatch, {
    addMessage,
    addChannel,
    removeChannel,
    renameChannel,
  });

  return (
    <RollbarProvider config={rollbarConfig}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <App />
        </Provider>
      </I18nextProvider>
    </RollbarProvider>
  );
};

export default init;
