import { ConvertViToEn } from "./convertViToEn"

export function HandleQuerySearch(querySearch,bookData){

    let dataQuery = ''
    let querySeachName = ' '
    if (querySearch.query.name) {
      querySeachName = ConvertViToEn(querySearch.query.name.toLowerCase())
    }
    if (querySearch.type === 'name') {
      dataQuery = bookData?.filter(book =>
        ConvertViToEn(book.name.toLowerCase()).includes(querySeachName)
      )
    }
    if (querySearch.type === 'many') {
      dataQuery = bookData?.filter(
        book =>
          book.genres[0]?.name.includes(querySearch.query.genres) &&
          book.authors[0]?.fullName.includes(querySearch.query.authors) &&
          ConvertViToEn(book.name.toLowerCase()).includes(querySeachName)
      )
    }
    if (querySearch.type === 'all') {
      dataQuery = bookData
    }
    return dataQuery
    
}