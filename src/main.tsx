import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 다크모드 플래시 방지 - 초기 설정
const rootElement = document.getElementById("root");
if (rootElement) {
  const savedDarkMode = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = savedDarkMode === "true" || (savedDarkMode === null && prefersDark);
  
  if (shouldBeDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  
  createRoot(rootElement).render(<App />);
}
