import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    authStatus: false,
}

export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.authStatus = true
        },
        logout: (state) => {
            state.authStatus = false
        }

    },
})


export const { login, logout } = AuthSlice.actions

export default AuthSlice.reducer