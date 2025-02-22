import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // 🛑 Prevent Page Reload/Exit
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Your progress will be lost if you leave!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 🟢 Fetch Quiz Data
  useEffect(() => {
    if (!id) {
      toast.error("Invalid quiz ID");
      navigate("/");
      return;
    }

    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `https://dacoid-4wwu.onrender.com/api/quiz/${id}`,
          {
            withCredentials: true,
          }
        );
        setQuiz(response.data.quiz);
      } catch (error) {
        toast.error("Failed to load quiz");
        navigate("/");
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  // ⏲️ Timer Logic
  useEffect(() => {
    if (!quiz || showScore || isAnswerRevealed) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(""); // Auto-submit on timeout
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quiz, showScore, isAnswerRevealed]);

  // 🎯 Handle Answer Selection
  const handleAnswer = (userInput) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    let correctAnswer;
    let userAnswer;
    let isCorrect = false;

    if (currentQuestion.options.length > 0) {
      // MCQ Question
      userAnswer = currentQuestion.options[userInput]?.option || "";
      correctAnswer = currentQuestion.options[currentQuestion.answer]?.option;
      isCorrect = userInput === currentQuestion.answer;
    } else {
      // Numeric Question
      userAnswer = userInput.toString();
      correctAnswer = currentQuestion.answer.toString();
      isCorrect = userAnswer === correctAnswer;
    }

    // Update selected answers with the current answer
    const updatedAnswers = [
      ...selectedAnswers,
      {
        question: currentQuestion.question,
        answer: userAnswer,
        CorrectAnswer: isCorrect,
      },
    ];
    setSelectedAnswers(updatedAnswers);

    // Update score
    setScore((prev) =>
      isCorrect
        ? prev + currentQuestion.mark
        : prev - (currentQuestion.negativeMarks || 0)
    );

    // Show feedback and proceed
    setIsAnswerRevealed(true);
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(30);
        setIsAnswerRevealed(false);
      } else {
        saveAttempt(updatedAnswers);
        setShowScore(true);
      }
    }, 2000);
  };

  // 💾 Save Quiz Attempt
  const saveAttempt = async (finalAnswers) => {
    try {
      const attemptData = {
        quiz: quiz._id,
        attemptedQuestions: quiz.questions.map((q, index) => ({
          question: q.question,
          answer: finalAnswers[index]?.answer?.toString() || "",
          CorrectAnswer: finalAnswers[index]?.CorrectAnswer || false,
        })),
        score: score,
      };

      await axios.post(
        "https://dacoid-4wwu.onrender.com/api/quiz/attempt",
        attemptData,
        {
          withCredentials: true,
        }
      );

      toast.success("Attempt saved successfully!");
    } catch (error) {
      toast.error("Failed to save attempt");
      console.error("Save error:", error);
    }
  };

  if (!quiz) return <div className="text-center p-8">Loading quiz...</div>;

  if (showScore) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl mb-4">Quiz Completed!</h2>
        <p className="text-xl">
          Final Score: {score}
          {quiz.questions.reduce((total, q) => total + q.mark, 0)}
        </p>
        <Button className="mt-4" onClick={() => navigate("/")}>
          Return to Home Page
        </Button>
      </div>
    );
  }
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Progress value={(timeLeft / 30) * 100} />
        <div className="flex justify-between mt-2">
          <span>Time Left: {timeLeft}s</span>
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {currentQuestion.options.length > 0 ? (
            currentQuestion.options.map((option, index) => (
              <Button
                key={option._id}
                onClick={() => handleAnswer(index)}
                disabled={isAnswerRevealed}
                className={`
                  text-left h-auto py-4
                  ${
                    isAnswerRevealed
                      ? index === currentQuestion.answer
                        ? "bg-green-500" // Green for correct answer
                        : selectedAnswers[currentQuestionIndex] === index
                        ? "bg-red-500" // Red for incorrect answer
                        : "" // Default outline
                      : "bg-outline" // Default outline
                  }
                `}
              >
                {option.option}
              </Button>
            ))
          ) : (
            <Input
              type="number"
              placeholder="Enter your answer"
              onKeyDown={(e) =>
                e.key === "Enter" && handleAnswer(e.target.value)
              }
              className="text-left h-auto py-4"
              disabled={isAnswerRevealed}
            />
          )}

          {isAnswerRevealed && (
            <p className="text-green-500 mt-2">
              Correct Answer:{" "}
              {currentQuestion.options.length
                ? currentQuestion.options[currentQuestion.answer].option
                : currentQuestion.answer}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
