import mongoose from "mongoose";

const attemptedQuiz = new mongoose.Schema({
    attemptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    attemptedQuestions: [
        {
            question: {
                type: String,
                required: true,
            },
            answer: {
                type: String,
                // required: true,
            },
            CorrectAnswer: {
                type: Boolean,
                required: true,
            },

        },
    ],
    score: {
        type: Number,
        required: true,
    },

})

export default mongoose.model("AttemptedQuiz", attemptedQuiz);