import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },
                options: [
                    {
                        option: {
                            type: String,
                        },
                    },
                ],
                answer: {
                    type: Number,
                    required: true,
                },
                mark: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                negativeMarks: {
                    type: Number,
                    default: 0, // Default to 0 if no negative marking
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Quiz", quizSchema);
