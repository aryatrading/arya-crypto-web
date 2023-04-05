import { FC } from "react";
import { store } from "./store/store";
import { Provider } from "react-redux";
import Login from "./pages/login/login";

const App: FC = () => {
  return (
    <Provider store={store}>
      <Login />
    </Provider>
  );
};

export default App;
