import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full 
      bg-black/80 text-white dark:bg-white/90 dark:text-black
      backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  )
}
