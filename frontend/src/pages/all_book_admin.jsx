import { Table, Tag, Space } from 'antd'
import { useEffect, useState } from 'react'
import { getAllBook, getAllBookForAdmin } from '../redux/api_request'
import UpdateBookAdmin from '../component/update_book_admin'
import DeleteBook from '../component/book_manage/delete_book'
import NewGoodsReceivedModal from '../component/goodsReceived/create_goods_received'
import { openNotification } from '../utils/notification'

export default function AllBookAdmin() {
  const [bookData, setBookData] = useState([])
  const [data, setData] = useState([])
  const columns = [
    {
      title: 'STT',
      dataIndex: 'no',
      key: 'no',
      render: no => <p>{no}</p>
    },
    {
      title: 'Ảnh bìa',
      dataIndex: 'bookImage',
      key: 'bookImage',
      render: bookImage => (
        <img
          className="w-[70px] h-[100px] object-cover"
          src={bookImage}
          alt=""
        />
      )
    },
    {
      title: 'Tên sách',
      dataIndex: 'bookName',
      key: 'bookName',
      render: bookName => <p>{bookName}</p>
    },
    {
      title: 'Thể loại',
      dataIndex: 'bookCategory',
      key: 'bookCategory',
      render: bookCategory => <p>{bookCategory}</p>
    },
    {
      title: 'Tác giả',
      dataIndex: 'bookAuthor',
      key: 'bookAuthor',
      render: bookAuthor => <p>{bookAuthor}</p>
    },
    {
      title: 'Mô tả',
      dataIndex: 'bookDescription',
      key: 'bookDescription',
      render: bookDescription => <p>{bookDescription}</p>
    },
    {
      title: 'Giá',
      dataIndex: 'bookPrice',
      key: 'bookPrice',
      render: bookPrice => <p>{bookPrice}</p>
    },
    {
      title: 'Tính năng',
      dataIndex: 'action',
      key: 'action',
      render: action => {
        return (
          <>
            <div className="flex flex-row justify-around items-center">
              <UpdateBookAdmin
                book={action}
                onSuccess={updateBookData}
                onError={handleError}
              />
              <DeleteBook book={action} onDeleted={updateDeletedBook} />
              <NewGoodsReceivedModal
                book={action}
                buttonType=""
                buttonSize="normal"
                onSuccess={updateReceived}
                onError={handleError}
              />
            </div>{' '}
          </>
        )
      }
    }
  ]
  useEffect(() => {
    ;(async function () {
      let data = await getAllBookForAdmin()
      setBookData(data || [])
    })()
    return () => {
      setBookData([])
    }
  }, [])
  useEffect(() => {
    let _data = []
    bookData.forEach((book, index) => {
      _data.push({
        no: index + 1,
        bookImage: book.coverUrl,
        bookName: book.name,
        bookCategory: book.genres[0]?.name,
        bookAuthor: book.authors[0]?.fullName,
        bookDescription: book.description,
        bookPrice: book.price,
        action: book
      })
    })
    setData(_data)
    return () => {
      setData([])
    }
  }, [bookData])

  const updateDeletedBook = deletedBook => {
    const newBookData = bookData.filter(book => {
      return book._id !== deletedBook._id
    })
    setBookData(newBookData)
    openNotification(
      'success',
      'Xóa thành công!',
      'Thông tin sách xóa khỏi hệ thống!'
    )
  }

  const updateReceived = goodsReceived => {
    const updatedBook = goodsReceived.book
    const index = bookData.findIndex(book => book._id == updatedBook._id)
    const newBookData = {
      ...updatedBook,
      genres: bookData[index].genres,
      authors: bookData[index].authors
    }
    let newData = [...bookData]
    newData.splice(index, 1, newBookData)
    let _data = []
    newData.forEach((book, index) => {
      _data.push({
        no: index + 1,
        bookImage: book.coverUrl,
        bookName: book.name,
        bookCategory: book.genres[0]?.name,
        bookAuthor: book.authors[0]?.fullName,
        bookDescription: book.description,
        bookPrice: book.price,
        action: book
      })
    })
    setData(_data)
    openNotification(
      'success',
      'Nhập sách thành công!',
      'Sách đã được nhập thành công, bạn có thể kiểm tra phiếu nhập sách ở trang "Nhập Sách"!'
    )
  }

  const updateBookData = updatedBook => {
    const index = bookData.findIndex(book => book._id == updatedBook._id)
    let newData = [...bookData]
    newData.splice(index, 1, updatedBook)
    let _data = []
    newData.forEach((book, index) => {
      _data.push({
        no: index + 1,
        bookImage: book.coverUrl,
        bookName: book.name,
        bookCategory: book.genres[0]?.name,
        bookAuthor: book.authors[0]?.fullName,
        bookDescription: book.description,
        bookPrice: book.price,
        action: book
      })
    })
    setData(_data)
    openNotification(
      'success',
      'Cập nhật thông tin sách thành công!',
      'Thông tin sách đã được cập nhật và lưu vào hệ thống!'
    )
  }

  const handleError = (message, description) => {
    openNotification('error', message, description)
  }

  return (
    <div className="p-4">
      <div className="w-full flex justify-center px-4 mb-4 border-b-[1px] border-solid border-gray-400">
        <p className="text-3xl font-medium">Tất cả sách</p>
      </div>
      <Table columns={columns} dataSource={data} rowKey="no" />
    </div>
  )
}
// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Link, useNavigate } from 'react-router-dom'
// import { updateBreadcrumb } from '../redux/breadcrumb_slices'
// import PaginationFunc from '../component/pagination'
// import { getAllBook } from '../redux/api_request'
// import { message, Spin } from 'antd'
// import { PATH_NAME } from '../config/pathName'
// export default function AllBookAdmin() {
//   const dispatch = useDispatch()
//   const [bookData, setBookData] = useState([])
//   //handle pagination
//   const [bookRender, setBookRender] = useState([])
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: bookData.length
//   })

