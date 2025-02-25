"use client"
import React from 'react';
import Navbar from '../components/common/Navbar';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import { useSessionCheck } from '@/hooks/useSessionCheck';

function CommonLayout({ children }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SessionCheckWrapper>
            <div className='mx-auto'>
              <Navbar />
              <main>{children}</main>
              <Toaster />
            </div>
          </SessionCheckWrapper>
        </PersistGate>
      </Provider>
    </ClerkProvider>
  );
}

// Separate component to use hooks after ClerkProvider is initialized
function SessionCheckWrapper({ children }) {
  useSessionCheck();
  return children;
}

export default CommonLayout;
