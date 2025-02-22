import { Router } from "express";
import { createQuiz, getQuizzes, getQuiz, submitQuizAttempt, getMyAttemptedQuizzes, getAttemptDetails, deleteQuiz, getCreatedQuizzes, } from "../controller/quiz.controller.js";
import validateuser from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/myquizzes", validateuser, getCreatedQuizzes);
router.post("/create", validateuser, createQuiz);
router.get("/", validateuser, getQuizzes);
router.delete("/:id", validateuser, deleteQuiz);
router.get("/:id", validateuser, getQuiz);
router.get("/attempts/my", validateuser, getMyAttemptedQuizzes);
router.post("/attempt", validateuser, submitQuizAttempt);
router.get("/attempt/:attemptId", validateuser, getAttemptDetails);


export default router;
