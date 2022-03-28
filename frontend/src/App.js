import './App.css'
import 'antd/dist/antd.css'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import HomePagesAdmin from './pages/home_admin'
import SettingAdmin from './pages/setting_admin'
import SettingUser from './pages/setting_user'
import HomePagesUser from './pages/home_user'
import NotFound from './pages/not_found'
import LayoutAdmin from './component/layout_admin'
import TopUser from './component/top_user'
import GenreBookUser from './pages/genre_book_user'
import BreadcrumbsUser from './component/breadcrumbs_user'
import DetailBookUser from './pages/detail_book_user'
import Cart from "./pages/cart"
import AddBook from './pages/add_book'
function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminComponent />}>
            <Route path="home" element={<HomePagesAdmin />} />
            <Route path="add_book" element={<AddBook/>}/>
            <Route path="setting" element={<SettingAdmin />} />
          </Route>
          <Route path="/user" element={<UserComponent />}>
            <Route path="home" element={<HomePagesUser />} />
            <Route path="home/:genre" element={<GenreBookUser />} />
            <Route path="home/:genre/:id_book" element={<DetailBookUser />} />
            <Route path="cart" element={<Cart/>}/>
            <Route path="setting" element={<SettingUser />} />
          </Route>
          {/* <Route path="/login" element={<LoginPages />} />
          <Route path="/register" element={<RegisterPages />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
function AdminComponent() {
  return (
    <div>
      <LayoutAdmin />
      <div className="ml-[256px]">
        <Outlet />
      </div>
    </div>
  )
}

function UserComponent() {
  return (
    <div>
      <TopUser />
      <div className="mt-[130px]">
        <BreadcrumbsUser />
        <Outlet />
      </div>
    </div>
  )
}

export default App
