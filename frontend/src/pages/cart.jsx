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
  decreaseCart
} from '../redux/api_request'

export default function Cart() {
  const [loading, setLoading] = useState(false)
  const [firstLoading,setFirstLoading]=useState(true)
  const [totalFinal, setTotalFinal] = useState(0)
  const [rowChecked, setRowChecked] = useState([])
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
      genre: 'giỏ hàng',
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
            slug: cart[i].book.slug
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

      let tong_cong = 0
      for (let i = 0; i < selectedRows.length; i++) {
        tong_cong += selectedRows[i]?.total
      }

      setTotalFinal(tong_cong)
    }
  }
  return (
    <div className="flex justify-center min-w-[1200px] mx-[20px]">
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
          className="w-[800px]"
          rowSelection={{
            type: 'checkbox',
            ...rowSelection
          }}
          columns={columns}
          dataSource={data}
        />
      </div>

      <div className="flex flex-col ml-[40px] w-[300px] h-[600px] bg-white ">
        <div>
          <div className="flex justify-between mb-[10px]">
            <span>Giao tới</span>
            <Link to="/user/setting">Thay đổi</Link>
          </div>
          <div className="flex ">
            <h1>Nguyễn Quốc Dũng</h1>
            <h1 className="ml-[10px]">0373110228</h1>
          </div>
          <div className="flex mb-[20px]">Kí túc xá, thành phố thủ đức</div>
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
          <Button>Mua hàng</Button>
        </div>
      </div>
    </div>
  )
}
