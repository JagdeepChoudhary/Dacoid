import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ViewAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attemptData, setAttemptData] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Fetch Attempt Details
  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        const response = await axios.get(
          `https://dacoid-4wwu.onrender.com/api/quiz/attempt/${attemptId}`,
          { withCredentials: true }
        );
        setAttemptData(response.data.attempt);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load attempt details"
        );
        navigate("/my-attempts");
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptDetails();
  }, [attemptId, navigate]);

  if (loading) {
    return <div className="text-center p-8">Loading attempt details...</div>;
  }

  if (!attemptData) {
    return <div className="text-center p-8">No attempt data found.</div>;
  }

  const { quiz, attemptedQuestions, score } = attemptData;

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/*  Quiz Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>{quiz?.title || "Quiz Title"}</CardTitle>
          <p className="text-sm text-gray-500">
            {quiz?.description || "Quiz Description"}
          </p>
          <p className="mt-2 font-semibold text-lg">
            Your Score: {score} /{" "}
            {quiz.questions.reduce((sum, q) => sum + q.mark, 0)}
          </p>
        </CardHeader>
      </Card>

      {/*  Display Questions and Answers */}
      {quiz?.questions?.map((question, index) => {
        const attempted = attemptedQuestions[index];

        return (
          <Card key={index} className="space-y-4">
            <CardHeader>
              <CardTitle>
                {index + 1}. {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/*  Display Multiple-Choice Options */}
              {question.options.length > 0 ? (
                question.options.map((option, optIndex) => {
                  const isCorrectAnswer = optIndex === question.answer;
                  const isUserAnswer = attempted?.answer === option.option;
                  const isUserCorrect = attempted?.CorrectAnswer;

                  return (
                    <Button
                      key={optIndex}
                      variant="outline"
                      className={`text-left h-auto py-2 w-full ${
                        isCorrectAnswer
                          ? "bg-green-500 text-white" // Correct answer
                          : isUserAnswer
                          ? isUserCorrect
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          : ""
                      }`}
                      disabled
                    >
                      {option.option}
                    </Button>
                  );
                })
              ) : (
                //  Display Numeric Answer
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="font-bold">Your Answer:</span>{" "}
                    {attempted?.answer || "Not Answered"}
                  </p>
                  <p className="text-green-600">
                    Correct Answer: {question.answer}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/*  Back Button */}
      <Button onClick={() => navigate("/attempts")} className="mt-4">
        Back to My Attempts
      </Button>
    </div>
  );
}
