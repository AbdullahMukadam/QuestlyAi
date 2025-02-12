import React from 'react'
import HomePageContainer from './components/HomePageContainer/HomePageContainer'
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { fetchUserDetails } from '@/hooks/fetchUserDetailsHook';

async function page() {
    const { userId } = await auth()
    const user = await currentUser()
    let profileDetails = await fetchUserDetails(userId)
    if (userId) {
        if (user && !profileDetails?._id) {
            redirect("/onboard")
        } else if (user && profileDetails?._id) redirect("/")
    }



    return (
        <div className='w-full h-full px-4 md:px-8 '>
            <HomePageContainer userId={userId} />
        </div>
    )
}

export default page