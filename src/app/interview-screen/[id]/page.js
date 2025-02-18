import InterviewScreen from '@/app/components/InterviewScreen/InterviewScreen'
import React from 'react'

async function page({params}) {
    const id = await params
    return (
        <div className='w-full p-3'>
            <InterviewScreen id={id.id} />
        </div>
    )
}

export default page