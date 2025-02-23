"use client"
import React from 'react';
import Navbar from '../components/common/Navbar';
import { Provider } from 'react-redux';
import { store, persistor } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';

function CommonLayout({ children }) {
    return (
        <div className='mx-auto'>
            <ClerkProvider>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <Navbar />
                        <main>{children}</main>
                        <Toaster />
                    </PersistGate>
                </Provider>
            </ClerkProvider>
        </div>
    );
}

export default CommonLayout;
