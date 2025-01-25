"use client"
import React from 'react'
import Navbar from '../components/common/Navbar'
import { Provider } from 'react-redux'
import { store } from '../store/store'

function CommonLayout({ children }) {
    return (
        <div className='mx-auto'>
            <Provider store={store}>
                <Navbar />
                <main>{children}</main>
            </Provider>

        </div>
    )
}

export default CommonLayout