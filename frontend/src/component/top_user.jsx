import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Image, Input, Typography } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import LoginAndRegister from './login_register'
import { updateQuery } from '../redux/search_slices'
const IMAGE_URL = 'http://localhost:5000/image_avatar/avatar_user.png'

// const typeBook = [
//   'Chính trị - pháp luật',
//   'Khoa học công nghệ',
//   'Kinh tế',
//   'Văn học nghệ thuật',
//   'Văn hóa xã hội - Lịch sử',
//   'Giáo trình',
//   'Truyện, tiểu thuyết',
//   'Tâm lý, tâm linh, tôn giáo',
//   'Sách thiếu nhi'
// ]
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
      query: query,
      type: 'name'
    }
    dispatch(updateQuery(search))
  }, [query])

  //currentUser.avatar_url
  return (
    <div className="w-full h-[80px] min-w-max bg-white fixed top-0 text-white z-50">
      <div className="flex justify-between items-center mt-[20px]">
        <Link to="/user/home">
          <div className="ml-[20px] text-[25px] text-black">
            <Title level={2}>BOOKSTO</Title>
          </div>
        </Link>
        <div className="w-[50%] flex items-center bg-white rounded-[5px]">
          <Input
            size="large"
            placeholder="Tìm kiếm"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="flex items-center w-[140px] h-[40px] bg-cyan-800  rounded-r-[5px] px-[10px]">
            <i className="fa-solid fa-magnifying-glass pr-[10px]"></i>
            <button>Tìm kiếm</button>
          </div>
        </div>
        <div className="flex justify-between items-center mr-[40px]">
          <div className='text-gray-700 text-[30px] '>
            <i className="fa-solid fa-bell"></i>
          </div>
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
