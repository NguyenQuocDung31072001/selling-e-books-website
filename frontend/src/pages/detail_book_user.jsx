import logoFooter from '../logo_footer.svg'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import {
  Typography,
  Rate,
  Progress,
  Button,
  notification,
  Spin,
  Input
} from 'antd'
import { CheckCircleFilled, ConsoleSqlOutlined } from '@ant-design/icons'
import { getBook, addBookToCart, postNewReview } from '../redux/api_request'
import BreadcrumbsUser from '../component/breadcrumbs_user'
import { numberFormat } from '../utils/formatNumber'
import { PATH_NAME } from '../config/pathName'

const { Title } = Typography
const { TextArea } = Input
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']
function DetailBookUser() {
  const { genre, slug } = useParams()
  const dispatch = useDispatch()
  const [book, setBook] = useState()
  const [loading, setLoading] = useState(false)
  const [valueRate, setValueRate] = useState(1)
  const [content, setContent] = useState('')
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const allBookBought = useSelector(state => state.bookBought.allBook)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const getBookFnc = async slug => {
      let bookApi = await getBook(slug)
      setBook(bookApi)
      setLoading(false)
    }
    getBookFnc(slug)
  }, [])

  useEffect(() => {
    const breadcrum = {
      genre_slug: genre,
      genre_name: book?.genres[0].name,
      name_book: slug
    }
    dispatch(updateBreadcrumb(breadcrum))
    // console.log(book)
  }, [book])

  const buyBookFnc = () => {
    const id_book = book._id
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
      className: 'bg-green-500',
      style: {
        width: 400
      },
      onClick: () => {
        navigate('/user/cart')
      }
    })
  }
  const onChangeValueRate = e => {
    setValueRate(e)
  }
  const onChangeContent = e => {
    // console.log(e.currentTarget.value)
    setContent(e.currentTarget.value)
  }
  const newReview = async () => {
    await postNewReview(currentUser._id, book._id, valueRate, content)
  }
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="mt-[10px] w-[90%] bg-white shadow-md shadow-zinc-200 flex flex-col pb-4 relative">
        {loading && (
          <div className="fixed w-screen h-screen z-10">
            <Spin tip="Loading..." />
          </div>
        )}
        <div className="w-full h-[75px] border-b-[1px] border-solid border-gray-300 mb-8 flex items-center justify-start p-4">
          <h1 className="text-xl">Thông tin sách</h1>
        </div>
        <div className="flex">
          <div className="w-[500px] h-[600px] px-[20px] flex items-center justify-center shadow-md shadow-zinc-200">
            <img
              className="w-full h-full object-cover "
              src={book?.coverUrl}
              alt=""
            />
          </div>
          <div className=" flex flex-col items-start px-4">
            <div className="">
              <Title level={1}>{book?.name}</Title>
            </div>

            <div>
              <Title level={4}>
                <span className="text-green-500">Tác giả: </span>
                {book?.authors[0]?.fullName}
              </Title>
            </div>
            <div>
              <Title level={4}>
                <span className="text-green-500">Thể loại: </span>
                {book?.genres[0]?.name}
              </Title>
            </div>

            <div className="mt-[20px] flex ">
              <Title level={1}>{numberFormat(book?.price)}</Title>
            </div>
            <div className="mb-4 flex items-center ">
              <Rate
                allowHalf
                disabled
                defaultValue={2.5}
                style={{ fontSize: 25 }}
              />
              <span className="mx-4 text-lg font-normal">3 đánh giá</span>
              <span className="text-lg font-normal">5 người mua</span>
            </div>

            <div className="py-4">
              <span className="text-2xl text-gray-800">Nhà sản xuất:</span>
              <span className="text-2xl text-gray-500">
                {' '}
                {book?.publishedBy}
              </span>
            </div>
            <div>
              <p className="text-2xl text-gray-500">
                {' '}
                Ngày xuất bản: {book?.publishedDate?.split('T')[0]}
              </p>
            </div>

            <div className="w-[80%] flex flex-col items-start">
              <Title level={4}>Mô tả </Title>
              <p className="text-[16px]">{book?.description}</p>
            </div>
            <div className="absolute bottom-5 right-20">
              <button
                onClick={buyBookFnc}
                className="hover:bg-green-500 hover:text-white bg-[#fafafa] text-green-600 border-[1px] border-solid border-green-500 px-3 py-2 rounded-md duration-700"
              >
                Mua sách
              </button>
            </div>
          </div>
        </div>
      </div>
      {allBookBought.includes(book?._id) && (
        <div className="mt-4 p-4 w-[90%] bg-white py-4 border-b-[1px] border-solid border-gray-300">
          <div className="w-full flex justify-start border-b-[1px] border-solid border-gray-300">
            <span className="text-xl font-medium">Đánh giá sản phẩm</span>
            <span className="pl-[100px]">
              <Rate
                tooltips={desc}
                onChange={onChangeValueRate}
                value={valueRate}
              />
              {valueRate ? (
                <span className="ml-4 text-xl font-normal">
                  {desc[valueRate - 1]}
                </span>
              ) : (
                ''
              )}
            </span>
          </div>
          <div>
            <div className="flex justify-start border-b-[1px] border-solid border-gray-300 mt-4 ">
              <p className="text-xl font-medium">Nhận xét</p>
            </div>
            <div className="flex p-4">
              <img
                className="w-[50px] h-[50px] object-cover rounded-[50px] mr-4"
                src={currentUser?.avatar_url}
                alt=""
              />
              <TextArea
                rows={4}
                placeholder="maxLength is 100"
                maxLength={100}
                onChange={onChangeContent}
              />
            </div>
            <div className="w-full flex justify-end px-4">
              <button
                className="bg-sky-500 px-4 py-2 rounded-sm text-white"
                onClick={newReview}
              >
                Nhận xét
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-col w-[90%] bg-white py-8 mb-10">
        <div className="flex justify-start px-4 border-b-[1px] border-solid border-gray-300">
          <p className="text-xl font-medium">Tất cả nhận xét</p>
        </div>
        <div className="flex mt-4">
          <div className="w-[350px] flex ml-[50px]">
            <img
              className="w-[50px] h-[50px] rounded-[50px] object-cover"
              src={currentUser?.avatar_url}
              alt=""
            />
            <div className="flex flex-col">
              <Title level={4}>Nguyễn Quốc Dũng</Title>
              <p>Đã mua hàng ngày 13-02-2021</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Rate style={{ fontSize: 15 }} disabled defaultValue={4} />
              <span>Hài lòng</span>
            </div>
            <div className=" flex items-center text-emerald-500">
              <CheckCircleFilled />
              <span>Đã mua hàng</span>
            </div>
            <div className="flex">
              <p>sản phẩm quá tốt!</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-[50px] h-[200px] bg-black flex justify-around items-center">
        <div>
          <img
            className="w-[200px] h-[200px] object-cover"
            src={logoFooter}
            alt=""
          />
        </div>
        <div className="">
          <h1 className="text-white">Nguyễn Quốc Dũng</h1>
        </div>
        <div className="text-white">
          <h1 className="text-white">Trần Lương Ngyên</h1>
        </div>
      </div>
    </div>
  )
}

export default DetailBookUser
