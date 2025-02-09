"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import AfterLoginHomepage from '../AfterLoginHomepage/AfterLoginHomepage'
import LandingPage from '../landing-page/LandingPage'

function HomePageContainer() {
    const authStatus = useSelector((state) => state.auth.authStatus)
    return (
        <div className='w-full h-full'>
            {authStatus ? <AfterLoginHomepage /> : <LandingPage />}
        </div>
    )
}

export default HomePageContainer