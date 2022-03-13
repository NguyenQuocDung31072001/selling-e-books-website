import "./App.css";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import LoginPages from "./pages/login";
import RegisterPages from "./pages/register";
import HomePagesAdmin from "./pages/home_admin";
import SettingAdmin from "./pages/setting_admin";
import SettingUser from "./pages/setting_user"
import HomePagesUser from "./pages/home_user";
import NotFound from "./pages/not_found";
import TopAdmin from "./component/top_admin";
import TopUser from "./component/top_user"
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminComponent/>}>
            <Route path="home" element={<HomePagesAdmin/>}/>  
            <Route path="setting" element={<SettingAdmin/>}/>  
          </Route>
          <Route path="/user" element={<UserComponent/>}>
            <Route path="home" element={<HomePagesUser/>}/>          
            <Route path="setting" element={<SettingUser/>}/>  
          </Route>
          <Route path="/login" element={<LoginPages />} />
          <Route path="/register" element={<RegisterPages />} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
function AdminComponent(){
  return (
    <div>
      <TopAdmin/>
      <div className="mt-[60px]">
        <Outlet/>
      </div>
    </div>
  )
}

function UserComponent(){
  return (
    <div>
      <TopUser/>
      <div className="mt-[60px]">
        <Outlet/>
      </div>
    </div>
  )
}

export default App;
