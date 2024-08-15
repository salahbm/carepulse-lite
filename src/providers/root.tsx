import React from 'react';
import TranslationsProvider from './intl';
import ToastProvider from './toast';
const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TranslationsProvider>
        {children}
        <ToastProvider />
      </TranslationsProvider>
    </>
  );
};

export default RootProvider;
