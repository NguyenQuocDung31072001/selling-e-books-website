import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginFailed } from '../redux/auth_slices'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import PaginationFunc from "../component/pagination"
import {_book} from "../data/book"

const book = _book

export default function HomePagesUser() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [bookRender,setBookRender]=useState([])
  const [pagination,setPagination]=useState({
    page:1,
    limit:30,
    total:book.length
  })

  const pageChange=(e,newPage)=>{
    setPagination({
      ...pagination,
      page:newPage
    })
  }
  useEffect(()=>{
    let _page=pagination.page
    let _limit=pagination.limit
    let _length=book.length

    let _bookRender=[]

    if(_length<=_page*_limit){
      _bookRender=book.slice((_page-1)*_limit,_length)
    }
    else{
      _bookRender=book.slice((_page-1)*_limit,_page*_limit)
    }
    setBookRender(_bookRender)
  },[pagination])

  useEffect(() => {
    const breadcrumb = { genre: '', name_book: '' }
    dispatch(updateBreadcrumb(breadcrumb))
  }, [])

  useEffect(() => {
    if (currentUser?.role !== 'user') {
      dispatch(loginFailed())
      navigate('/login')
    }
  }, [currentUser])


  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='w-full h-[200px]'>

      </div>
      <div className="flex flex-wrap w-[1350px]">
        {bookRender.map((book, key) => (
          <div key={key} className="w-[250px] mx-[10px] my-[20px]">
            <img src={book} className="w-full" alt="" />
          </div>
        ))}
      </div>
      <div>
        <PaginationFunc pagination={pagination} handlePageChange={pageChange}/>
      </div>
      <div className='w-full h-[300px]'>

      </div>
    </div>
  )
}
