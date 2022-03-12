import {
  registerStart,
  registerSuccess,
  registerFailed,
  loginStart,
  loginSuccess,
  loginFailed,
  updateCurrentUser,
} from "./auth_slices";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const registerApi = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    const res = await axios.post(
      API_URL + "/v1/selling_e_books/auth/register",
      user
    );
    dispatch(registerSuccess());
    navigate("/login");
  } catch (error) {
    dispatch(registerFailed());
  }
};

export const loginApi = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      API_URL + "/v1/selling_e_books/auth/login",
      user
    );
    dispatch(loginSuccess(res.data));
    if (res.data.role === "admin") {
      navigate("/admin/home");
    }
    if (res.data.role === "user") {
      navigate("/user/home");
    }
  } catch (error) {
    dispatch(loginFailed());
  }
};
export const updateAccountAdmin = async (
  currentUser,
  account,
  dispatch
) => {
  try {
    const res = await axios.post(
      API_URL + "/v1/selling_e_books/account/setting/" + currentUser._id,
      account,
      {
        headers: { token: currentUser.accessToken },
      }
    );
    
    const payloadAction={
      ...currentUser,
      email:res.data.email,
      username:res.data.username,
      password:res.data.password,
      id_avatar:res.data.id_avatar,
      avatar_url:res.data.avatar_url
    }
    console.log(payloadAction)
    dispatch(updateCurrentUser(payloadAction));
  } catch (error) {
    console.log(error);
  }
};
