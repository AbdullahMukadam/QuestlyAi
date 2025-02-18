import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    interviewQuestions : null
}

export const InterviewQuestionSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        addQuestions: (state, action) => {
            state.interviewQuestions = action.payload
        },
        removeQuestions: (state, action) => {
            state.interviewQuestions = null
        }

    },
})


export const { addQuestions, removeQuestions } = InterviewQuestionSlice.actions

export default InterviewQuestionSlice.reducer