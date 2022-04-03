import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Image, Input } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import LoginAndRegister from './login_register'

const IMAGE_URL = 'http://localhost:5000/image_avatar/avatar_user.png'

const typeBook = [
  'Chính trị - pháp luật',
  'Khoa học công nghệ',
  'Kinh tế',
  'Văn học nghệ thuật',
  'Văn hóa xã hội - Lịch sử',
  'Giáo trình',
  'Truyện, tiểu thuyết',
  'Tâm lý, tâm linh, tôn giáo',
  'Sách thiếu nhi'
]

function TopUser() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const [image, setImage] = useState()
  useEffect(() => {
    if (currentUser?.avatar_url) {
      setImage(currentUser.avatar_url)
    }
  }, [currentUser])

  //currentUser.avatar_url
  return (
    <div className="w-full h-[100px] min-w-max bg-blue-600 fixed top-0 text-white z-50">
      <div className="flex justify-between items-center mt-[20px]">
        <Link to="/user/home">
          <div className="ml-[20px] text-[25px] text-white">
            <span>E_Book</span>
          </div>
        </Link>
        <div className="w-1/2 flex items-center bg-white rounded-[5px]">
          <Input size="large" placeholder="Tìm kiếm" />
          <div className="flex items-center w-[140px] h-[40px] bg-cyan-800  rounded-r-[5px] px-[10px]">
            <i className="fa-solid fa-magnifying-glass pr-[10px]"></i>
            <button>Tìm kiếm</button>
          </div>
        </div>
        <div className="flex justify-between items-center w-[100px] mr-[40px]">
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
          <Link to="/user/cart">
            <ShoppingCartOutlined
              style={{ fontSize: '45px', color: '#EFFFFD' }}
            />
          </Link>
        </div>
      </div>
      <div className="flex justify-center">
        {typeBook.map((type, key) => (
          <div key={key} className="mx-[10px] cursor-pointer ">
            <Link to={`/user/home/${type}`}>
              <span className="text-white"> {type}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopUser
