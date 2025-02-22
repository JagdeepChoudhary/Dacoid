import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  // Add a new Multiple-Choice Question (MCQ)
  const handleAddMCQ = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        answer: "", // Index of correct option for MCQ
        mark: 1,
        negativeMarks: 0,
        type: "mcq",
      },
    ]);
  };

  // Add a new Numeric Question
  const handleAddNumeric = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answer: "", // Direct answer for numeric questions
        mark: 1,
        negativeMarks: 0,
        type: "numeric",
      },
    ]);
  };

  // Handle changes to question text, answer, mark, and negative marks
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Handle changes to individual options of a question
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Submit form and create quiz
  const handleSubmit = async (e) => {
    e.preventDefault();

    const quizData = {
      title,
      description,
      questions: questions.map((q) => ({
        question: q.question,
        options:
          q.type === "mcq" ? q.options.map((option) => ({ option })) : [],
        answer:
          q.type === "mcq"
            ? Number(q.options.indexOf(q.answer)) - 1
            : Number(q.answer),
        mark: Number(q.mark),
        negativeMarks: Number(q.negativeMarks),
      })),
    };

    try {
      const response = await axios.post(
        "https://dacoid-4wwu.onrender.com/api/quiz/create",
        quizData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      console.log(response);

      if (response.status === 201) {
        toast.success("Quiz created successfully");
        navigate("/");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create quiz");
      }
    } catch (error) {
      toast.error("Failed to create quiz");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Quiz Title</Label>
              <Input
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Quiz Description</Label>
              <Textarea
                placeholder="Enter quiz description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="space-y-4 border-b pb-4">
                <div className="space-y-1">
                  <Label>Question {questionIndex + 1}</Label>
                  <Textarea
                    placeholder="Enter question"
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        "question",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                {question.type === "mcq" && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="space-y-1">
                        <Label>Option {optionIndex + 1}</Label>
                        <Input
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              questionIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-1">
                  <Label>Correct Answer</Label>
                  <Input
                    type="number"
                    placeholder={
                      question.type === "mcq"
                        ? "Enter the correct option index"
                        : "Enter the numeric answer"
                    }
                    value={question.answer}
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        "answer",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="space-y-1 w-1/2">
                    <Label>Mark</Label>
                    <Input
                      type="number"
                      placeholder="Mark"
                      value={question.mark}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "mark",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1 w-1/2">
                    <Label>Negative Marks</Label>
                    <Input
                      type="number"
                      placeholder="Negative Marks"
                      value={question.negativeMarks}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "negativeMarks",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between gap-4">
              <Button type="button" onClick={handleAddMCQ}>
                Add MCQ Question
              </Button>
              <Button type="button" onClick={handleAddNumeric}>
                Add Numeric Question
              </Button>
              <Button type="submit" className="flex-1">
                Create Quiz
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
