import React from 'react';
import HomePageContainer from './components/HomePageContainer/HomePageContainer';
import { fetchUserDetails } from '@/app/actions/userActions';
import { auth, currentUser } from '@clerk/nextjs/server';

async function page() {
    const { userId } = await auth();

    let userDetails;
    let user;

    if (userId) {
        user = await currentUser()
        userDetails = await fetchUserDetails(userId);

    }



    return (
        <div className="w-full h-full px-4 md:px-8">
            <HomePageContainer userId={userId} userDetails={userDetails} />
        </div>
    );
}

export default page;
