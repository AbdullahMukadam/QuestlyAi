import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './AuthSlice'
import UserDataSlice from './UserDataSlice'
import InterviewQuestionSlice from './InterviewQuestionSlice'

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        userData: UserDataSlice,
        interview: InterviewQuestionSlice
    },
})