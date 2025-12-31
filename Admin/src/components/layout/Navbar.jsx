import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex justify-end p-4 bg-white dark:bg-slate-800">
      <button onClick={toggleTheme}>
        {theme === "dark" ? <Sun /> : <Moon />}
      </button>
    </header>
  );
};

export default Navbar;
