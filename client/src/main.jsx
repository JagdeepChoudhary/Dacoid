import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

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
