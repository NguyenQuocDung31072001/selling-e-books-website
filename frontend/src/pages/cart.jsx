import React, { useState, useEffect } from 'react'
import { Table, Button, Input, Spin } from 'antd'
import { DeleteOutlined, DeleteTwoTone, DeleteFilled } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import {
  getCart,
  deleteCart,
  increaseCart,
  decreaseCart,
  getShippingInfo
} from '../redux/api_request'
import BreadcrumbsUser from '../component/breadcrumbs_user'
import { PATH_NAME } from '../config/pathName'
import ShipModal from '../component/checkout/ship_modal'

export default function Cart() {
  const [loading, setLoading] = useState(false)
  const [firstLoading, setFirstLoading] = useState(true)
  const [totalFinal, setTotalFinal] = useState(0)
  const [rowChecked, setRowChecked] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [shipData, setShipData] = useState({})
  const [openShipModal, setOpenShipModal] = useState(false)
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const columns = [
    {
      title: 'Tất cả sản phẩm',
      dataIndex: 'product',
      render: product => (
        <div className="flex items-center">
          <Link to={`/user/home/${product.genres}/${product.slug}`}>
            <img className="w-[50px] h-[50px]" src={product.image} alt="" />
            <span className="ml-[20px]">{product.name}</span>
          </Link>
        </div>
      )
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      render: price => <p>{price}</p>
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      render: (count, record) => {
        return (
          <div className="flex ">
            <Button
              size="small"
              className="w-[20px] h-[20px]"
              onClick={() => decreaseFnc(record.key)}
              disabled={count.status}
            >
              -
            </Button>
            <div className="w-[30px]">
              <Input value={count.value} size="small" />
            </div>
            <Button
              size="small"
              className="w-[20px] h-[20px]"
              onClick={() => increaseFnc(record.key)}
            >
              +
            </Button>
          </div>
        )
      }
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      render: total => <p>{total}</p>
    },
    {
      title: <DeleteFilled />,
      render: record => (
        <DeleteOutlined
          onClick={() => deleteProduct(record.key)}
          className="text-[20px] cursor-pointer"
        />
      )
    }
  ]

  useEffect(() => {
    setLoading(true)
    const breadcrumb = {
      genre_slug: 'cart',
      genre_name: 'Giỏ hàng',
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrumb))

    const getCartFnc = async () => {
      const cart = await getCart(currentUser._id)
      console.log(cart)
      let cartDataRender = []
      for (let i = 0; i < cart.length; i++) {
        let dataCart = {
          key: i + 1,
          product: {
            image: cart[i].book.coverUrl,
            name: cart[i].book.name,
            genres: cart[i].book.genres,
            slug: cart[i].book.slug,
            _id: cart[i].book._id
          },
          price: cart[i].book.price,
          count: {
            value: cart[i].amount,
            status: cart[i].amount > 1 ? false : true
          },
          total: cart[i].book.price * cart[i].amount,
          id: cart[i].book._id
        }
        cartDataRender.push(dataCart)
      }
      setData(cartDataRender)
      setFirstLoading(false)
      setLoading(false)
    }

    const getShippingInfoFnc = async () => {
      const info = await getShippingInfo(currentUser._id)
      console.log('shipping info', info)
      setShipData(info)
    }

    getShippingInfoFnc()
    getCartFnc()
  }, [])

  useEffect(() => {
    console.log(loading)
  }, [loading])

  const increaseFnc = key => {
    setLoading(true)
    let indexKeyOfArray
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        indexKeyOfArray = i
        break
      }
    }
    const dataToIncreaseCart = {
      account: currentUser._id,
      book: data[indexKeyOfArray].id
    }
    const increaseCartfnc = async () => {
      await increaseCart(dataToIncreaseCart)
      setLoading(false)
    }
    increaseCartfnc()
    let newData = [...data]
    let item = { ...newData[indexKeyOfArray] }
    item.count.value += 1
    item.count.status = false
    item.total = item.price * item.count.value
    newData[indexKeyOfArray] = item
    setData(newData)
    if (rowChecked.includes(key)) {
      setTotalFinal(prev => prev + item.price)
    }
  }
  const decreaseFnc = key => {
    setLoading(true)
    let indexKeyOfArray
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        indexKeyOfArray = i
        break
      }
    }
    const decreaseCartFnc = async () => {
      await decreaseCart(currentUser._id, data[indexKeyOfArray].id)
      setLoading(false)
    }
    decreaseCartFnc()
    let newData = [...data]
    let item = { ...newData[indexKeyOfArray] }
    item.count.value -= 1
    if (item.count.value === 1) {
      item.count.status = true
    }
    item.total = item.price * item.count.value
    newData[indexKeyOfArray] = item
    setData(newData)
    if (rowChecked.includes(key)) {
      setTotalFinal(prev => prev - item.price)
    }
  }
  const deleteProduct = key => {
    setLoading(true)
    let indexKeyOfArray
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        indexKeyOfArray = i
        break
      }
    }

    setTotalFinal(prev => prev - data[indexKeyOfArray].total)

    const deleteCartFnc = async (id_account, id_book) => {
      await deleteCart(id_account, id_book)
      setLoading(false)
    }
    deleteCartFnc(currentUser._id, data[indexKeyOfArray].id)
    const newData = data.filter(data => data.key !== key)
    setData(newData)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowChecked(selectedRowKeys)
      setSelectedRows(selectedRows)
      let tong_cong = 0
      for (let i = 0; i < selectedRows.length; i++) {
        tong_cong += selectedRows[i]?.total
      }

      setTotalFinal(tong_cong)
    }
  }

  const closeShipModal = () => {
    setOpenShipModal(false)
  }

  const saveShipInfo = data => {
    setShipData({ ...data, username: data.customer })
    setOpenShipModal(false)
  }
  const checkout = () => {
    navigate('/user/checkout', {
      state: {
        shipData: shipData,
        product: selectedRows
      }
    })
  }
  return (
    <>
      {shipData.address && (
        <ShipModal
          visible={openShipModal}
          shipData={shipData}
          onCancel={closeShipModal}
          onSave={saveShipInfo}
        />
      )}
      <div className="flex flex-col justify-center mx-[20px]">
        <div className="flex justify-center mx-[20px]">
          {firstLoading && (
            <div className="fixed w-screen h-screen z-10">
              <Spin tip="Loading..." />
            </div>
          )}
          {loading && (
            <div className="fixed w-screen h-screen z-10">
              <Spin tip="Loading..." />
            </div>
          )}
          <div>
            <Table
              className="w-[750px]"
              rowSelection={{
                type: 'checkbox',
                ...rowSelection
              }}
              columns={columns}
              dataSource={data}
            />
          </div>
          <div className="w-[350px] ml-[20px] h-[300px] flex justify-center bg-white ">
            <div className="flex flex-col">
              <div>
                <div className="flex justify-between mb-[10px] mt-[15px]">
                  <span>Giao tới</span>
                  <Link
                    to={`${PATH_NAME.USER_CART}`}
                    onClick={() => {
                      setOpenShipModal(true)
                    }}
                  >
                    Thay đổi
                  </Link>
                </div>
                <div className="flex ">
                  <h1>{shipData.username}</h1>
                  <h1 className="ml-[10px]">{shipData.phoneNumber}</h1>
                </div>
                <div className="flex mb-[20px]">{`${shipData.address?.street}, ${shipData.address?.ward.WardName}, ${shipData.address?.district.DistrictName}, ${shipData.address?.province.ProvinceName}`}</div>
              </div>
              <div className="flex justify-between">
                <div>
                  <h1> Tạm tính</h1>
                </div>
                <div>
                  <h1>{totalFinal}</h1>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <h1>Tổng cộng</h1>
                </div>
                <div>
                  <h1>{totalFinal}</h1>
                </div>
              </div>
              <div className="flex ml-[80px] w-[200px]">
                <Button onClick={checkout}>Mua hàng</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
