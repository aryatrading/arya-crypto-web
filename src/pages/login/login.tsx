import React, { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserState } from "../../types/user";

const Login: FC = () => {
  const user = useSelector((state: UserState) => state);
  console.log(user);
  return <h1>login</h1>;
};

export default Login;
