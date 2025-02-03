import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Book, Search, Bookmark } from "lucide-react";

export default function Layout({ children }) {
  // Initialize darkMode state from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // Update localStorage and apply dark mode class to the document
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-emerald-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">myQuran</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/search" className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-gray-800">
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <Link to="/bookmarks" className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-gray-800">
                <Bookmark className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}