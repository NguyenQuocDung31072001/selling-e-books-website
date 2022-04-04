import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateAccountAdmin, updateAccountPassword } from '../redux/api_request'
import { loginFailed, logout } from '../redux/auth_slices'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { Input, Button, Image } from 'antd'
const { TextArea } = Input
const IMAGE_URL = 'http://localhost:5000/image_avatar/avatar_user.png'

function SettingUser() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const [email, setEmail] = useState(currentUser?.email)
  const [username, setUsername] = useState(currentUser?.username)
  const [address, setAddress] = useState(currentUser?.address || '')
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '')
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || '')
  const [image, setImage] = useState()
  const [imageBase64, setImageBase64] = useState()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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
    const image = e.target.files[0]
    if (image) {
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onloadend = () => {
        setImageBase64(reader.result)
      }
      reader.onerror = () => {
        console.error('AHHHHHHHH!!')
      }
    } else {
      setImageBase64(null)
    }
  }

  const updateAccount = e => {
    e.preventDefault()
    const account = {
      email: email,
      username: username,
      address: address,
      phoneNumber: phoneNumber,
      birthDate: birthDate,
      avatarBase64: imageBase64
    }
    console.log(account)
    updateAccountAdmin(currentUser, account, dispatch)
  }

  const logout_fnc = () => {
    dispatch(logout())
  }

  const updatePassword = () => {
    if (newPassword !== confirmPassword) {
      window.confirm('Mật khẩu không trùng khớp vui lòng kiểm tra lại')
    } else {
      const account = {
        _id: currentUser._id,
        oldPassword: oldPassword,
        newPassword: newPassword
      }
      updateAccountPassword(currentUser, account, dispatch)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full relative space-y-10">
      <div className="flex flex-col justify-center items-center w-full relative space-y-4">
        <div className="w-full lg:w-2/3 xl:w-1/2 px-6 ">
          <h2 className="text-xl font-semibold text-left mb-0">
            Hồ sơ của tôi
          </h2>
          <h3 className="w-full text-md text-left font-normal text-gray-500">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </h3>
          <hr className="my-3" />
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-stretch space-y-8 lg:space-x-8  lg:space-y-0 w-full lg:w-2/3 xl:w-1/2 px-6">
          <div className="flex flex-col h-full justify-start items-center space-y-6  w-full  lg:w-1/3 order-1 lg:order-2">
            <Image
              width={150}
              height={150}
              style={{
                borderRadius: '50%',
                overflow: 'hidden',
                objectFit: 'cover'
              }}
              src={imageBase64 || currentUser?.avatar_url || IMAGE_URL}
            />
            <label
              htmlFor="avatar_id"
              className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-gray-50 text-base"
            >
              Chọn Ảnh{' '}
            </label>
            <input
              className="hidden"
              id="avatar_id"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={changeImage}
            />
          </div>
          <div className="flex flex-col h-full text-sm space-y-6 md:space-y-9 w-full lg:w-2/3 order-2 lg:order-1 ">
            <div className="flex flex-row items-center space-x-4">
              <div className="w-24 min-w-[6rem] text-right ">
                <label className="text-right whitespace-nowrap text-gray-600">
                  {' '}
                  Email
                </label>
              </div>
              <Input
                size="large"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-row items-center space-x-4">
              <div className="w-24 min-w-[6rem] text-right ">
                <label className="text-right whitespace-nowrap text-gray-600">
                  Tên đăng nhập
                </label>
              </div>
              <Input
                size="large"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-row items-center space-x-4">
              <div className="w-24 min-w-[6rem] text-right ">
                <label className="text-right whitespace-nowrap text-gray-600">
                  {' '}
                  Số điện thoại
                </label>
              </div>
              <Input
                size="large"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="flex flex-row items-center space-x-4">
              <div className="w-24 min-w-[6rem] text-right ">
                <label className="text-right whitespace-nowrap text-gray-600">
                  Ngày sinh
                </label>
              </div>
              <Input
                size="large"
                type="date"
                value={birthDate.split('T')[0]}
                onChange={e => setBirthDate(e.target.value)}
              />
            </div>

            <div className="flex flex-row items-center space-x-4">
              <div className="w-24 min-w-[6rem] text-right ">
                <label className="text-right whitespace-nowrap text-gray-600">
                  Địa chỉ
                </label>
              </div>
              <Input
                size="large"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-6">
          <Button
            // className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
            onClick={updateAccount}
          >
            Lưu
          </Button>
          <Button
            // className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
            onClick={logout_fnc}
          >
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full relative space-y-4">
        <div className="w-full lg:w-2/3 xl:w-1/2 px-6">
          <h2 className="text-xl font-semibold text-left mb-0">
            Thay đổi mật khẩu
          </h2>
          <h3 className="w-full text-md text-left font-normal text-gray-500">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
          </h3>
          <hr className="my-3" />
        </div>

        <div className="w-full lg:w-2/3 xl:w-1/2 px-6 flex flex-col space-y-8">
          <div className="flex flex-row items-center space-x-4  w-full lg:w-2/3 ">
            <div className="w-40 min-w-[8rem] text-right">
              <label className="text-right whitespace-nowrap text-gray-600">
                Mật Khẩu Hiện Tại
              </label>
            </div>
            <Input.Password
              size="large"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              placeholder
            />
          </div>

          <div className="flex flex-row items-center space-x-4  w-full lg:w-2/3 ">
            <div className="w-40 min-w-[8rem] text-right">
              <label className="text-right whitespace-nowrap text-gray-600">
                Mật Khẩu Mới
              </label>
            </div>
            <Input.Password
              size="large"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder
            />
          </div>

          <div className="flex flex-row items-center space-x-4  w-full lg:w-2/3 ">
            <div className="w-40 min-w-[8rem] text-right">
              <label className="text-right whitespace-nowrap text-gray-600">
                Xác Nhận Mật Khẩu
              </label>
            </div>
            <Input.Password
              size="large"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder
            />
          </div>
        </div>

        <div className="flex flex-row space-x-6">
          <Button
            // className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
            onClick={updatePassword}
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingUser
