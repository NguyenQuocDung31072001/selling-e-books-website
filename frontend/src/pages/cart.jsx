import React, { useState, useEffect } from 'react'
import { Table, Button, Input } from 'antd'
import { DeleteOutlined, DeleteTwoTone, DeleteFilled } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginFailed } from '../redux/auth_slices'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { cart } from '../data/cart'
export default function Cart() {
  const [totalFinal, setTotalFinal] = useState(0)
  const [rowChecked, setRowChecked] = useState([])
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState(cart)
  const columns = [
    {
      title: 'Tất cả sản phẩm',
      dataIndex: 'product',
      render: product => (
        <div className="flex items-center">
          <img className="w-[50px] h-[50px]" src={product.image} alt="" />
          <span className="ml-[20px]">{product.name}</span>
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
  const increaseFnc = key => {
    // console.log(key)
    let indexKeyOfArray
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        indexKeyOfArray = i
        break
      }
    }
    // console.log('indexKeyOfArray', indexKeyOfArray)
    let newData = [...data]
    newData[indexKeyOfArray].count.value += 1
    newData[indexKeyOfArray].count.status = false
    newData[indexKeyOfArray].total =
      newData[indexKeyOfArray].price * newData[indexKeyOfArray].count.value

    setData(newData)
    // console.log('index of key ',rowChecked.indexOf(key))
    if (rowChecked.indexOf(key) > -1) {
      setTotalFinal(value => (value += newData[indexKeyOfArray].price))
    }
  }
  const decreaseFnc = key => {
    // console.log(key)
    let indexKeyOfArray
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        indexKeyOfArray = i
        break
      }
    }
    let newData = [...data]
    newData[indexKeyOfArray].count.value -= 1
    newData[indexKeyOfArray].total =
      newData[indexKeyOfArray].price * newData[indexKeyOfArray].count.value
    if (newData[indexKeyOfArray].count.value === 1) {
      newData[indexKeyOfArray].count.status = true
    }
    setData(newData)
    if (rowChecked.indexOf(key) > -1) {
      setTotalFinal(value => (value -= newData[indexKeyOfArray].price))
    }
  }
  const deleteProduct = key => {
    // console.log('key delete = ', key)
    let indexKeyOfArray
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        indexKeyOfArray = i
        break
      }
    }
    if(rowChecked.indexOf(key)>-1){

      setTotalFinal(value => (value -= data[indexKeyOfArray].total))
    }
    let newData = data.filter(data => data.key !== key)
    setData(newData)
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowChecked(selectedRowKeys)

      let tong_cong = 0
      for (let i = 0; i < selectedRows.length; i++) {
        // console.log(selectedRows[i]?.total)
        tong_cong += selectedRows[i]?.total
      }
      // console.log(tong_cong)
      setTotalFinal(tong_cong)
    }
  }
  useEffect(() => {
    if (currentUser?.role !== 'user') {
      dispatch(loginFailed())
      navigate('/login')
    }
  }, [currentUser])

  useEffect(() => {
    const breadcrumb = {
      genre: 'giỏ hàng',
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrumb))
  }, [])
  return (
    <div className="flex justify-center min-w-[1200px] mx-[20px]">
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
