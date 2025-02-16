import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userData: null
}

export const UserDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        addData: (state, action) => {
            state.userData = action.payload
        },
        removeData: (state, action) => {
            state.userData = null
        }

    },
})


export const { addData, removeData } = UserDataSlice.actions

export default UserDataSlice.reducer