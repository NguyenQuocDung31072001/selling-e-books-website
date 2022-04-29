import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PaginationFunc from '../component/pagination'
import SlideshowUser from '../component/slideshow_user'
import { getAllBook } from '../redux/api_request'
import { Spin } from 'antd'
import { PATH_NAME } from '../config/pathName'
export default function HomePagesUser() {
  const querySearch = useSelector(state => state.search.query)

  const [bookData, setBookData] = useState([])
  const [bookFilter, setBookFilter] = useState([])
  const [bookRender, setBookRender] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: bookData.length
  })

  const pageChange = (current, pageSize) => {
    setPagination({
      ...pagination,
      page: current,
      limit: pageSize
    })
  }
  useEffect(() => {
    //load api lấy tất cả sách bỏ vào bookData
    const setDataBookFnc = async () => {
      let data = await getAllBook()
      setBookData(data || [])
    }
    // setLoading(false)
    setDataBookFnc()
  }, [])

  useEffect(() => {
    //sau đó set total cho pagination và set data cho bookFilter, bookFilter là thằng trung gian dùng để search
    if (bookData.length > 0) {
      setPagination(prev => {
        return {
          ...prev,
          total: bookData.length
        }
      })
    }
    setBookFilter(bookData)
  }, [bookData])

  useEffect(() => {
    //khi bookFilter change hoặc pagination change thì set lại data cho bookRander, bookRender dùng để hiển thị sách ra cho người dùng
    let _page = pagination.page
    let _limit = pagination.limit
    let _length = bookFilter.length
    let _bookRender = []

    if (_length <= _page * _limit) {
      _bookRender = bookFilter.slice((_page - 1) * _limit, _length)
    } else {
      _bookRender = bookFilter.slice((_page - 1) * _limit, _page * _limit)
    }
    setBookRender(_bookRender)
  }, [pagination, bookFilter])

  useEffect(() => {
    //khi query thay đổi (khi đang nhập vào ô tìm kiếm) thì set lại bookFilter
    let dataQuery = bookData?.filter(book =>
      book.name.toLowerCase().includes(querySearch)
    )
    setBookFilter(dataQuery)
  }, [querySearch])

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-[350px] mt-[30px]">
        <SlideshowUser />
      </div>

      <div className="flex flex-wrap  p-[18px] w-[88%] bg-white">
        {bookData.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <Spin tip="Loading..." />
          </div>
        )}
        {bookRender.map(
          (
            book,
            key //bookRender là sách sau khi xữ lý xong (sau khi chia pagination, sau khi tìm kiếm) và hiển thị cho user
          ) => (
            <div
              key={key}
              className="group w-[240px] h-[290px] m-[10px] p-[5px] shadow-xl overflow-hidden cursor-pointer shadow-neutral-400"
            >
              <Link
                to={`${PATH_NAME.USER_HOME_PAGE}/${book.genres[0]?.slug}/${book.slug}`}
              >
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
          )
        )}
      </div>
      <div className="mt-[30px]">
        <PaginationFunc pagination={pagination} handlePageChange={pageChange} />
      </div>
      <div className="w-full h-[300px]"></div>
    </div>
  )
}
