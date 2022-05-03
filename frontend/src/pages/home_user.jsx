import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PaginationFunc from '../component/pagination'
import SlideshowUser from '../component/slideshow_user'
import { getAllBook } from '../redux/api_request'
import { Button, Spin, Typography } from 'antd'
import { PATH_NAME } from '../config/pathName'
import GenreBookUser from '../component/genre_book_user'
import AuthorBookUser from '../component/author_book_user'
import { numberFormat } from '../utils/formatNumber'
import { HeartFilled, ShoppingCartOutlined } from '@ant-design/icons'
const { Title } = Typography
export default function HomePagesUser() {
  const querySearch = useSelector(state => state.search.search)

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
    ;(async function () {
      // cú pháp IIFE->Thực thi hàm luôn, khỏi gọi lại, khỏi đặt tên->dùng cho hàm private và ko cần tái sử dụng.
      let data = await getAllBook()
      setBookData(data || [])
    })()
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
    let dataQuery
    if (querySearch.type === 'name') {
      dataQuery = bookData?.filter(book =>
        book.name.toLowerCase().includes(querySearch.query)
      )
    }
    if (querySearch.type === 'genres') {
      dataQuery = bookData?.filter(book =>
        book.genres[0]?.name.includes(querySearch.query)
      )
    }
    if (querySearch.type === 'authors') {
      dataQuery = bookData?.filter(book =>
        book.authors[0]?.fullName.includes(querySearch.query)
      )
    }
    setBookFilter(dataQuery)
  }, [querySearch])

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-[350px] mt-[30px]">
        <SlideshowUser />
      </div>
      <div className="flex flex-wrap  p-[18px] w-[85%]">
        {bookData.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <Spin tip="Loading..." />
          </div>
        )}
        <div className="flex justify-between">
          <div className="flex flex-col bg-white mr-8">
            <GenreBookUser />
            <AuthorBookUser />
          </div>
          <div className="flex flex-wrap bg-white h-fit w-full">
            {bookRender.map(
              (
                book,
                key //bookRender là sách sau khi xữ lý xong (sau khi chia pagination, sau khi tìm kiếm) và hiển thị cho user
              ) => (
                <div
                  key={key}
                  className="group w-[260px] h-[182px] m-[10px] mx-4 px-4 flex flex-col items-center justify-center  overflow-hidden"
                >
                  <div className="w-full h-full flex ">
                    <div className=" w-[130px] h-[182px] relative ">
                      <img
                        src={book.coverUrl}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                      <div className="group-hover:w-full group-hover:h-full group-hover:flex group-hover:items-center group-hover:justify-center group-hover:absolute group-hover:top-0 group-hover:left-0 group-hover:bg-[#00000090] ">
                        <div>
                          <Link
                            to={`${PATH_NAME.USER_HOME_PAGE}/${book.genres[0]?.slug}/${book.slug}`}
                            className="cursor-pointer"
                          >
                            <Button type="primary">Xem sách</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="w-[130px] text-black">
                      <Title level={5}>{book.name}</Title>
                      <span>{book.authors[0]?.fullName}</span>
                      <Title level={4}>{numberFormat(book.price)}</Title>
                      <div className="flex items-center justify-around">
                        <div className="text-[30px] cursor-pointer ">
                          <Link to={`${PATH_NAME.USER_CART}`}>
                            <ShoppingCartOutlined  style={{color:"#27ae60"}}/>
                          </Link>
                        </div>
                        <div className="text-red-300 text-[25px]">
                          <HeartFilled />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex flex-col h-[110px] transition translate-y-[60px] duration-[0.25s] group-hover:translate-y-[-60px] group-hover:text-white group-hover:bg-stone-600">
                  <span>{book.name}</span>
                  <span>Thể loại: {book.genres[0]?.name}</span>
                  <span>Tác giả: {book.authors[0]?.fullName}</span>
                  <span>Mô tả: {book.description}</span>
                </div> */}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div className="my-[30px]">
        <PaginationFunc pagination={pagination} handlePageChange={pageChange} />
      </div>
      <div className="w-[83%] h-[200px] mb-8 bg-white relative">
        <div className="absolute top-2 left-2 text-[25px]">
          <h1>Sách nổi bật</h1>
        </div>
      </div>
      <div className="w-full mt-[50px] h-[200px] bg-black"></div>
    </div>
  )
}
