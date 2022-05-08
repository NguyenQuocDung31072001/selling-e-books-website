import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllBook,
  getAllGenresForAddBook,
  getAllAuthorForAddBook
} from '../redux/api_request'
import { Button, Spin, Typography, Select, Input } from 'antd'
import { updateQuery } from '../redux/search_slices'
import { SearchOutlined } from '@ant-design/icons'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import RenderBookComponent from '../component/render_book_component'
import Footer from '../component/footer'
const { Title } = Typography
const { Option } = Select
export default function CategoryUser() {
  const querySearch = useSelector(state => state.search.search)
  const [bookData, setBookData] = useState([])
  const [bookRender, setBookRender] = useState([])
  const [allGenres, setAllGenres] = useState([])
  const [allAuthors, setAllAuthors] = useState([])
  const [genresSearch, setGenresSearch] = useState('')
  const [authorSearch, setAuthorsSearch] = useState('')
  const [inputSearch, setInputSearch] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0)
    ;(async function () {
      let data = await getAllBook()
      setBookData(data)
      const allGenre = await getAllGenresForAddBook()
      const allGenreName = ['']
      for (let i = 0; i < allGenre.length; i++) {
        allGenreName.push(allGenre[i].name)
      }
      const allAuthor = await getAllAuthorForAddBook()
      const allAuthorName = ['']
      for (let i = 0; i < allAuthor.length; i++) {
        allAuthorName.push(allAuthor[i].fullName)
      }
      setAllGenres(allGenreName)
      setAllAuthors(allAuthorName)
    })()
    const breadcrum = {
      genre_slug: 'Home Pages',
      genre_name: 'Category Pages',
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrum))
    return () => {
      setBookData()
      setAllGenres()
      setAllAuthors()
    }
  }, [])

  useEffect(() => {
    if (bookData.length > 0) {
      setBookRender(bookData)
    }
    return () => {
      setBookRender()
    }
  }, [bookData])

  useEffect(() => {
    let dataQuery
    if (querySearch.type === 'name') {
      dataQuery = bookData?.filter(
        book =>
          book.name.toLowerCase().includes(querySearch.query.name) &&
          book.name.includes(querySearch.query.name)
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
    if (querySearch.type === 'all') {
      dataQuery = bookData
    }
    setBookRender(dataQuery)
    return () => {
      setBookRender()
    }
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
  const allBookFnc = () => {
    let search = {
      query: {},
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
              {allGenres?.length > 0 &&
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
              {allAuthors?.length > 0 &&
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
        <RenderBookComponent books={bookRender} />
      </div>
      <Footer />
    </div>
  )
}
