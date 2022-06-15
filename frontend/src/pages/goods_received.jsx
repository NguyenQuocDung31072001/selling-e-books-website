import {
  Spin,
  Tabs,
  DatePicker,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Row,
  Col
} from 'antd'
import { Option } from 'antd/lib/mentions'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import NewGoodsReceivedModal from '../component/goodsReceived/create_goods_received'
import GoodsReceivedTable from '../component/goodsReceived/goodsReceivedTable'
import OrderTable from '../component/order_admin/order_table'
import { getAllGoodsReceived } from '../redux/api_request'
import { openNotification } from '../utils/notification'

function GoodsReceived() {
  const { RangePicker } = DatePicker
  const { Title, Text } = Typography
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({
    book: '',
    date: undefined
  })
  const [sorter, setSorter] = useState({})
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])

  function handleLoading() {
    setLoading(true)
  }

  function changeFilter(value) {
    const newFilter = { ...filter, ...value }
    setFilter(newFilter)
  }

  const handleChange = (pagination, filters, sorter) => {
    console.log(sorter)
    setSorter(sorter)
  }

  const InsertGoodsReceived = goodsReceived => {
    const newData = [...data, goodsReceived]
    console.log(newData)
    setData(newData)
    setLoading(false)
    openNotification(
      'success',
      'Nhập sách thành công!',
      'Nhập sách thành công, phiếu nhập sách đã được lưu vào hệ thống!'
    )
  }

  const handleError = () => {
    setLoading(false)
    openNotification(
      'error',
      'Nhập sách không thành công!',
      'Bạn vui lòng kiểm tra lại thông tin và kết nối mạng của mình!'
    )
  }

  useEffect(() => {
    const getGoodsReceived = async () => {
      const filterQuery = {}
      if (filter.book != undefined && filter.book != '')
        filterQuery.book = filter.book
      if (filter.date != undefined && filter.date[0]) {
        filterQuery.from = filter.date[0].format('YYYY-MM-DD')
        filterQuery.to = filter.date[1].format('YYYY-MM-DD')
      }
      const goodsReceived = await getAllGoodsReceived(page, sorter, filterQuery)
      setData(goodsReceived)
    }
    getGoodsReceived()
  }, [page, sorter, filter])

  return (
    <div className="py-4 px-4 flex flex-col justify-start items-center  space-y-4">
      <Title level={3} style={{ margin: 0 }}>
        NHẬP HÀNG
      </Title>
      <div className="flex flex-row justify-between w-full">
        <NewGoodsReceivedModal
          label="Nhập sách"
          onLoading={handleLoading}
          onSuccess={InsertGoodsReceived}
          onError={handleError}
        />
        <div className="flex flex-row justify-center items-center ">
          <Form
            layout="inline"
            initialValues={{
              book: filter.book,
              date: filter.date
            }}
            onValuesChange={changeFilter}
          >
            <Form.Item name="book">
              <Input placeholder="Tên sách"></Input>
            </Form.Item>

            <Form.Item name="date">
              <RangePicker
                placeholder={['Từ ngày', 'Đến ngày']}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <GoodsReceivedTable data={data} onChange={handleChange} sorter={sorter} />
    </div>
  )
}
export default GoodsReceived
