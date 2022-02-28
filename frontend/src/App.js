import "./App.css";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import LoginPages from "./pages/login/login";
import RegisterPages from "./pages/register/register";
import HomePages from "./pages/home/home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePages/>}/>
          <Route path="/login" element={<LoginPages />} />
          <Route path="/register" element={<RegisterPages />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
