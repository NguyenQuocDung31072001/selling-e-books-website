import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PaginationFunc from '../component/pagination'
import SlideshowUser from '../component/slideshow_user'
import {
  getAllBook,
  getAllGenresForAddBook,
  getAllAuthorForAddBook
} from '../redux/api_request'
import { Button, Spin, Typography, Select, Input } from 'antd'
import { PATH_NAME } from '../config/pathName'
import { numberFormat } from '../utils/formatNumber'
import { updateQuery } from '../redux/search_slices'
import {
  HeartFilled,
  SearchOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons'

const { Title } = Typography
const { Option } = Select
export default function CategoryUser() {
  const querySearch = useSelector(state => state.search.search)

  const [bookData, setBookData] = useState([])
  const [bookFilter, setBookFilter] = useState([])
  const [bookRender, setBookRender] = useState([])
  const [allGenres, setAllGenres] = useState([])
  const [allAuthors, setAllAuthors] = useState([])
  const [genresSearch, setGenresSearch] = useState('')
  const [authorSearch, setAuthorsSearch] = useState('')
  const [inputSearch, setInputSearch] = useState('')

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: bookData.length
  })
  const dispatch = useDispatch()
  const pageChange = (current, pageSize) => {
    // console.log(current,pageSize)
    setPagination({
      ...pagination,
      page: current,
      limit: 15
    })
  }
  useEffect(() => {
    //load api lấy tất cả sách bỏ vào bookData
    ;(async function () {
      // cú pháp IIFE->Thực thi hàm luôn, khỏi gọi lại, khỏi đặt tên->dùng cho hàm private và ko cần tái sử dụng.
      let data = await getAllBook()
      setBookData(data || [])
    })()
    ;(async function () {
      //load api lấy tất cả thể loại
      const allGenre = await getAllGenresForAddBook()
      const allGenreName = []
      for (let i = 0; i < allGenre.length; i++) {
        allGenreName.push(allGenre[i].name)
      }
      setAllGenres(allGenreName)
    })()
    ;(async function () {
      //load api lấy tất cả tác giả
      const allAuthor = await getAllAuthorForAddBook()
      const allAuthorName = []
      for (let i = 0; i < allAuthor.length; i++) {
        allAuthorName.push(allAuthor[i].fullName)
      }
      setAllAuthors(allAuthorName)
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
        book.name.toLowerCase().includes(querySearch.query.name)
      )
    }
    if (querySearch.type === 'many') {
      dataQuery = bookData?.filter(
        book =>
          book.genres[0]?.name.includes(querySearch.query?.genres) &&
          book.authors[0]?.fullName.includes(querySearch.query?.authors) &&
          book.name.toLowerCase().includes(querySearch.query?.name)
      )
    }
    if(querySearch.type==='all'){
      dataQuery=bookData
    }
    setBookFilter(dataQuery)
  }, [querySearch])

  const searchFnc = () => {
    let search = {
      query: {
        genres: genresSearch,
        authors: authorSearch,
        name: inputSearch
      },
      type: 'many'
    }
    dispatch(updateQuery(search))
  }
  const allBookFnc=()=>{
    let search = {
      query: {
      },
      type: 'all'
    }
    dispatch(updateQuery(search))
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-wrap w-full justify-center">
        {bookData.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <Spin tip="Loading..." />
          </div>
        )}
        <div className="w-full flex flex-col justify-center items-center mb-10">
          <div>
            <Title level={2}>Tìm kiếm sách</Title>
          </div>
          <div className="w-[70%] flex justify-between">
            <Button onClick={allBookFnc}>Tất cả sách</Button>
            <Select
              placeholder="Thể loại"
              style={{ width: 230 }}
              onChange={value => setGenresSearch(value)}
            >
              {allGenres.length > 0 &&
                allGenres.map((genres, index) => {
                  return (
                    <Option key={index} value={genres}>
                      {genres}
                    </Option>
                  )
                })}
            </Select>
            <Select
              placeholder="Tác giả"
              style={{ width: 230 }}
              onChange={value => setAuthorsSearch(value)}
            >
              {allAuthors.length > 0 &&
                allAuthors.map((authors, index) => {
                  return (
                    <Option key={index} value={authors}>
                      {authors}
                    </Option>
                  )
                })}
            </Select>
            <Input
              placeholder="Nhập tên sách"
              style={{ width: 320 }}
              prefix={<SearchOutlined />}
              onChange={e => setInputSearch(e.target.value)}
            />
            <Button onClick={searchFnc}>Tìm kiếm</Button>
          </div>
        </div>
        <div className="flex flex-wrap bg-white h-fit w-[97%]">
          {bookRender.map(
            (
              book,
              key //bookRender là sách sau khi xữ lý xong (sau khi chia pagination, sau khi tìm kiếm) và hiển thị cho user
            ) => (
              <div
                key={key}
                className="group w-[260px] h-[182px] m-[10px] mx-4 p-4 flex flex-col items-center justify-center  overflow-hidden"
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
                          <ShoppingCartOutlined style={{ color: '#27ae60' }} />
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
      <div className="my-[30px]">
        <PaginationFunc pagination={pagination} handlePageChange={pageChange} />
      </div>
      <div className="w-[97%] h-[200px] mb-8 bg-white relative">
        <div className="absolute top-2 left-2 text-[25px]">
          <h1>Sách nổi bật</h1>
        </div>
      </div>
      <div className="w-full mt-[50px] h-[100px] bg-white"></div>
    </div>
  )
}
