import React from 'react'
import HomePageContainer from './components/HomePageContainer/HomePageContainer'
import { currentUser } from '@clerk/nextjs/server'

async function page() {

  const user = await currentUser()
  let userId;
  let username;
  if (user) {
    userId = user.id
    username = user.username
  }
  return (
    <div className='w-full h-full px-4 md:px-8 '>
      <HomePageContainer userId={userId} username={username} />
    </div>
  )
}

export default page