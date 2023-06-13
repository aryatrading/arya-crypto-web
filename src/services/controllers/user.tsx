import { axiosInstance } from "../api/axiosConfig";
import { store } from "../redux/store";
import { setUser } from "../redux/userSlice";

export const getUserData = async () => {
  const { data } = await axiosInstance.get("/user/");

  store.dispatch(setUser(data));
};
