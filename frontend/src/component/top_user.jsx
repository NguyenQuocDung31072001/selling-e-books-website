import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Image, Input, Typography } from 'antd'
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import LoginAndRegister from './login_register'
import { updateQuery } from '../redux/search_slices'
import BreadcrumbsUser from './breadcrumbs_user'
const IMAGE_URL = 'http://localhost:5000/image_avatar/avatar_user.png'

const { Title } = Typography
function TopUser() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const dispatch = useDispatch()
  const [query, setQuery] = useState('')
  const [image, setImage] = useState()
  useEffect(() => {
    if (currentUser?.avatar_url) {
      setImage(currentUser.avatar_url)
    }
  }, [currentUser])

  useEffect(() => {
    let search = {
      query: { name: query },
      type: 'name'
    }
    dispatch(updateQuery(search))
  }, [query])
  //currentUser.avatar_url  
  return (
    <div className="ml-[300px] w-[81%]   h-[80px] bg-white fixed top-0 text-white z-50">
      <div className="flex justify-between items-center mt-[20px]">
        <div className="ml-[20px] text-black">
          <BreadcrumbsUser />
        </div>
        <div className="w-[50%] flex items-center bg-white rounded-[5px]">
          <Input
            size="large"
            placeholder="Tìm kiếm"
            style={{ width: 300 }}
            value={query}
            onChange={e => setQuery(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>
        <div className="flex justify-between items-center  mr-[40px]">
          <Link to="/user/cart">
            <ShoppingCartOutlined
              style={{ fontSize: '45px', color: '#7f8c8d' }}
            />
          </Link>
          {currentUser && (
            <Link to="/user/setting">
              <img
                className="h-[50px] w-[50px] object-cover cursor-pointer rounded-[50px]"
                src={image ? currentUser?.avatar_url : IMAGE_URL}
                alt=""
              />
            </Link>
          )}
          {!currentUser && (
            <div>
              <LoginAndRegister />
            </div>
          )}
        </div>
      </div>
      {/* <div className="flex justify-center">
        {typeBook.map((type, key) => (  
          <div key={key} className="mx-[10px] cursor-pointer ">
            <Link to={`/user/home/${type}`}>
              <span className="text-white"> {type}</span>
            </Link>
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default TopUser
