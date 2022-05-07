import * as React from 'react'
import { Pagination } from 'antd'

function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <a>Previous</a>
  }
  if (type === 'next') {
    return <a>Next</a>
  }
  
  return originalElement
}

export default function PaginationFunc(props) {
  const { page, limit, total } = { ...props.pagination }
  const pageChange = props.handlePageChange

  const count = Math.ceil(total / limit)

  return (
    <div>
      {/* <Pagination count={count} shape="rounded" onChange={pageChange}/> */}
      {/* <Pagination itemRender={itemRender} total={total} onChange={pageChange} /> */}
      <Pagination defaultCurrent={1} count={count} total={total} onChange={pageChange}/>
    </div>
  )
}

// const pagination={
//     page:'', // page hiện tại
//     limit:'', // số sách mỗi page
//     total:'' //tổng số sách
// }

/*
    total page = Math.ceil(total/limit)

    page 1 ->0-29  (page-1)*limit - (page*limit-1)
    page 2 ->30-59 

    const book=[]
    const length=book.length()
    if length< (page*limit)  book.slice((page-1)*limit,length)

    if length >= (page*limit) book.slice((page-1)*limit,page*limit)

*/
