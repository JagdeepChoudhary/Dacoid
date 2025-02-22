import { BrowserRouter, Route, Routes } from "react-router";
import AuthPage from "./components/authPage.jsx";
import CreateQuiz from "./components/create.jsx";
import Layout from "./components/layout";
import Home from "./components/Home";
import Quiz from "./components/QuizAttempt";
import MyAttempts from "./components/MyAttempts";
import ViewAttempt from "./components/ViewAttempt";
import MyCreatedTests from "./components/MyCreatedTests";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="/create" element={<CreateQuiz />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/attempts" element={<MyAttempts />} />
            <Route path="/attempt/:attemptId" element={<ViewAttempt />} />
            <Route path="/my-created-tests" element={<MyCreatedTests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
