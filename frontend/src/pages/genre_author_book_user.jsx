import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { getBookOfGenres,getBookOfAuthors } from '../redux/api_request'
import BreadcrumbsUser from '../component/breadcrumbs_user'
import { PATH_NAME } from '../config/pathName'
function GenresAuthorsBookUser() {
  const { slug } = useParams()
  const [book, setBook] = useState([])
  const [nameSlug, setNameSlug] = useState()
  const dispatch = useDispatch()
  useEffect(() => {
    ;(async function () {
      let bookData=''
      bookData =await getBookOfGenres(slug)      
      if(!bookData){
        bookData =await getBookOfAuthors(slug)
        console.log('book of author',bookData)
        setBook(bookData.books)
        setNameSlug(bookData.author.fullName)
        return
      }
      console.log('book of genres',bookData)
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
  return (
    <div className="flex flex-col items-center">
      <div className="flex p-[18px] w-[88%] bg-white">
        {  book.map((book, key) => (
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
        ))}
      </div>
    </div>
  )
}

export default GenresAuthorsBookUser
