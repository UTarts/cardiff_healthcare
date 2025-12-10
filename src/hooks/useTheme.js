import { useState, useEffect } from "react";

export default function useTheme() {
  // 1. Check if the user already visited and chose a theme
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // 2. Whenever 'theme' changes, update the HTML tag and save to memory
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save preference so it remembers next time
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3. The function we call to switch modes
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}