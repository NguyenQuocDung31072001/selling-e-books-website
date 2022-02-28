import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../redux/api_request";

export default function RegisterPages() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginSubmit = (e) => {
    e.preventDefault()
    const user = {
      username:username,
      email: email,
      password: password,
    };
    registerApi(user, dispatch, navigate);
  };

  return (
    <div>
      <form action="" onSubmit={loginSubmit}>
        Email: <input type="text" onChange={(e) => setEmail(e.target.value)} />
        username:{" "}
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
        Password:{" "}
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
  
        <input type="submit" />
      </form>
    </div>
  );
}
