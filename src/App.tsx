import { FC } from "react";
import { store } from "./store/store";
import { Provider } from "react-redux";
import Login from "./pages/login/login";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: FC = () => {
  return (
    <ThemeProvider attribute="class">
      <Provider store={store}>
        <Login />
      </Provider>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
