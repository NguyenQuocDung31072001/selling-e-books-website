import { useQuery } from 'react-query'
import { getAllBook, getTopBook } from '../redux/api_request';
export function useGetAllBook() {

    const response= useQuery('getAllBook', getAllBook, {
        cacheTime: Infinity,
        refetchOnWindowFocus: true,
        staleTime:20000
      })

  return response;
}
export function useGetTopBookRating() {

    const response= useQuery('getTopBookRating',()=> getTopBook(10, 'rating'), {
        cacheTime: Infinity,
        refetchOnWindowFocus: true,
        staleTime:20000
      })
  return response;
}
