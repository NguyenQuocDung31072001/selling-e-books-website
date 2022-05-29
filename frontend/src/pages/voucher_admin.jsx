import { Anchor, Button, Spin, Table, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { getAllVoucher, getOrders } from '../redux/api_request'
import moment from 'moment'
import ActionContainer from '../component/order_admin/action_container'
import VoucherActionContainer from '../component/voucher/action_cotainer'
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import VoucherDetailModal from '../component/voucher/detail_modal'

function VoucherManage(props) {
  const {} = props
  const { Link } = Anchor
  const { Title } = Typography

  const [sortedInfo, setSortedInfo] = useState({})

  const [openInsertModal, setOpenInsertModal] = useState(false)
  const [load, setLoad] = useState(false)
  const [data, setData] = useState([])

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter)
  }

  const updateVoucher = voucher => {
    const newData = [...data]
    const index = newData.findIndex(item => item._id === voucher._id)
    newData.splice(index, 1, voucher)
    console.log(newData)
    setData(newData)
    setLoad(false)
  }

  const loading = () => {
    setLoad(true)
  }

  useEffect(() => {
    const getOrderData = async () => {
      const filterQuery = {}
      const orders = await getAllVoucher(filterQuery)
      setData(orders)
    }
    getOrderData()
  }, [])

  function handleUpdateOrder(updatedOrder) {
    const index = data.findIndex(item => item._id == updatedOrder._id)
    let newData = [...data]
    newData.splice(index, 1, updatedOrder)
    setData(newData)
    setLoad(false)
  }

  function deleteVoucher(voucher) {
    const newData = data.filter(item => item._id !== voucher._id)
    setData(newData)
    setLoad(false)
  }

  function insertVoucher(voucher) {
    const newData = [...data, voucher]
    setData(newData)
    setOpenInsertModal(false)
    setLoad(false)
  }

  const columns = [
    {
      title: 'Mã giảm',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },

      sortOrder: sortedInfo.columnKey === 'code' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },
      render: time => <> {moment(time).format('LT DD-MM-YYYY')}</>,
      sortOrder: sortedInfo.columnKey === 'startTime' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },
      render: time => <> {moment(time).format('LT DD-MM-YYYY')}</>,
      sortOrder: sortedInfo.columnKey === 'endTime' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'minSpend',
      key: 'minSpend',
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },
      render: value => (
        <>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(value)}
        </>
      ),
      sortOrder: sortedInfo.columnKey === 'minSpend' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Hành động',
      key: '',
      render: data => (
        <VoucherActionContainer
          data={data}
          onUpdate={updateVoucher}
          onLoading={loading}
          onDelete={deleteVoucher}
        />
      ),
      sortOrder: sortedInfo.columnKey === 'minSpend' && sortedInfo.order,
      ellipsis: true
    }
  ]

  return (
    <div className="py-4 px-4 flex flex-col justify-start items-center">
      {load && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full  bg-gray-400 bg-opacity-30 flex justify-center items-center z-10">
          <Spin spinning={loading} size="large" tip="Loading..."></Spin>
        </div>
      )}
      <div className="py-3 px-4 flex flex-row justify-between items-center w-full bg-white border">
        <Title level={3} style={{ margin: 0 }}>
          Mã giảm giá
        </Title>
        <Button
          type="primary"
          size="middle"
          onClick={() => setOpenInsertModal(true)}
        >
          Thêm mã giảm
        </Button>
      </div>
      <Table
        className="admin_order_table"
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        sticky
      />
      {openInsertModal && (
        <VoucherDetailModal
          onClose={() => {
            setOpenInsertModal(false)
          }}
          onUpdate={insertVoucher}
          onLoading={loading}
          visible={true}
        />
      )}
    </div>
  )
}

export default VoucherManage
