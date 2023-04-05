import { FC } from "react";
import { useSelector } from "react-redux";
import { UserState } from "../../types/user";

const Login: FC = () => {
  const user = useSelector((state: UserState) => state);
  return <h1>login</h1>;
};

export default Login;
