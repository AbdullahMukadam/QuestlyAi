import React from 'react'
import HomePageContainer from './components/HomePageContainer/HomePageContainer'

async function page() {
    // Implement your own user session check here
    const userId = null;
    const username = null;
    
    return (
        <div className='w-full h-full px-4 md:px-8 '>
            <HomePageContainer userId={userId} username={username} />
        </div>
    )
}

export default page