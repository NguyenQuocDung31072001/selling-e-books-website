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
import OrderTable from '../component/order_admin/order_table'

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
