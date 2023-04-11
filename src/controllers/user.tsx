import { instance } from "../api";

export const getUser = async () => {
  try {
    let user = await instance.get("/user/");
    console.log(user);
  } catch (error: any) {
    console.log(error);
  }
};
