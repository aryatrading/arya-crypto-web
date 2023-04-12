import { toast } from "react-toastify";
import { instance } from "../api";
import { store } from "../store/store";
import { setUser } from "../features/userSlice";

export const getUser = async () => {
  try {
    let { data } = await instance.get("/user/");
    store.dispatch(setUser({ data }));
  } catch (error: any) {
    toast.error(error.message);
  }
};
