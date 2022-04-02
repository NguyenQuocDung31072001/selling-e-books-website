import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { Typography, Rate, Progress, Button } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import { getBook } from '../redux/api_request'
const { Title } = Typography

function DetailBookUser() {
  const { genre, slug } = useParams()
  const dispatch = useDispatch()
  const [book, setBook] = useState()
  // console.log(genre,slug)
  // từ id_book lấy ra name_book rồi bỏ vào breadcrumb @@
  useEffect(() => {
    const breadcrum = {
      genre: genre,
      name_book: slug
    }
    dispatch(updateBreadcrumb(breadcrum))
    getBookFnc(slug)
  }, [])
  // useEffect(()=>{
  //   console.log(book?._id)
  // },[book])
  const getBookFnc = async slug => {
    let bookApi = await getBook(slug)
    setBook(bookApi)
  }
  return (
    <div className="h-[1400px]">
      <div className="m-auto w-[1200px] h-[500px]  flex">
        <div className="w-[400px] h-[500px] flex items-center">
          <img className="w-full object-cover " src={book?.coverUrl} alt="" />
        </div>
        <div className="w-[800px] flex flex-col items-center">
          <div className="w-full flex justify-center">
            <Title level={2}>{book?.name}</Title>
          </div>
          <div className="w-[600px] flex items-center justify-between">
            <div>
              <Title level={4}>Tác giả:{book?.authors[0]}</Title>
            </div>
            <div>
              <Title level={4}>Thể loại:{book?.genres[0]?.name}</Title>
            </div>
          </div>
          <div className="w-[500px] mt-[20px] flex ">
            <Title level={1}>{book?.price}đ</Title>
          </div>
          <div>
            <span>Kí túc xá, thành phố thủ đức</span>
            <Link to="/user/setting">Đổi địa chỉ</Link>
          </div>
          <div>
            <Button>Mua sách</Button>
          </div>
        </div>
      </div>
      <div className="w-screen flex flex-col items-center">
        <div className="w-[1200px] flex justify-between">
          <div>
            <Title level={4}>Nhà sản xuất:{book?.publishedBy}</Title>
          </div>
          <div>
            <Title level={4}>
              Ngày xuất bản:{book?.publishedDate?.split('T')[0]}
            </Title>
          </div>
        </div>
        <div className="w-[1200px] h-[100px] flex flex-col items-start">
          <Title level={4}>Mô tả </Title>
          <p className="text-[16px]">{book?.description}</p>
        </div>
      </div>
      <div className="flex ml-[60px]">
        <div className="w-[500px]">
          <Title level={4}>Đánh giá- Nhận xét từ khách hàng</Title>
          <div className="ml-[100px]">
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
      <div className="flex flex-col w-[1200px] m-auto mt-[50px]">
        <div className="flex">
          <div className="w-[350px] flex">
            <img className="w-[50px] h-[50px] rounded-[50px] " src="https://res.cloudinary.com/dwrg88vkg/image/upload/v1647597016/mni8r7ibwvam4muh3uea.jpg" alt="" />
            <div className="flex flex-col">
              <Title level={4}>Nguyễn Quốc Dũng</Title>
              <p>Đã mua hàng ngày 13-02-2021</p>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className="flex items-center">
              <Rate style={{ fontSize: 15 }} disabled defaultValue={4} />
              <span>Hài lòng</span>
            </div>
            <div className=" flex items-center text-emerald-500">
              <CheckCircleFilled />
              <span>Đã mua hàng</span>
            </div>
            <div className='flex'>
              <p>sản phẩm quá tốt!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailBookUser
