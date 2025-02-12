"use client"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AfterLoginHomepage from '../AfterLoginHomepage/AfterLoginHomepage'
import LandingPage from '../landing-page/LandingPage'
import { login } from '@/app/store/AuthSlice'

function HomePageContainer({ userId }) {
    const authStatus = useSelector((state) => state.auth.authStatus)
    const dispatch = useDispatch()

    useEffect(() => {
        if (userId || authStatus) {
            dispatch(login(userId))
            //console.log(userData)
        }
    }, [userId, authStatus])

    return (
        <div className='w-full h-full'>
            {authStatus ? <AfterLoginHomepage /> : <LandingPage />}
        </div>
    )
}

export default HomePageContainer