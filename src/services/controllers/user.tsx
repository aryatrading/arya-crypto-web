import { toast } from "react-toastify";
import { axiosInstance } from "../api/axiosConfig";
import { store } from "../../store/store";
import { setUser } from "../features/userSlice";

export const getUser = async () => {
  try {
    let { data } = await axiosInstance.get("/user/");
    store.dispatch(setUser({ data }));
  } catch (error: any) {
    toast.error(error.message);
  }
};
