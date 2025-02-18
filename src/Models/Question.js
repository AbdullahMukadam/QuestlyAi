import mongoose from "mongoose";


const QuestionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    jobExperience: {
        type: String,
        required: true
    },
    data: {
        type: Array,
        required: true
    }
})

const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export default Question