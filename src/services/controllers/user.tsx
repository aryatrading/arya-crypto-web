import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosConfig";
import { store } from "../redux/store";
import { setUser } from "../redux/userSlice";

export const getUser = async () => {
  try {
    let { data } = await axiosInstance.get("/user/");
    console.log(data);
    store.dispatch(setUser({ data }));
  } catch (error: any) {
    toast.error(error.message);
  }
};
