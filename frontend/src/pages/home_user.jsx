import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginFailed } from '../redux/auth_slices'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import PaginationFunc from '../component/pagination'
import { _book } from '../data/book'
import SlideshowUser from '../component/slideshow_user'
import { Image } from 'antd'

const book = _book

export default function HomePagesUser() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  //handle pagination
  const [bookRender, setBookRender] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: book.length
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
    let _length = book.length

    let _bookRender = []

    if (_length <= _page * _limit) {
      _bookRender = book.slice((_page - 1) * _limit, _length)
    } else {
      _bookRender = book.slice((_page - 1) * _limit, _page * _limit)
    }
    setBookRender(_bookRender)
  }, [pagination])

  //handle breadcrumb
  useEffect(() => {
    const breadcrumb = { genre: '', name_book: '' }
    dispatch(updateBreadcrumb(breadcrumb))
  }, [])

  //protected route
  // useEffect(() => {
  //   if (currentUser?.role !== 'user') {
  //     dispatch(loginFailed())
  //     navigate('/login')
  //   }
  // }, [currentUser])

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-[350px] mt-[30px]">
        <SlideshowUser />
      </div>

      <div className="flex flex-wrap w-[1300px]">
        {bookRender.map((book, key) => (
          <div
            key={key}
            className="group w-[240px] h-[200px] m-[10px] p-[5px] shadow-xl overflow-hidden cursor-pointer"
          >
            <Link to={`/user/home/${book.genre}/${book.name}`}>
              <img src={book.image} className="" alt="" />
              <div className="flex flex-col transition duration-[0.25s] group-hover:translate-y-[-130px] group-hover:text-white">
                <span>{book.name}</span>
                <span>Thể loại: {book.genre}</span>
                <span>Tác giả: {book.author}</span>
                <span>Mô tả: {book.decription}</span>
              </div>

            </Link>
          </div>
        ))}
      </div>
      <div className='mt-[30px]'>
        <PaginationFunc pagination={pagination} handlePageChange={pageChange} />
      </div>
      <div className="w-full h-[300px]"></div>
    </div>
  )
}
