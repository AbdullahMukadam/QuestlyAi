"use client"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AfterLoginHomepage from '../AfterLoginHomepage/AfterLoginHomepage'
import LandingPage from '../landing-page/LandingPage'
import { login } from '@/app/store/AuthSlice'
import { useRouter } from 'next/navigation'
import { addData } from '@/app/store/UserDataSlice'


function HomePageContainer({ userId, userDetails }) {
    const authStatus = useSelector((state) => state.auth.authStatus)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (userId && !authStatus) {
            dispatch(login())
            localStorage.setItem("authStatus", "true")

            if (!userDetails?._id) {
                router.push("/onboard")
            } else {
                dispatch(addData(userDetails))
                if (window.location.pathname !== '/') {
                    router.push("/")
                }
            }
        }
    }, [userId, userDetails, dispatch, router])

    if (userId && !authStatus) {
        return (
            <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div
                    className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                >
                    <div
                        className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                    ></div>
                </div>
            </div>

        )
    }

    return (
        <div className='w-full h-full'>
            {authStatus ? <AfterLoginHomepage /> : <LandingPage />}
        </div>
    )
}

export default HomePageContainer