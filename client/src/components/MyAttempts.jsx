import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function MyAttempts() {
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  // Fetch Attempted Quizzes
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await axios.get(
          "https://dacoid-4wwu.onrender.com/api/quiz/attempts/my",
          { withCredentials: true }
        );
        setAttempts(response.data.attempts);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load attempted quizzes"
        );
      }
    };

    fetchAttempts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Attempted Quizzes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {attempts.length === 0 ? (
            <p className="text-center text-gray-500">
              No quizzes attempted yet.
            </p>
          ) : (
            attempts.map((attempt) => (
              <div
                key={attempt._id}
                className="border p-4 rounded-lg shadow-md space-y-2"
              >
                <h2 className="text-xl font-semibold">
                  {attempt.quiz?.title || "Quiz Title"}
                </h2>
                <p className="text-sm text-gray-500">
                  {attempt.quiz?.description || "Quiz Description"}
                </p>
                <p className="text-md">
                  <span className="font-bold">Score:</span> {attempt.score}
                </p>
                <p className="text-sm text-gray-500">
                  Attempted on: {new Date(attempt.createdAt).toLocaleString()}
                </p>
                <Button
                  onClick={() => navigate(`/attempt/${attempt._id}`)}
                  variant="outline"
                >
                  View Details
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
