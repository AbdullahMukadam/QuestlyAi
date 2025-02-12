"use client"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AfterLoginHomepage from '../AfterLoginHomepage/AfterLoginHomepage'
import LandingPage from '../landing-page/LandingPage'
import { login } from '@/app/store/AuthSlice'

function HomePageContainer({ userId, username }) {
    const authStatus = useSelector((state) => state.auth.authStatus)
    const UserData = useSelector((state) => state.auth.userData)
    const dispatch = useDispatch()

    useEffect(() => {
        const userData = {
            ...UserData,
            userId,
            username
        }
        if (userId || authStatus) {
            dispatch(login(userData))
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