//   const pageChange = (current, pageSize) => {
//     // console.log(current,pageSize)
//     setPagination({
//       ...pagination,
//       page: current,
//       limit: pageSize
//     })
//   }
//   useEffect(() => {
//     let _page = pagination.page
//     let _limit = pagination.limit
//     let _length = bookData.length
//     // console.log(_page,_limit,_length)
//     let _bookRender = []

//     if (_length <= _page * _limit) {
//       _bookRender = bookData.slice((_page - 1) * _limit, _length)
//     } else {
//       _bookRender = bookData.slice((_page - 1) * _limit, _page * _limit)
//     }
//     setBookRender(_bookRender)
//   }, [pagination])

//   // useEffect(()=>{
//   //   console.log(bookRender)
//   // },[bookRender])

//   useEffect(() => {
//     const breadcrumb = { genre: '', name_book: '' }
//     dispatch(updateBreadcrumb(breadcrumb))
//     setDataBookFnc()
//   }, [])

//   useEffect(() => {
//     if (bookData.length > 0) {
//       setPagination(prev => {
//         return {
//           ...prev,
//           total: bookData.length
//         }
//       })
//     }
//   }, [bookData])

//   const setDataBookFnc = async () => {
//     let data = await getAllBook()
//     setBookData(data || [])
//   }

//   return (
//     <div className="flex flex-col justify-center items-center">
//         <div className='w-full h-[100px] bg-sky-500'>
//             <p>Tất cả sách</p>
//         </div>
//       <div className="flex flex-wrap mt-[30px] p-[18px] w-[88%] bg-white">
//         {bookRender.length === 0 && (
//           <div className='w-full h-full flex items-center justify-center'>
//             <Spin tip="Loading..."/>
//           </div>

//         )}
//         {bookRender.map((book, key) => (
//           <div
//             key={key}
//             className="group w-[240px] h-[290px] m-[10px] p-[5px] shadow-xl overflow-hidden cursor-pointer shadow-neutral-400"
//           >
//             <Link to={`${PATH_NAME.ALL_BOOK_ADMIN}/${book.genres[0]?.slug}/${book.slug}`}>
//               <div className="flex items-center p-[10px] h-[240px]">
//                 <img src={book.coverUrl} className="object-cover" alt="" />
//               </div>
//               <div className="flex flex-col h-[110px] transition translate-y-[60px] duration-[0.25s] group-hover:translate-y-[-60px] group-hover:text-white group-hover:bg-stone-600">
//                 <span>{book.name}</span>
//                 <span>Thể loại: {book.genres[0]?.name}</span>
//                 <span>Tác giả: {book.authors[0]?.fullName}</span>
//                 <span>Mô tả: {book.description}</span>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//       <div className="mt-[30px]">
//         <PaginationFunc pagination={pagination} handlePageChange={pageChange} />
//       </div>
//       <div className="w-full h-[300px]"></div>
//     </div>
//   )
// }
