import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDistrictData, getProvinceData, getWardData, updateAccountAdmin, updateAccountPassword } from '../redux/api_request'
import { loginFailed, logout } from '../redux/auth_slices'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { Input, Button, Image, Select } from 'antd'
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
  const [province, setProvince] = useState(currentUser.address.province||'')
  const [district, setDistrict] = useState(currentUser.address.district||'')
  const [ward, setWard] = useState(currentUser.address.ward||'')

  const [provinceData, setProvinceData] = useState([])
  const [districtData, setDistrictData] = useState([])
  const [wardData, setWardData] = useState([])

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
    const  getData = async()=>{
      const provinceData = await getProvinceData()
      console.log(provinceData)
      setProvinceData(provinceData)
    }
    getData();
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
      address: {
        province: province,
        district: district,
        ward: ward
      },
      phoneNumber: phoneNumber,
      birthDate: birthDate,
      avatarBase64: imageBase64,
    }
    console.log(account)
    updateAccountAdmin(currentUser, account, dispatch)
  }
  const logout_fnc = () => {
    dispatch(logout())
  }

  const updatePassword = () => {
    if (newPassword !== confirmPassword) {
      console.log('Mật khẩu không trùng khớp')
    } else {
      const account = {
        _id: currentUser._id,
        oldPassword: oldPassword,
        newPassword: newPassword
      }
      updateAccountPassword(currentUser, account, dispatch)
    }
  }

  const updateProvince = (value)=> {
    console.log(value)
    const _province = provinceData.find(pro=>pro.code == value)
    setProvince(_province.name);
    const fetchDistrict = async ()=>{
      const districts = await getDistrictData(_province.code)
      setDistrictData(districts)
    }
    fetchDistrict();
  }

  const updateDistrict = (value)=> {
    const _district = districtData.find(dis=>dis.code == value)
    setDistrict(_district.name);
    const fetchWard = async ()=>{
      const wards = await getWardData(_district.code)
      setWardData(wards)
    }
    fetchWard();
  } 
  const updateWard = (value)=> {
      const _ward = wardData.find(war=>war.code == value)
      setWard(_ward.name)
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
              <div className='flex flex-row space-x-3 relative'>
                <Select  style={{ width: '150px' }} name="provice" id="" onChange={updateProvince} placeholder={province||"Chọn Tỉnh/Thành Phố"}>
                  {
                    provinceData.map(province=>{
                      return <Select.Option key={province.code} value={province.code}>{province.name}</Select.Option>
                    })
                    }
                </Select>
                <Select  style={{ width: '150px' }} name="district" id="" onChange={updateDistrict} placeholder={district||"Chọn Quận/Huyện"}>
                  {
                    districtData.map(district=>{
                      return <Select.Option key={district.code} value={district.code}>{district.name}</Select.Option>
                    })
                    }
                </Select>
                <Select  style={{ width: '150px' }} name="ward" id="" onChange={updateWard} placeholder={ward||"Chọn Phường/Xã"}>
                  {
                    wardData.map(ward=>{
                      return <Select.Option key={ward.code} value={ward.code}>{ward.name}</Select.Option>
                    })
                    }
                </Select>
              </div>
             
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
