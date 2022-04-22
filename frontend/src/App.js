import './App.css'
import 'antd/dist/antd.css'
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate
} from 'react-router-dom'
import HomePagesAdmin from './pages/home_admin'
import SettingAdmin from './pages/setting_admin'
import SettingUser from './pages/setting_user'
import HomePagesUser from './pages/home_user'
import NotFound from './pages/not_found'
import LayoutAdmin from './component/layout_admin'
import TopUser from './component/top_user'
import GenreBookUser from './pages/genre_book_user'
import DetailBookUser from './pages/detail_book_user'
import Cart from './pages/cart'
import AddBook from './pages/add_book'
import GenreManage from './pages/genre_book_admin'
import AuthorManage from './pages/author_admin'
import AllBookAdmin from './pages/all_book_admin'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import DetailBookAdmin from './pages/detail_book_admin'
import AllGenreBookAdmin from './pages/all_book_genre_admin'
function App() {
  const currentUser = useSelector(state => state.auth.login.currentUser)

  function ProtectRouterUser({ children }) {
    return currentUser?.role === 'user' ? (
      children
    ) : (
      <Navigate to="/user/home" />
    )
  }
  function ProtectRouterAdmin({ children }) {
    return currentUser?.role === 'admin' ? (
      children
    ) : (
      <Navigate to="/user/home" />
    )
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectRouterAdmin>
                <AdminComponent />
              </ProtectRouterAdmin>
            }
          >
            <Route
              path="genre"
              element={
                <ProtectRouterAdmin>
                  <GenreManage />
                </ProtectRouterAdmin>
              }
            />
            <Route
              path="author"
              element={
                <ProtectRouterAdmin>
                  <AuthorManage />
                </ProtectRouterAdmin>
              }
            />
            <Route
              path="home"
              element={
                <ProtectRouterAdmin>
                  <HomePagesAdmin />
                </ProtectRouterAdmin>
              }
            />
            <Route
              path="add_book"
              element={
                <ProtectRouterAdmin>
                  <AddBook />
                </ProtectRouterAdmin>
              }
            />
            <Route
              path="home/:genre/:slug"
              element={
                <ProtectRouterAdmin>
                  <DetailBookAdmin />
                </ProtectRouterAdmin>
              }
            />
             <Route path="home/:genre" element={<AllGenreBookAdmin />} />
            <Route
              path="all_book"
              element={
                <ProtectRouterAdmin>
                  <AllBookAdmin />
                </ProtectRouterAdmin>
              }
            />
            <Route
              path="setting"
              element={
                <ProtectRouterAdmin>
                  <SettingAdmin />
                </ProtectRouterAdmin>
              }
            />
          </Route>
          <Route path="/user" element={<UserComponent />}>
            <Route path="home" element={<HomePagesUser />} />
            <Route path="home/:genre" element={<GenreBookUser />} />
            <Route
              path="home/:genre/:slug"
              element={
                <ProtectRouterUser>
                  <DetailBookUser />
                </ProtectRouterUser>
              }
            />
            <Route
              path="cart"
              element={
                <ProtectRouterUser>
                  <Cart />
                </ProtectRouterUser>
              }
            />
            <Route
              path="setting"
              element={
                <ProtectRouterUser>
                  <SettingUser />
                </ProtectRouterUser>
              }
            />
          </Route>
          {/* <Route path="*" element={<NotFound />} /> */}
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
      <div className="mt-[100px]">
        {/* <BreadcrumbsUser /> */}
        <Outlet />
      </div>
    </div>
  )
}

export default App
