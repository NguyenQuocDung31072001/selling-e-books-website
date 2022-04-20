import {
  Button,
  Col,
  List,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip
} from 'antd'
import React, { useEffect, useState } from 'react'
import { getOrders, updateOrder } from '../redux/api_request'
import { Anchor } from 'antd'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import Text from 'antd/lib/typography/Text'

function OrderManage() {
  const { TabPane } = Tabs
  const [status, setStatus] = useState(1)
  const [loading, setLoading] = useState(false)

  function handleChangeStatus(key) {
    setLoading(true)
    setStatus(key)
  }

  useEffect(() => {
    setLoading(true)
  }, [])

  function handleLoading() {
    setLoading(true)
  }

  function handleLoaded() {
    setLoading(false)
  }

  return (
    <div className="px-10 py-4">
      {loading && (
        <div className="z-[2000] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full  bg-gray-400 bg-opacity-30 flex justify-center items-center">
          <Spin spinning={loading} size="large" tip="Loading..."></Spin>
        </div>
      )}
      <Tabs defaultActiveKey="1" onChange={handleChangeStatus} type="card">
        <TabPane tab="Tất cả" key="1">
          {status == 1 && (
            <OrderTable onLoading={handleLoading} onLoaded={handleLoaded} />
          )}
        </TabPane>
        <TabPane tab="Đang chờ" key="2">
          {status == 2 && (
            <OrderTable
              status={0}
              onLoading={handleLoading}
              onLoaded={handleLoaded}
            />
          )}
        </TabPane>
        <TabPane tab="Đã xác nhận" key="3">
          {status == 3 && (
            <OrderTable
              status={1}
              onLoading={handleLoading}
              onLoaded={handleLoaded}
            />
          )}
        </TabPane>
        <TabPane tab="Đang vận chuyển" key="4">
          {status == 4 && (
            <OrderTable
              status={2}
              onLoading={handleLoading}
              onLoaded={handleLoaded}
            />
          )}
        </TabPane>
        <TabPane tab="Giao hàng thành công" key="5">
          {status == 5 && (
            <OrderTable
              status={3}
              onLoading={handleLoading}
              onLoaded={handleLoaded}
            />
          )}
        </TabPane>
        <TabPane tab="Giao hàng không thành công" key="6">
          {status == 6 && (
            <OrderTable
              status={-3}
              onLoading={handleLoading}
              onLoaded={handleLoaded}
            />
          )}
        </TabPane>
        <TabPane tab="Đã hủy" key="7">
          {status == 7 && (
            <OrderTable
              status={-2}
              onLoading={handleLoading}
              onLoaded={handleLoaded}
            />
          )}
        </TabPane>
        <TabPane tab="Đã từ chối" key="8">
          {status == 8 && (
            <OrderTable
              status={-1}
              onLoading={handleLoading}
              onLoaded={handleLoaded}
            />
          )}
        </TabPane>
      </Tabs>
    </div>
  )
}
export default OrderManage

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
      dataIndex: ['user', 'username'],
      key: 'user',
      sorter: (a, b) => {},
      sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Sách',
      dataIndex: 'books',
      key: 'books',
      render: books => (
        <Anchor style={{ borderLeft: '0' }}>
          {books.map(item => (
            <Link href="/" title={`${item.book.name} - sl: ${item.amount}`} />
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
      key: 'status',
      sorter: (a, b) => {},
      sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
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
      sorter: (a, b) => {},
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

function ActionContainer(props) {
  const { data, onUpdate, onLoading, ...other } = props
  const [openModal, setOpenModal] = useState(false)
  const showModal = () => {
    setOpenModal(true)
  }

  const hideModal = () => {
    setOpenModal(false)
  }

  const handleConfirm = async () => {
    const currentStatus = data.status
    if (currentStatus >= 0 && currentStatus < 3) {
      onLoading()
      const newStatus = currentStatus + 1
      const updateInfo = {
        _id: data._id,
        currentStatus,
        newStatus
      }
      const updatedOrder = await updateOrder(updateInfo)
      onUpdate(updatedOrder)
      setOpenModal(false)
    }
  }

  const handleCancel = async () => {
    const currentStatus = data.status
    if (currentStatus >= 0 && currentStatus < 3) {
      onLoading()
      const updateInfo = {
        _id: data._id,
        currentStatus,
        newStatus: -1
      }
      const updatedOrder = await updateOrder(updateInfo)
      onUpdate(updatedOrder)
      setOpenModal(false)
    }
  }

  function confirmTitle(status) {
    if (status == 0) return 'Xác nhận'
    else if (status == 1) return 'Đã tiến hành vận chuyển'
    else if (status == 2) return 'Xác nhận giao hàng thành công'
  }

  function refuseTitle(status) {
    if (status == 0) return 'Từ chối '
    else if (status == 1) return 'Sự cố'
    else if (status == 2) return 'Giao hàng không thành công'
  }

  return (
    <Space size="middle">
      <Tooltip title="Chi tiết">
        <Button shape="circle" icon={<EyeOutlined />} onClick={showModal} />
      </Tooltip>
      {data.status >= 0 && data.status < 3 && (
        <Tooltip title={confirmTitle(data.status)}>
          <Button shape="circle" icon={<CheckOutlined />} onClick={showModal} />
        </Tooltip>
      )}
      {data.status >= 0 && data.status < 3 && (
        <Tooltip title={refuseTitle(data.status)}>
          <Button shape="circle" icon={<CloseOutlined />} onClick={showModal} />
        </Tooltip>
      )}
      <DetailModal
        visible={openModal}
        onClose={() => hideModal()}
        data={data}
        onRefuse={handleCancel}
        onConfirm={handleConfirm}
      />
    </Space>
  )
}

function DetailModal(props) {
  const { data, onClose, onConfirm, onRefuse, visible } = props
  // const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setConfirmLoading(false)
    }, 2000)
  }

  return (
    <>
      <Modal
        title="Đơn hàng"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={onClose}
        width={768}
        footer={[
          <Button key="back" onClick={onRefuse}>
            Từ chối
          </Button>,
          <Button key="submit" type="primary" onClick={onConfirm}>
            Xác nhận
          </Button>
        ]}
      >
        <Row gutter={[0, 12]}>
          <Col span={12}>
            <Text strong> Mã đơn hàng:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>{data._id}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Khách hàng:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong> {data.user.username}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Liên hệ:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong> {data.phone}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Địa chỉ giao hàng:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>
              {`${data.address.ward} - ${data.address.district} - ${data.address.province}`}
            </Text>
          </Col>

          <Col span={12}>
            <Text strong>Tình trạng thanh toán:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>
              {data.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </Text>
          </Col>

          <Col span={12}>
            <Text strong>Hình thức thanh toán:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>{data.paymentMethod}</Text>
          </Col>

          <Col span={24}>
            <BooksTable data={data.books} />
          </Col>
          <Col span={12}>
            <Text strong>Tổng cộng:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(data.total)}
            </Text>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

function BooksTable(props) {
  const { data } = props
  const { Link } = Anchor
  const dataRender = data.map((item, index) => {
    item.index = index + 1
    return item
  })
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '4rem',
      ellipsis: true
    },
    {
      title: 'Tên sách',
      dataIndex: ['book', 'name'],
      key: 'book',
      ellipsis: true
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
      ellipsis: true
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      ellipsis: true,
      render: item =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(item)
    },
    {
      title: 'Thành tiền',
      dataIndex: '',
      key: 'price',
      ellipsis: true,
      align: 'right',
      render: item =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(item.amount * item.price)
    }
  ]

  return <Table columns={columns} dataSource={data} pagination={false} />
}
