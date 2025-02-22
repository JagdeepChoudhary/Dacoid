import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import AuthPage from "./components/authPage.jsx";
createRoot(document.getElementById("root")).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  </ThemeProvider>
);
