import React, { useEffect,useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { Typography } from 'antd'
import { getBook } from '../redux/api_request'
const { Title } = Typography

function DetailBookUser() {
  const { genre, slug } = useParams()
  const dispatch = useDispatch()
  const [book,setBook]=useState()
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
  const getBookFnc=async(slug)=>{
    let bookApi=await getBook(slug)
    console.log(bookApi)
    setBook(bookApi)
  } 
  return (
    <div>
      <div className="m-auto w-[1200px] h-[500px] border-2 border-solid flex">
        <div className="w-[400px] h-[500px] border-2 border-solid flex items-center">
          <img
            className="w-full object-cover "
            src="https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b3BlbiUyMGJvb2t8ZW58MHx8MHx8&w=1000&q=80"
            alt=""
          />
        </div>
        <div className="w-[800px] flex flex-col items-center">
          <div className="w-full flex justify-center">
            <Title level={2}>Hoa vàng trên cỏ xanh</Title>
          </div>
          <div className="w-[600px] flex items-center justify-between">
            <div>
              <Title level={4}>Tác giả:Nam cao</Title>
            </div>
            <div>
              <Title level={4}>Thể loại:Truyện tranh</Title>
            </div>
          </div>
          <div className="w-[500px] mt-[20px] flex ">
            <Title level={1}>13.000d</Title>
          </div>
        </div>
      </div>
      <div className='w-screen flex flex-col items-center'>
        <div className='w-[1200px] flex justify-between'>
          <div>
            <Title level={4}>Nhà sản xuất:Kim đồng</Title>
          </div>
          <div>
            <Title level={4}>Ngày xuất bản:13-02-2019</Title>
          </div>
        </div>
        <div className='w-[1200px] h-[100px] flex flex-col items-start'>
          <Title level={4}>Mô tả </Title>
          <p className='text-[16px]'>sách hay ....</p>
        </div>
      </div>
    </div>
  )
}

export default DetailBookUser
