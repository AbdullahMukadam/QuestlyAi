import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './AuthSlice'
import UserDataSlice from './UserDataSlice'

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        userData: UserDataSlice
    },
})