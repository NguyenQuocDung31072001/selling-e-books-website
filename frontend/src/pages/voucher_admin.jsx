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
  const [data, setData] = useState([])

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter)
  }

  const updateVoucher = voucher => {
    const newData = [...data]
    const index = newData.findIndex(item => item._id === voucher._id)
    newData.splice(index, 1, voucher)
    setData(newData)
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
  }

  function deleteVoucher(voucher) {
    const newData = data.filter(item => item._id !== voucher._id)
    setData(newData)
  }

  function insertVoucher(voucher) {
    const newData = [...data, voucher]
    setData(newData)
    setOpenInsertModal(false)
  }

  const columns = [
    {
      title: 'Mã giảm',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => {
        return a.code > b.code ? 1 : -1
      },

      sortOrder: sortedInfo.columnKey === 'code' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: (a, b) => {
        return moment(a.startTime) > moment(b.startTime) ? 1 : -1
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
        return moment(a.endTime) > moment(b.endTime) ? 1 : -1
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
        return a.minSpend - b.minSpend
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
      title: 'Số lượng tối đa',
      dataIndex: 'limit',
      key: 'limit',
      sorter: (a, b) => {
        return a.used - b.used
      },
      render: value => <>{value || 'Không giới hạn'}</>,
      sortOrder: sortedInfo.columnKey === 'endTime' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Đã dùng',
      dataIndex: 'used',
      key: 'used',
      sorter: (a, b) => {
        return a.used - b.used
      },
      sortOrder: sortedInfo.columnKey === 'endTime' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Hành động',
      key: '',
      render: data => (
        <VoucherActionContainer
          data={data}
          onUpdate={updateVoucher}
          onDelete={deleteVoucher}
        />
      ),
      sortOrder: sortedInfo.columnKey === 'minSpend' && sortedInfo.order,
      ellipsis: true
    }
  ]

  return (
    <div className="py-4 px-4 flex flex-col justify-start items-center">
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
          visible={true}
        />
      )}
    </div>
  )
}

export default VoucherManage
