import { Spin, Tabs } from 'antd'
import React from 'react'
import PurchaseTable from '../component/purchase_user/purchase_table'
import { useDispatch, useSelector } from 'react-redux'

export default function UserPurchase() {
  const { TabPane } = Tabs
  const currentUser = useSelector(state => state.auth.login.currentUser)
  return (
    <div className="w-full h-full bg-slate-100 flex flex-col items-center">
      <div className="max-w-screen-lg container py-10">
        <Tabs defaultActiveKey="1" onChange={() => {}} type="card">
          <TabPane tab="Tất cả" key="1">
            <PurchaseTable status={5} account={currentUser._id} />
          </TabPane>
          <TabPane tab="Chờ xác nhận" key="2">
            <PurchaseTable status={0} account={currentUser._id} />
          </TabPane>
          <TabPane tab="Chờ vận chuyển" key="3">
            <PurchaseTable status={1} account={currentUser._id} />
          </TabPane>
          <TabPane tab="Đang giao" key="4">
            <PurchaseTable status={2} account={currentUser._id} />
          </TabPane>
          <TabPane tab="Đã giao" key="5">
            <PurchaseTable status={3} account={currentUser._id} />
          </TabPane>
          <TabPane tab="Đã hủy" key="7">
            <PurchaseTable status={-1} account={currentUser._id} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}
