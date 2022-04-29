import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import PaginationFunc from '../component/pagination'
import { getAllBook } from '../redux/api_request'
import { message, Spin } from 'antd'
import { PATH_NAME } from '../config/pathName'
export default function AllBookAdmin() {
//   const currentUser = useSelector(state => state.auth.login.currentUser)
//   const navigate = useNavigate()
  const dispatch = useDispatch()
  const [bookData, setBookData] = useState([])
  //handle pagination
  const [bookRender, setBookRender] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: bookData.length
  })

  const pageChange = (current, pageSize) => {
    // console.log(current,pageSize)
    setPagination({
      ...pagination,
      page: current,
      limit: pageSize
    })
  }
  useEffect(() => {
    let _page = pagination.page
    let _limit = pagination.limit
    let _length = bookData.length
    // console.log(_page,_limit,_length)
    let _bookRender = []

    if (_length <= _page * _limit) {
      _bookRender = bookData.slice((_page - 1) * _limit, _length)
    } else {
      _bookRender = bookData.slice((_page - 1) * _limit, _page * _limit)
    }
    setBookRender(_bookRender)
  }, [pagination])

  // useEffect(()=>{
  //   console.log(bookRender)
  // },[bookRender])

  useEffect(() => {
    const breadcrumb = { genre: '', name_book: '' }
    dispatch(updateBreadcrumb(breadcrumb))
    setDataBookFnc()
  }, [])

  useEffect(() => {
    if (bookData.length > 0) {
      setPagination(prev => {
        return {
          ...prev,
          total: bookData.length
        }
      })
    }
  }, [bookData])

  const setDataBookFnc = async () => {
    let data = await getAllBook()
    setBookData(data || [])
  }

  return (
    <div className="flex flex-col justify-center items-center">
        <div className='w-full h-[100px] bg-sky-500'>
            <p>Tất cả sách</p>
        </div>
      <div className="flex flex-wrap mt-[30px] p-[18px] w-[88%] bg-white">
        {bookRender.length === 0 && (
          <div className='w-full h-full flex items-center justify-center'>
            <Spin tip="Loading..."/>
          </div>
          
        )}
        {bookRender.map((book, key) => (
          <div
            key={key}
            className="group w-[240px] h-[290px] m-[10px] p-[5px] shadow-xl overflow-hidden cursor-pointer shadow-neutral-400"
          >
            <Link to={`${PATH_NAME.ALL_BOOK_ADMIN}/${book.genres[0]?.slug}/${book.slug}`}>
              <div className="flex items-center p-[10px] h-[240px]">
                <img src={book.coverUrl} className="object-cover" alt="" />
              </div>
              <div className="flex flex-col h-[110px] transition translate-y-[60px] duration-[0.25s] group-hover:translate-y-[-60px] group-hover:text-white group-hover:bg-stone-600">
                <span>{book.name}</span>
                <span>Thể loại: {book.genres[0]?.name}</span>
                <span>Tác giả: {book.authors[0]?.fullName}</span>
                <span>Mô tả: {book.description}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-[30px]">
        <PaginationFunc pagination={pagination} handlePageChange={pageChange} />
      </div>
      <div className="w-full h-[300px]"></div>
    </div>
  )
}
