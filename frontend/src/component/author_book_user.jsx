import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAuthorForAddBook } from '../redux/api_request'
import { updateQuery } from '../redux/search_slices'
export default function AuthorBookUser() {
  const [allAuthors, setAllAuthors] = useState([])
  const [theme, setTheme] = useState('')
  const dispatch = useDispatch()
  const searchQuery = useSelector(state => state.search.search)
  useEffect(() => {
    if (searchQuery.type === 'authors') {
      setTheme('bg-sky-500 text-white')
    } else {
      setTheme('')
    }
  }, [searchQuery])
  useEffect(() => {
    const getAllAuthorsFnc = async () => {
      const allAuthor = await getAllAuthorForAddBook()
      const allAuthorName = []
      for (let i = 0; i < allAuthor.length; i++) {
        allAuthorName.push(allAuthor[i].fullName)
      }
      setAllAuthors(allAuthorName)
    }
    getAllAuthorsFnc()
  }, [])

  function dispatchAuthor(authors) {
    let search = {
      query: authors,
      type: 'authors'
    }
    dispatch(updateQuery(search))
  }
  return (
    <div>
      <div className="bg-sky-900 text-white p-4 text-base">Tác giả</div>
      <div className="flex flex-col justify-start w-[260px]">
        {allAuthors.length > 0 &&
          allAuthors.map(
            (author, index) => {
              if (author === searchQuery.query) {
                return (
                  <div
                    key={index}
                    className={`flex justify-start cursor-pointer ${theme} p-2`}
                    onClick={() => dispatchAuthor(author)}
                  >
                    <p>{author}</p>
                  </div>
                )
              } else {
                return (
                  <div
                    key={index}
                    className={`flex justify-start cursor-pointer text-sky-700 p-2`}
                    onClick={() => dispatchAuthor(author)}
                  >
                    <p>{author}</p>
                  </div>
                )
              }
            }

            // (
            //     <div key={index} className='flex justify-start cursor-pointer text-sky-700 p-2'
            //       onClick={()=>dispatchGenres(author)}>
            //         {author}
            //         </div>
            // )
          )}
      </div>
    </div>
  )
}
