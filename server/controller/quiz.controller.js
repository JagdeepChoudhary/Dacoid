import Quiz from "../models/quiz.model.js";
import { body, validationResult } from "express-validator";
import User from "../models/user.model.js";
import attemptedQuiz from "../models/attemptedQuiz.model.js";
import AttemptedQuiz from "../models/attemptedQuiz.model.js";

export const createQuiz = [
    body("title", "Title is required").isLength({ min: 1 }),
    body("description", "Description is required").isLength({ min: 1 }),
    body("questions", "Questions are required").isArray({ min: 1 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                success: false,
            });
        }

        try {
            const user = req.user.id;
            if (!user) {
                return res.status(403).json({
                    message: "Invalid token data",
                    success: false,
                });
            }
            const users = await User.findById(user);

            const { title, description, questions } = req.body;
            // console.log(user._id);
            const quiz = new Quiz({
                createdBy: user,
                title,
                description,
                questions,
            });
            await quiz.save();

            return res.status(201).json({
                message: "Quiz created successfully",
                success: true,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Server error",
                success: false,
            });
        }
    },
];

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        return res.status(200).json({
            quizzes,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export const getQuiz = async (req, res) => {
    try {

        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
                success: false,
            });
        }
        return res.status(200).json({
            quiz,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export const updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
                success: false,
            });
        }

        const { title, description, questions } = req.body;
        quiz.title = title;
        quiz.description = description;
        quiz.questions = questions;

        await quiz.save();

        return res.status(200).json({
            message: "Quiz updated successfully",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
                success: false,
            });
        }

        await Quiz.deleteOne({ _id: req.params.id });

        return res.status(200).json({
            message: "Quiz deleted successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export const saveAttempt = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { quiz } = req.body;

        const isQuiz = await Quiz.findById(quizId);

        if (!isQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const attempted = await AttemptedQuiz.create


    } catch (error) {
        console.error("Error saving quiz attempt:", error);
        res.status(500).json({ message: "Failed to save quiz attempt" });
    }
}

export const submitQuizAttempt = async (req, res) => {
    try {
        const attemptedBy = req.user.id;
        const { quiz, attemptedQuestions, score } = req.body;

        //  Validate required fields
        if (!quiz || !attemptedQuestions || typeof score !== "number") {
            return res.status(400).json({ message: "All fields are required" });
        }

        //  Validate attemptedQuestions array
        if (!Array.isArray(attemptedQuestions) || attemptedQuestions.length === 0) {
            return res.status(400).json({ message: "attemptedQuestions must be a non-empty array" });
        }

        //  Check the format of attemptedQuestions
        const isValidQuestions = attemptedQuestions.every(q =>
            q.question && typeof q.answer === "string" && typeof q.CorrectAnswer === "boolean"
        );

        if (!isValidQuestions) {
            return res.status(400).json({ message: "Invalid attempted questions format" });
        }

        // Create a new quiz attempt
        const newAttempt = new AttemptedQuiz({
            attemptedBy,
            quiz,
            attemptedQuestions,
            score,
        });
        // console.log(newAttempt)
        await newAttempt.save();

        res.status(201).json({
            message: "Quiz attempt submitted successfully",
            attemptId: newAttempt._id,
        });
    } catch (error) {
        console.error("Error submitting quiz attempt:", error);
        res.status(500).json({ message: "Failed to submit quiz attempt" });
    }
};

export const getMyAttemptedQuizzes = async (req, res) => {
    try {
        const userId = req.user.id;

        const attempts = await AttemptedQuiz.find({ attemptedBy: userId })
            .populate("quiz", "title description")
            .select("score attemptedQuestions createdAt");

        res.status(200).json({
            success: true,
            attempts,
        });
    } catch (error) {
        console.error("Error fetching attempted quizzes:", error);
        res.status(500).json({ message: "Failed to fetch attempted quizzes" });
    }
};
export const getAttemptDetails = async (req, res) => {
    try {
        const { attemptId } = req.params;

        // Find the attempted quiz with quiz details
        const attempt = await AttemptedQuiz.findById(attemptId)
            .populate("quiz", "title description questions")
            .lean();

        if (!attempt) {
            return res.status(404).json({
                message: "Attempt not found",
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            attempt,
        });
    } catch (error) {
        console.error("Error fetching attempt details:", error);
        res.status(500).json({ message: "Failed to fetch attempt details" });
    }
};
export const getCreatedQuizzes = async (req, res) => {
    try {
        const userId = req.user.id;

        const quizzes = await Quiz.find({ createdBy: userId })
            .select("title description createdAt")
            .sort({ createdAt: "desc" });

        res.status(200).json({
            success: true,
            quizzes,
        });
    } catch (error) {
        console.error("Error fetching created quizzes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch your created quizzes. Please try again later.",
        });
    }
};
