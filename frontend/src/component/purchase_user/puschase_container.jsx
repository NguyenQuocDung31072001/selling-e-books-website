import { BookFilled } from '@ant-design/icons'
import { Col, Image, Row } from 'antd'
import React from 'react'

export default function PurchaseContainer(props) {
  const { purchase } = props
  // console.log('purchase',purchase)
  return (
    <div className="bg-white px-4 ">
      <div className="flex flex-row justify-between py-3 border-b">
        <div>
          <span className="text-base font-medium">{purchase._id}</span>{' '}
        </div>
        <div className="text-sm font-normal uppercase text-orange-600">
          {purchase.statusName}
        </div>
      </div>
      <div className="">
        {purchase.books.map((item, index) => {
          console.log(item)
          return (
            <div key={item._id} className="flex flex-row justify-between pt-4">
              <div className="flex flex-row space-x-2 w-max">
                <Image
                  height={80}
                  width={60}
                  src={item.book.coverUrl}
                  className="object-cover"
                />
                <div className="flex flex-col items-start">
                  <span className="text-base font-normal">
                    {item.book.name}
                  </span>
                  <span className="text-base font-normal">{`sl: ${item.amount}`}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-orange-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(item.price)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-row justify-end items-center py-4 border-t">
        <div>
          <span>Tổng số tiền:</span>
        </div>
        <div>
          <span className="text-xl font-semibold text-orange-600 px-2">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(purchase.total)}
          </span>
        </div>
      </div>
    </div>
  )
}
