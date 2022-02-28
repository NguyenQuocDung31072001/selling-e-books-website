import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../redux/api_request";

export default function LoginPages() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSubmit = (e) => {
    e.preventDefault()
    const user = {
      email: email,
      password: password,
    };
    loginApi(user, dispatch, navigate);
  };
  
  return (
    <div>
      <form action="" onSubmit={loginSubmit}>
        Email: <input type="text" onChange={(e) => setEmail(e.target.value)} />
        Password:{" "}
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" />
      </form>
    </div>
  );
}
