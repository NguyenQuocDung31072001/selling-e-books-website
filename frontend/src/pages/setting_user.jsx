import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateAccountAdmin } from '../redux/api_request'
import { loginFailed, logout } from '../redux/auth_slices'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { Input, Button, Image} from 'antd'

const IMAGE_URL = 'http://localhost:5000/image_avatar/avatar_user.png'

function SettingUser() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const [email, setEmail] = useState(currentUser?.email)
  const [username, setUsername] = useState(currentUser?.username)
  const [password, setPassword] = useState(currentUser?.password)
  const [image, setImage] = useState()
  const [imageBase64, setImageBase64] = useState()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const breadcrumb = {
      genre: 'setting',
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrumb))
  }, [])
  useEffect(() => {
    if (currentUser?.role !== 'user') {
      dispatch(loginFailed())
      navigate('/login')
    }
  }, [currentUser])

  useEffect(() => {
    if (image) {
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onloadend = () => {
        // console.log(reader.result)
        setImageBase64(reader.result)
      }
      reader.onerror = () => {
        console.error('AHHHHHHHH!!')
      }
    }
  }, [image])

  const changeImage = e => {
    setImage(e.target.files[0])
  }

  const updateAccount = e => {
    e.preventDefault()
    const account = {
      email: email,
      username: username,
      password: password,
      avatarBase64: imageBase64
    }
    updateAccountAdmin(currentUser, account, dispatch)
  }
  const logout_fnc = () => {
    dispatch(logout())
  }


  return (
    <div>
      <div className="flex items-center">
        {!currentUser?.avatar_url && (
          <Image
            width={200}
            preview={false}
            src={image ? URL.createObjectURL(image) : IMAGE_URL}
          />
        )}
        {currentUser?.avatar_url && (
          <Image
            width={200}
              
            src={image ? URL.createObjectURL(image) : currentUser.avatar_url}
          />
        )}
        <label htmlFor="avatar_id">
          <i className="fa-solid fa-user-tie text-[50px] cursor-pointer"></i>

          <input
            className="hidden"
            id="avatar_id"
            type="file"
            accept="image/png, image/gif, image/jpeg"
            onChange={changeImage}
          />
        </label>

      </div>

      <div className="flex w-[300px]">
        <div className="w-[80px]">
          <label> Email</label>
        </div>
        <Input
          className="ml-[20px] "
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="flex w-[300px]">
        <div className="w-[80px]">
          <label>Username</label>
        </div>
        <Input
          className="ml-[20px] "
          // size="large"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className="flex w-[300px]">
        <div className="w-[60px]">
          <label> Password</label>
        </div>
        <Input.Password
          className="ml-[5px] "
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div>
        <Button
          // className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
          onClick={updateAccount}
        >
          Update Account
        </Button>
        <Button
          // className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
          onClick={logout_fnc}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}

export default SettingUser
