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
    <div className="ml-[300px] w-[81%]  h-[80px] bg-[#ecf0f1] fixed top-0 text-white border-b-[1px] border-slate-300 z-50">
      <div className="flex justify-between items-center mt-[20px]">
        <div className="ml-[20px] text-black">
          <BreadcrumbsUser />
        </div>
        <div className="flex items-center rounded-[5px]">
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
            <div className='mr-4'>
              <ShoppingCartOutlined
                style={{ fontSize: '45px', color: '#2c3e50' }}
              />
            </div>
          </Link>
          {currentUser && (
            <Link to="/user/setting">
              <div className='flex items-center text-xl text-black'>
                <img
                  className="h-[50px] w-[50px] object-cover cursor-pointer rounded-[50px]"
                  src={image ? currentUser?.avatar_url : IMAGE_URL}
                  alt=""
                />
                <p className='font-bold ml-4'>{currentUser.username}</p>
              </div>
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
