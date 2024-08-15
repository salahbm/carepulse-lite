import React from 'react';
import TranslationsProvider from './intl';
const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TranslationsProvider>{children}</TranslationsProvider>
    </>
  );
};

export default RootProvider;
