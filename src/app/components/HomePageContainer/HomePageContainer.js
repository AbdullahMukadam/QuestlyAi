"use client"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AfterLoginHomepage from '../AfterLoginHomepage/AfterLoginHomepage'
import LandingPage from '../landing-page/LandingPage'
import { login } from '@/app/store/AuthSlice'
import { useRouter } from 'next/navigation'

function HomePageContainer({ userId, userDetails }) {
    const authStatus = useSelector((state) => state.auth.authStatus)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (userId && userDetails?._id) {
            dispatch(login(userDetails))
            router.push("/")
        } else if(userId && !userDetails?._id){
            dispatch(login())
            router.push("/onboard")
        }

    }, [userId, dispatch])

    return (
        <div className='w-full h-full'>
            {authStatus ? <AfterLoginHomepage /> : <LandingPage />}
        </div>
    )
}

export default HomePageContainer