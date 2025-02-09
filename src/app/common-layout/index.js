"use client"
import React from 'react'
import Navbar from '../components/common/Navbar'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { ClerkProvider } from '@clerk/nextjs'

function CommonLayout({ children }) {
    return (
        <div className='mx-auto'>
            <ClerkProvider>
                <Provider store={store}>
                    <Navbar />
                    <main>{children}</main>
                </Provider>
            </ClerkProvider>


        </div>
    )
}

export default CommonLayout