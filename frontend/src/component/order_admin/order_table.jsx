import { Anchor, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { getOrders } from '../../redux/api_request'
import ActionContainer from './action_container'

function OrderTable(props) {
  const { status, onLoading, onLoaded } = props
  const { Link } = Anchor

  const [filteredInfo, setFilteredInfo] = useState({})

  const [sortedInfo, setSortedInfo] = useState({})

  const [page, setPage] = useState(1)

  const [data, setData] = useState([])

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter)
  }

  useEffect(() => {
    const getOrderData = async () => {
      const orders = await getOrders(status, page, sortedInfo, filteredInfo)
      onLoaded()
      setData(orders)
    }
    getOrderData()
  }, [page, filteredInfo, sortedInfo])

  function handleUpdateOrder(updatedOrder) {
    const index = data.findIndex(item => item._id == updatedOrder._id)
    let newData = [...data]
    newData.splice(index, 1, updatedOrder)
    setData(newData)
    onLoaded()
  }

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: ['user', 'email'],
      key: 'user',
      sorter: (a, b) => {
        return a.user.email > b.user.email ? 1 : -1
      },
      sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Sách',
      dataIndex: 'books',
      key: 'books',
      render: books => (
        <Anchor style={{ borderLeft: '0' }}>
          {books.map((item,index) => (
            <Link key={index} href="/" title={`${item.book.name} - sl: ${item.amount}`} />
          ))}
        </Anchor>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => {},
      sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Tình trạng',
      dataIndex: 'statusName',
      key: 'statusName',
      sorter: (a, b) => {
        return a.status - b.status
      },
      sortOrder: sortedInfo.columnKey === 'statusName' && sortedInfo.order,
      render: status => {
        let color = ''
        switch (status) {
          case 'Không thành công':
          case 'Hủy':
          case 'Từ chối': {
            color = 'red'
            break
          }
          case 'Chờ xác nhận': {
            color = 'gray'
            break
          }
          case 'Đã xác nhận': {
            color = 'lime'
            break
          }
          case 'Đã vận chuyển': {
            color = 'blue'
            break
          }
          case 'Giao hàng thành công':
          case 'Đã nhận hàng': {
            color = 'green'
            break
          }
        }
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        )
      }
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'payment',
      sorter: (a, b) => {
        return a.payment - b.payment
      },
      sortOrder: sortedInfo.columnKey === 'payment' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Thay đổi',
      key: 'action',
      render: (text, record) => (
        <ActionContainer
          data={record}
          onUpdate={handleUpdateOrder}
          onLoading={onLoading}
        />
      )
    }
  ]

  return <Table columns={columns} dataSource={data} onChange={handleChange} />
}

export default OrderTable
