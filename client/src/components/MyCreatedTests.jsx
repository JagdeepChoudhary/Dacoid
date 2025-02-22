import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function MyCreatedTests() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  //  Fetch User's Created Quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/quiz/myquizzes",
          { withCredentials: true }
        );
        setQuizzes(response.data.quizzes);
      } catch (error) {
        toast.error("Failed to load your created quizzes.");
        console.error("Fetch error:", error);
      }
    };

    fetchQuizzes();
  }, []);

  //  Handle Delete Quiz
  const handleDelete = async (quizId) => {
    try {
      await axios.delete(`http://localhost:8000/api/quiz/${quizId}`, {
        withCredentials: true,
      });
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
      toast.success("Quiz deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete quiz.");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">My Created Tests</h1>

      {quizzes.map((quiz) => (
        <Card key={quiz._id}>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
            <p className="text-sm text-gray-500">{quiz.description}</p>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={() => navigate(`/quiz/${quiz._id}`)}>View</Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(quiz._id)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
