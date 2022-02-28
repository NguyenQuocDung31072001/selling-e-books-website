import {
  registerStart,
  registerSuccess,
  registerFailed,
  loginStart,
  loginSuccess,
  loginFailed,
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
    navigate("/");
  } catch (error) {
    dispatch(loginFailed());
  }
};
