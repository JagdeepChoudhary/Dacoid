import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router"; // Corrected import for routing
import { toast } from "sonner";

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Fetch quizzes from backend using Axios
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/quiz", {
          withCredentials: true,
        });

        setQuizzes(
          Array.isArray(response.data.quizzes) ? response.data.quizzes : []
        );

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to fetch quizzes",
          variant: "destructive",
        });
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Loading quizzes...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(quizzes) && quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <Card key={quiz._id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Number of questions: {quiz.questions.length}
                </p>
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
                >
                  Start Quiz
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full">No quizzes available.</p>
        )}
      </div>
    </div>
  );
}
