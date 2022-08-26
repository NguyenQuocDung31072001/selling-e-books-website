import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllGenresForAddBook,
  getAllAuthorForAddBook
} from '../redux/api_request'
import { Button, Spin, Typography, Select, Input } from 'antd'
import { updateQuery } from '../redux/search_slices'
import { SearchOutlined } from '@ant-design/icons'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import RenderBookComponent from '../component/render_book_component'
import Footer from '../component/footer'
import { useGetAllBook } from '../utils/cacheData'
import { HandleQuerySearch } from '../utils/handleQuerySearch'
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

  const { data, isLoading } = useGetAllBook()

  useEffect(() => {
    setBookData(data)
    setBookRender(data)
    return () => {
      setBookData()
      setBookRender()
    }
  }, [data])

  useEffect(() => {
    let abortController = new AbortController()
    window.scrollTo(0, 0)
    ;(async function () {
      const _allGenre = getAllGenresForAddBook()
      const _allAuthor = getAllAuthorForAddBook()
      Promise.all([_allGenre, _allAuthor]).then(([allGenre, allAuthor]) => {
        const allGenreName = ['']
        for (let i = 0; i < allGenre.length; i++) {
          allGenreName.push(allGenre[i].name)
        }
        const allAuthorName = ['']app
        for (let i = 0; i < allAuthor.length; i++) {
          allAuthorName.push(allAuthor[i].fullName)
        }
        setAllGenres(allGenreName)
        setAllAuthors(allAuthorName)
      })
    })()
    const breadcrum = {
      genre_slug: 'Home Pages',
      genre_name: 'Trang tìm kiếm',
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrum))
    return () => {
      abortController.abort()
      setAllGenres()
      setAllAuthors()
    }
  }, [])

  useEffect(() => {
    let abortController = new AbortController()
    const dataQuery=HandleQuerySearch(querySearch,bookData)
    setBookRender(dataQuery)
    return () => {
      setBookRender()
      abortController.abort()
    }
  }, [bookData, querySearch])

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
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <Spin tip="Loading..." />
          </div>
        )}
        <div className=" md:w-full flex flex-col justify-center items-center mb-10">
          <div>
            <Title level={2}>Tìm kiếm sách</Title>
          </div>
          <div className="w-[100%] md:w-[70%]  md:flex md:justify-between">
            <div className="py-4 md:py-0">
              <Button onClick={allBookFnc}>Tất cả sách</Button>
            </div>
            <div className="pb-4 md:pb-0">
              <Select
                placeholder="Thể loại"
                style={{ width: 230 }}
                onChange={value => setGenresSearch(value)}
              >
                {allGenres?.length > 0 &&
                  allGenres?.map((genres, index) => {
                    return (
                      <Option key={index} value={genres}>
                        {genres}
                      </Option>
                    )
                  })}
              </Select>
            </div>
            <div className="pb-4 md:pb-0">
              <Select
                placeholder="Tác giả"
                style={{ width: 230 }}
                onChange={value => setAuthorsSearch(value)}
              >
                {allAuthors?.length > 0 &&
                  allAuthors?.map((authors, index) => {
                    return (
                      <Option key={index} value={authors}>
                        {authors}
                      </Option>
                    )
                  })}
              </Select>
            </div>
            <div className="pb-4 md:pb-0">
              <Input
                placeholder="Nhập tên sách"
                style={{ width: 230 }}
                prefix={<SearchOutlined />}
                onChange={e => setInputSearch(e.target.value)}
              />
            </div>
            <Button onClick={searchFnc}>Tìm kiếm</Button>
          </div>
        </div>
        <RenderBookComponent books={bookRender} />
      </div>
      <Footer />
    </div>
  )
}
