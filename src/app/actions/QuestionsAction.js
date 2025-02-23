"use server"

import connectToDb from "@/database/connectToDb"
import Question from "@/Models/Question"
import { revalidatePath } from "next/cache"


export async function AddInterviewQuestions(questionData) {

    await connectToDb()

    const result = await Question.create(questionData)
    return JSON.parse(JSON.stringify(result))

}

export async function fetchInterviewDetails(interviewId) {
    await connectToDb()

    const result = await Question.find({ id: interviewId })
    return JSON.parse(JSON.stringify(result))
}

export async function fetchAllInterviewDetails() {
    await connectToDb()

    const result = await Question.find({})
    return JSON.parse(JSON.stringify(result))
}

export async function deleteInterview(id, pathToRevalidate) {
    await connectToDb()

    const result = await Question.findOneAndDelete({ id: id })
    if (!result) {
        return {
            success: false
        }
    }

    revalidatePath(pathToRevalidate)
    return {
        success: true
    }
}