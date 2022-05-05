import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { Typography, Rate, Progress, Button, notification, Spin } from 'antd'
import { CheckCircleFilled, ConsoleSqlOutlined } from '@ant-design/icons'
import { getBook, addBookToCart } from '../redux/api_request'
import BreadcrumbsUser from '../component/breadcrumbs_user'
import { numberFormat } from '../utils/formatNumber'
import { PATH_NAME } from '../config/pathName'

const { Title } = Typography

function DetailBookUser() {
  const { genre, slug } = useParams()
  const dispatch = useDispatch()
  const [book, setBook] = useState()
  const [loading, setLoading] = useState(false)
  const currentUser = useSelector(state => state.auth.login.currentUser)
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
            <div className="mb-4">
              <Rate
                allowHalf
                disabled
                defaultValue={2.5}
                style={{ fontSize: 25 }}
              />
            </div>

            <div className='py-4'>
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
              {/* <Button onClick={buyBookFnc}></Button> */}
              <button 
                onClick={buyBookFnc}
                className="hover:bg-green-500 hover:text-white bg-[#fafafa] text-green-600 border-[1px] border-solid border-green-500 px-3 py-2 rounded-md duration-700">
                Mua sách
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[90%] bg-white py-8 flex">
        <div className="w-[40%]">
          <Title level={4}>Đánh giá- Nhận xét từ khách hàng</Title>
          <div className="ml-[50px]">
            <div className="flex ml-[80px] ">
              <Title level={1}>5</Title>
              <div className="flex flex-col">
                <Rate disabled defaultValue={5} />
                <span>15 nhận xét</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center w-[350px] h-[20px]">
                <Rate style={{ fontSize: 13 }} disabled defaultValue={5} />
                <Progress
                  style={{ width: 170, marginLeft: 10 }}
                  strokeColor="#656060"
                  percent={50}
                  size="small"
                  showInfo={false}
                />
                <Title style={{ marginLeft: 10, marginTop: 10 }} level={5}>
                  50
                </Title>
              </div>
              <div className="flex items-center w-[350px] h-[20px]">
                <Rate style={{ fontSize: 13 }} disabled defaultValue={4} />
                <Progress
                  style={{ width: 170, marginLeft: 10 }}
                  strokeColor="#656060"
                  percent={80}
                  size="small"
                  showInfo={false}
                />
                <Title style={{ marginLeft: 10, marginTop: 10 }} level={5}>
                  80
                </Title>
              </div>
              <div className="flex items-center w-[350px] h-[20px]">
                <Rate style={{ fontSize: 13 }} disabled defaultValue={3} />
                <Progress
                  style={{ width: 170, marginLeft: 10 }}
                  strokeColor="#656060"
                  percent={40}
                  size="small"
                  showInfo={false}
                />
                <Title style={{ marginLeft: 10, marginTop: 10 }} level={5}>
                  40
                </Title>
              </div>
              <div className="flex items-center w-[350px] h-[20px]">
                <Rate style={{ fontSize: 13 }} disabled defaultValue={2} />
                <Progress
                  style={{ width: 170, marginLeft: 10 }}
                  strokeColor="#656060"
                  percent={0}
                  size="small"
                  showInfo={false}
                />
                <Title style={{ marginLeft: 10, marginTop: 10 }} level={5}>
                  0
                </Title>
              </div>
              <div className="flex items-center w-[350px] h-[20px]">
                <Rate style={{ fontSize: 13 }} disabled defaultValue={1} />
                <Progress
                  style={{ width: 170, marginLeft: 10 }}
                  strokeColor="#656060"
                  percent={10}
                  size="small"
                  showInfo={false}
                />
                <Title style={{ marginLeft: 10, marginTop: 10 }} level={5}>
                  10
                </Title>
              </div>
            </div>
          </div>
        </div>
        <div>Tìm kiếm theo đánh giá</div>
      </div>
      <div className="flex flex-col w-[90%] bg-white py-8 mb-10">
        <div className="flex">
          <div className="w-[350px] flex ml-[50px]">
            <img
              className="w-[50px] h-[50px] rounded-[50px] "
              src="https://res.cloudinary.com/dwrg88vkg/image/upload/v1647597016/mni8r7ibwvam4muh3uea.jpg"
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
    </div>
  )
}

export default DetailBookUser
