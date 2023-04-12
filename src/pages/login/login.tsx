import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { User } from "../../types/user";
import { useTheme } from "next-themes";
import { getUser } from "../../controllers/user";

const Login: FC = () => {
  const user = useSelector((state: User) => state);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    (async () => {
      getUser();
    })();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">login</h1>
      <button
        onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
        className="bg-gray-800 dark:bg-gray-50 hover:bg-gray-600 dark:hover:bg-gray-300 transition-all duration-100 text-white dark:text-gray-800 px-8 py-2 text-2xl md:text-4xl rounded-lg"
      >
        Toggle Mode
      </button>
    </div>
  );
};

export default Login;
