import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TextField, Box, Autocomplete } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
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
    <div className="w-full h-[120px] min-w-max bg-blue-600 fixed top-0 text-white">
      <div className="flex justify-between items-center mt-[20px]">
        <Link to="/user/home">
          <div className="ml-[20px]">
            <h1>E_Book</h1>
          </div>
        </Link>
        <Box className="w-1/2 flex items-center bg-white rounded-[5px]">
          <TextField
            fullWidth
            size="small"
            autoComplete="off"
            placeholder="Tìm kiếm"
          />
          <div className="flex items-center w-[140px] h-[40px] bg-cyan-800  rounded-r-[5px] px-[10px]">
            <i className="fa-solid fa-magnifying-glass pr-[10px]"></i>
            <button>Tìm kiếm</button>
          </div>
        </Box>
        <div className="flex justify-between items-center w-[130px] mr-[20px]">
          <Link to="/">
            <ShoppingCartOutlinedIcon fontSize="large" />
          </Link>
          <Link to="/user/setting">
            <img
              className="h-[50px] w-[50px] object-cover cursor-pointer rounded-[50px]"
              src={image ? currentUser?.avatar_url : IMAGE_URL}
              alt=""
            />
          </Link>
        </div>
      </div>
      <div className="flex justify-center">
        {typeBook.map((type,key) => (
          <div key={key} className="mx-[10px] cursor-pointer">
            <Link to={`/user/home/${type}`}>
              {type}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopUser
