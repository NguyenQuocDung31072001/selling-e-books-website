import { Anchor, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import {
  getAllGoodsReceived,
  getAllImport,
  getOrders
} from '../../redux/api_request'
import moment from 'moment'
import NewGoodsReceivedModal from './create_goods_received'

function GoodsReceivedTable(props) {
  const { data, onChange, sorter } = props
  const columns = [
    {
      title: 'ID Phiếu Nhập',
      dataIndex: '_id',
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },
      sortOrder: sorter.column?.title === 'ID Phiếu Nhập' && sorter.order,
      ellipsis: true
    },
    {
      title: 'Tên Sách',
      dataIndex: ['book', 'name'],
      ellipsis: true,
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },
      sortOrder: sorter.column?.title === 'Tên Sách' && sorter.order
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'date',
      ellipsis: true,
      render: date => <> {moment(date).format('DD-MM-YYYY')}</>,
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },
      sortOrder: sorter.column?.title === 'Ngày nhập' && sorter.order
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      ellipsis: true,
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },
      sortOrder: sorter.column?.title === 'Số lượng' && sorter.order
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      ellipsis: true,
      render: price => (
        <>
          {' '}
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(price)}
        </>
      ),
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },
      sortOrder: sorter.column?.title === 'Đơn giá' && sorter.order
    }
  ]

  return (
    <>
      <Table
        className="admin_order_table"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        sticky
        rowKey="_id"
      />
    </>
  )
}

export default GoodsReceivedTable
