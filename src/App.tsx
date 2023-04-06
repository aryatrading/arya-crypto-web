import { FC } from "react";
import { store } from "./store/store";
import { Provider } from "react-redux";
import Login from "./pages/login/login";
import { ThemeProvider } from "next-themes";

const App: FC = () => {
  return (
    <ThemeProvider attribute="class">
      <Provider store={store}>
        <Login />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
