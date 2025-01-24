import React from 'react'
import Navbar from '../components/common/Navbar'

function CommonLayout({ children }) {
    return (
        <div className='mx-auto'>
            <Navbar />
            <main>{children}</main>
        </div>
    )
}

export default CommonLayout