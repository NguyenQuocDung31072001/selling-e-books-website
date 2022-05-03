import { Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllGenresForAddBook } from '../redux/api_request'
import { updateQuery } from '../redux/search_slices'
const { Title } = Typography
export default function GenreBookUser() {
  const [allGenres, setAllGenres] = useState([])
  const [theme, setTheme] = useState('')
  const dispatch = useDispatch()
  const searchQuery = useSelector(state => state.search.search)
  useEffect(() => {
    if (searchQuery.type === 'genres') {
      setTheme('bg-sky-500 text-white')
    } else {
      setTheme('')
    }
  }, [searchQuery])
  useEffect(() => {
    const getAllGenresFnc = async () => {
      const allGenre = await getAllGenresForAddBook()
      const allGenreName = []
      for (let i = 0; i < allGenre.length; i++) {
        allGenreName.push(allGenre[i].name)
      }
      setAllGenres(allGenreName)
    }
    getAllGenresFnc()
  }, [])
  useEffect(() => {
    console.log(allGenres)
  }, [allGenres])

  function dispatchGenres(genres) {
    let search = {
      query: genres,
      type: 'genres'
    }
    dispatch(updateQuery(search))
  }
  return (
    <div>
      <div className="bg-sky-900 text-white p-4 text-base">Thể loại sách</div>
      <div className="flex flex-col justify-start w-[260px]">
        {allGenres.length > 0 &&
          allGenres.map((genres, index) => {
            if (genres === searchQuery.query) {
              return <div
                key={index}
                className={`flex justify-start cursor-pointer ${theme} p-2`}
                onClick={() => dispatchGenres(genres)}
              >
                <p>{genres}</p>
              </div>
            } else {
              return <div
                key={index}
                className={`flex justify-start cursor-pointer text-sky-700 p-2`}
                onClick={() => dispatchGenres(genres)}
              >
                <p>{genres}</p>
              </div>
            }
          })}
      </div>
    </div>
  )
}
