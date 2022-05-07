import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import {
  getBookOfGenres,
  getBookOfAuthors,
  addBookToCart
} from '../redux/api_request'
import BreadcrumbsUser from '../component/breadcrumbs_user'
import { PATH_NAME } from '../config/pathName'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { numberFormat } from '../utils/formatNumber'
import { notification, Rate, Typography } from 'antd'
const { Title } = Typography
function GenresAuthorsBookUser() {
  const { slug } = useParams()
  const [book, setBook] = useState([])
  const [nameSlug, setNameSlug] = useState()
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const navigate = useNavigate()
  useEffect(() => {
    ;(async function () {
      let bookData = ''
      bookData = await getBookOfGenres(slug)
      if (!bookData) {
        bookData = await getBookOfAuthors(slug)
        console.log('book of author', bookData)
        setBook(bookData.books)
        setNameSlug(bookData.author.fullName)
        return
      }
      console.log('book of genres', bookData)
      setBook(bookData.books)
      setNameSlug(bookData.genre.name)
    })()
  }, [])

  useEffect(() => {
    const breadcrumb = {
      genre_slug: slug,
      genre_name: nameSlug,
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrumb))
  }, [nameSlug])
  const buyBookFnc = idOfBook => {
    const id_book = idOfBook
    const id_account = currentUser._id
    const data = {
      book: id_book,
      account: id_account
    }
    addBookToCart(data)
    openNotification()
  }
  const openNotification = () => {
    notification.open({
      message: 'Đã thêm vào giỏ hàng!',
      description: 'Sách đã được thêm vào giỏ hàng. Click để xem chi tiết!',
      style: {
        width: 400
      },
      onClick: () => {
        navigate('/user/cart')
      }
    })
  }
  return (
    <div className="flex flex-col items-center">
      <div className="flex p-[18px] w-[88%] bg-white">
        <div className="flex flex-wrap bg-white h-fit w-[97%]">
          {book.map(
            (
              book,
              key //bookRender là sách sau khi xữ lý xong (sau khi chia pagination, sau khi tìm kiếm) và hiển thị cho user
            ) => (
              <div
                key={key}
                className="group w-[260px] h-[182px] m-4 p-2  flex flex-col items-center justify-center  overflow-hidden "
              >
                <div className="w-full h-full flex ">
                  <div className=" w-[130px] h-[182px] mr-2 relative ">
                    <img
                      src={book.coverUrl}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <div className="w-full h-full duration-[0.5s] flex items-center justify-center absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 group-hover:bg-[#00000090] ">
                      <div>
                        <Link
                          to={`${PATH_NAME.USER_HOME_PAGE}/${book.genres[0]?.slug}/${book.slug}`}
                          className="cursor-pointer"
                        >
                          <div className="">
                            <button className="hover:bg-green-500 hover:text-white bg-[#fafafa] text-green-600 border-none px-3 py-2 rounded-md duration-700">
                              Xem sách
                            </button>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-[130px] text-black">
                    <Title level={5}>{book.name}</Title>
                    <span>{book.authors[0]?.fullName}</span>
                    <Rate
                      allowHalf
                      disabled
                      defaultValue={book.rating}
                      style={{ fontSize: 12 }}
                    />
                    <div className="">
                      <p className="text-lg font-bold">
                        {numberFormat(book.price)}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-4">
                      <ShoppingCartOutlined
                        style={{ color: '#27ae60', fontSize: 30 }}
                        onClick={() => buyBookFnc(book._id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {/* {  book.map((book, key) => (
          <div
            key={key}
            className="group w-[240px] h-[290px] m-[10px] p-[5px] shadow-xl overflow-hidden cursor-pointer shadow-neutral-400"
          >
            <Link
              to={`${PATH_NAME.GENRES_BOOK_USER}/${book.genres[0]?.slug}/${book.slug}`}
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
        ))} */}
      </div>
    </div>
  )
}

export default GenresAuthorsBookUser
