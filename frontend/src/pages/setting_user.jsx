import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAccountAdmin } from "../redux/api_request";
import { loginFailed,logout } from "../redux/auth_slices";
import { updateBreadcrumb } from "../redux/breadcrumb_slices";

const IMAGE_URL = "http://localhost:5000/image_avatar/avatar_user.png";

function SettingUser() {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [email, setEmail] = useState(currentUser?.email);
  const [username, setUsername] = useState(currentUser?.username);
  const [password, setPassword] = useState(currentUser?.password);
  const [image, setImage] = useState();
  const [imageBase64, setImageBase64] = useState();

  const dispatch = useDispatch();
  const navigate=useNavigate()

  useEffect(()=>{
    const breadcrumb={
      genre:'setting',
      name_book:''
    }
    dispatch(updateBreadcrumb(breadcrumb))
  },[])
  useEffect(() => {
    if (currentUser?.role!=='user') {
      dispatch(loginFailed());
      navigate("/login");
    }
  }, [currentUser]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        // console.log(reader.result)
        setImageBase64(reader.result);
      };
      reader.onerror = () => {
        console.error("AHHHHHHHH!!");
      };
    }
  }, [image]);

  const changeImage = (e) => {
    setImage(e.target.files[0]);
  };

  const updateAccount = (e) => {
    e.preventDefault();
    const account = {
      email: email,
      username: username,
      password: password,
      avatarBase64: imageBase64,
    };
    updateAccountAdmin(currentUser, account, dispatch);
  };
  const logout_fnc=()=>{
    dispatch(logout())
  }
  return (
    <div>
      <div className="flex">
        {!currentUser?.avatar_url && (
          <img
            className="h-[50px] w-[50px] object-cover rounded-[50px]"
            src={image ? URL.createObjectURL(image) : IMAGE_URL}
            alt=""
          />
        )}
        {currentUser?.avatar_url && (
          <img
            className="h-[50px] w-[50px] object-cover rounded-[50px]"
            src={image ? URL.createObjectURL(image) : currentUser.avatar_url}
            alt=""
          />
        )}
        <label htmlFor="avatar_id">
          <i className="fa-solid fa-user-tie text-[50px] cursor-pointer"></i>
          <input
            className="hidden"
            id="avatar_id"
            type="file"
            accept="image/png, image/gif, image/jpeg"
            onChange={changeImage}
          />
        </label>
      </div>

      <div className="flex">
        <label> Email</label>
        <input
          className="ml-[20px] w-[500px]"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex">
        <label>Username</label>
        <input
          className="ml-[20px] w-[500px]"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex">
        <label> Password</label>
        <input
          className="ml-[20px] w-[500px]"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button
          className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
          onClick={updateAccount}
        >
          Update Account
        </button>
        <button
          className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
          onClick={logout_fnc}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default SettingUser;
