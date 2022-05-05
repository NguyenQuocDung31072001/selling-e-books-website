import React, { useEffect, useState } from 'react'
import { Modal, Button, Input, Select, Form } from 'antd'
import {
  getDistrictData,
  getProvinceData,
  getWardData
} from '../../redux/api_request'

function ShipModal(props) {
  const { visible, shipData, onSave, onCancel } = props
  const [customer, setCustomer] = useState(shipData.username || '')
  const [phoneNumber, setPhoneNumber] = useState(shipData.phoneNumber || '')
  const [province, setProvince] = useState(shipData.address.province || {})
  const [district, setDistrict] = useState(shipData.address.district || {})
  const [ward, setWard] = useState(shipData.address.ward || {})
  const [street, setStreet] = useState(shipData.address.street || '')

  const [provinceData, setProvinceData] = useState([])
  const [districtData, setDistrictData] = useState([])
  const [wardData, setWardData] = useState([])

  useEffect(() => {
    console.log(shipData)
    const getData = async () => {
      const provinceData = await getProvinceData()
      setProvinceData(provinceData)
      if (province.ProvinceID) {
        const [districts, wards] = await Promise.all([
          getDistrictData(province.ProvinceID),
          getWardData(district.DistrictID)
        ])
        setWardData(wards)
        setDistrictData(districts)
      }
    }
    getData()
  }, [])

  const updateProvince = value => {
    const _province = provinceData.find(
      province => province.ProvinceID == value
    )
    setProvince(_province)
    const fetchDistrict = async () => {
      const districts = await getDistrictData(_province.ProvinceID)
      setDistrictData(districts)
    }
    fetchDistrict()
  }

  const updateDistrict = value => {
    const _district = districtData.find(dis => dis.DistrictID == value)
    setDistrict(_district)
    const fetchWard = async () => {
      const wards = await getWardData(_district.DistrictID)
      setWardData(wards)
    }
    fetchWard()
  }

  const updateWard = value => {
    const _ward = wardData.find(war => war.WardCode == value)
    setWard(_ward)
  }

  const saveShipInfo = () => {
    const data = {
      customer: customer,
      phoneNumber: phoneNumber,
      address: {
        province: {
          ProvinceID: province.ProvinceID,
          ProvinceName: province.ProvinceName
        },
        district: {
          DistrictID: district.DistrictID,
          DistrictName: district.DistrictName
        },
        ward: {
          WardCode: ward.WardCode,
          WardName: ward.WardName
        },
        street: street
      }
    }
    onSave(data)
  }

  return (
    <>
      {/* {console.log(customer)} */}
      <Modal
        title="Thay đổi địa chỉ giao hàng"
        visible={visible}
        footer={null}
        // onOk={saveShipInfo}
        onCancel={onCancel}
      >
        <Form
          name=""
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{
            customer: customer,
            phoneNumber: phoneNumber,
            street: street,
            ward: ward.WardCode,
            district: district.DistrictID,
            province: province.ProvinceID
          }}
          onFinish={saveShipInfo}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Nguời nhận"
            name="customer"
            rules={[
              { required: true, message: 'Vui lòng nhập tên người nhận!' }
            ]}
          >
            <Input
              size="large"
              value={customer}
              onChange={e => setCustomer(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label=" Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' }
            ]}
          >
            <Input
              size="large"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Tỉnh/Thành Phố"
            name="province"
            rules={[
              { required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }
            ]}
          >
            <Select
              size="large"
              name="provice"
              id=""
              onChange={updateProvince}
              placeholder={province.ProvinceName || 'Chọn Tỉnh/Thành Phố'}
            >
              {provinceData.map(province => {
                return (
                  <Select.Option
                    key={province.ProvinceID}
                    value={province.ProvinceID}
                  >
                    {province.ProvinceName}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: 'Vui lòng nhập Quận/Huyện!' }]}
          >
            <Select
              size="large"
              name="district"
              id=""
              onChange={updateDistrict}
              placeholder={district.DistrictName || 'Chọn Quận/Huyện'}
            >
              {districtData.map(district => {
                return (
                  <Select.Option
                    key={district.DistrictID}
                    value={district.DistrictID}
                  >
                    {district.DistrictName}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Xã/Phường"
            name="ward"
            rules={[
              { required: true, message: 'Vui lòng nhập tên Xã/Phường!' }
            ]}
          >
            <Select
              size="large"
              name="ward"
              id=""
              onChange={updateWard}
              placeholder={ward.WardName || 'Chọn Phường/Xã'}
            >
              {wardData.map(ward => {
                return (
                  <Select.Option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="street"
            rules={[{ required: true, message: 'Vui lòng nhập tên địa chỉ!' }]}
          >
            <Input
              size="large"
              value={street}
              onChange={e => setStreet(e.target.value)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <div className="flex flex-row justify-center space-x-4">
              <Button type="primary" htmlType="submit">
                Xong
              </Button>
              <Button type="" htmlType="button" onClick={onCancel}>
                Hủy
              </Button>
            </div>
          </Form.Item>
        </Form>

        {/* <div className="flex flex-col h-full text-sm space-y-6 md:space-y-9 w-full">
          <div className="flex flex-row items-center space-x-4">
            <div className="w-24 min-w-[6rem] text-right ">
              <label className="text-right whitespace-nowrap text-gray-600">
                {' '}
                Người nhận
              </label>
            </div>
            <Input
              size="large"
              value={customer}
              onChange={e => setCustomer(e.target.value)}
            />
          </div>

          <div className="flex flex-row items-center space-x-4">
            <div className="w-24 min-w-[6rem] text-right ">
              <label className="text-right whitespace-nowrap text-gray-600">
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
                {' '}
                Tỉnh/Thành Phố
              </label>
            </div>
            <Select
              style={{ width: '100%' }}
              name="provice"
              id=""
              onChange={updateProvince}
              defaultValue={province.ProvinceName}
              placeholder={province.ProvinceName || 'Chọn Tỉnh/Thành Phố'}
            >
              {provinceData.map(province => {
                return (
                  <Select.Option
                    key={province.ProvinceID}
                    value={province.ProvinceID}
                  >
                    {province.ProvinceName}
                  </Select.Option>
                )
              })}
            </Select>
          </div>

          <div className="flex flex-row items-center space-x-4">
            <div className="w-24 min-w-[6rem] text-right ">
              <label className="text-right whitespace-nowrap text-gray-600">
                {' '}
                Quận/Huyện
              </label>
            </div>
            <Select
              style={{ width: '100%' }}
              name="district"
              id=""
              onChange={updateDistrict}
              defaultValue={district.DistrictName}
              placeholder={district.DistrictName || 'Chọn Quận/Huyện'}
            >
              {districtData.map(district => {
                return (
                  <Select.Option
                    key={district.DistrictID}
                    value={district.DistrictID}
                  >
                    {district.DistrictName}
                  </Select.Option>
                )
              })}
            </Select>
          </div>

          <div className="flex flex-row items-center space-x-4">
            <div className="w-24 min-w-[6rem] text-right ">
              <label className="text-right whitespace-nowrap text-gray-600">
                Phường/Xã
              </label>
            </div>
            <Select
              style={{ width: '100%' }}
              name="ward"
              id=""
              onChange={updateWard}
              defaultValue={ward.WardName}
              placeholder={ward.WardName || 'Chọn Phường/Xã'}
            >
              {wardData.map(ward => {
                return (
                  <Select.Option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </Select.Option>
                )
              })}
            </Select>
          </div>
          <div className="flex flex-row items-center space-x-4">
            <div className="w-24 min-w-[6rem] text-right ">
              <label className="text-right whitespace-nowrap text-gray-600">
                Địa chỉ
              </label>
            </div>
            <Input
              size="large"
              value={street}
              onChange={e => setStreet(e.target.value)}
            />
          </div>
        </div> */}
      </Modal>
    </>
  )
}

export default ShipModal
