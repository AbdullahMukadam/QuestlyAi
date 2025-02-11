"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import AfterLoginHomepage from '../AfterLoginHomepage/AfterLoginHomepage'
import LandingPage from '../landing-page/LandingPage'

function HomePageContainer({ userId, username }) {
    const authStatus = useSelector((state) => state.auth.authStatus)
    //dispatch the userId and username
    return (
        <div className='w-full h-full'>
            {authStatus ? <AfterLoginHomepage /> : <LandingPage />}
        </div>
    )
}

export default HomePageContainer