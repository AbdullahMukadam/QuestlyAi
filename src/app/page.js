import React from 'react';
import HomePageContainer from './components/HomePageContainer/HomePageContainer';
import { fetchUserDetails } from '@/app/actions/userActions';
import { auth } from '@clerk/nextjs/server';

async function page() {
    try {
        const { userId } = await auth();

        let userDetails = null;
        if (userId) {
            userDetails = await fetchUserDetails(userId);
        }

        return (
            <div className="w-full h-full px-0 md:px-0">
                <HomePageContainer
                    userId={userId}
                    userDetails={userDetails}
                />
            </div>
        );
    } catch (error) {
        console.error("Error in page component:", error);
        return (

            <div className="w-full h-full px-4 md:px-8">
                <link
                    rel="icon"
                    href="/icon.png"
                    type="image/png"
                   
                />
                <HomePageContainer userId={null} userDetails={null} />
            </div>
        );
    }
}

export default page;
