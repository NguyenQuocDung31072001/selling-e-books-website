import {
  registerStart,
  registerSuccess,
  registerFailed,
  loginStart,
  loginSuccess,
  loginFailed,
  updateCurrentUser
} from './auth_slices'
import axios from 'axios'
import {
  addGenre,
  softDeleteUpdate,
  hardDeleteUpdate,
  restoreDeleteUpdate,
  genreError,
  genreLoading,
  initGenresData,
  updateGenreData,
  initDeletedGenresData
} from './genre_slice'
import {
  addAuthor,
  authorError,
  authorLoading,
  hardDeleteAuthorUpdate,
  initAuthorData,
  initDeletedAuthorData,
  restoreDeletedAuthorUpdate,
  softDeleteAuthorUpdate,
  updateAuthorData
} from './author_slice'

const API_URL = 'http://localhost:5000'

export const registerApi = async (user, dispatch) => {
  dispatch(registerStart())
  try {
    const res = await axios.post(
      API_URL + '/v1/selling_e_books/auth/register',
      user
    )
    dispatch(registerSuccess())
  } catch (error) {
    dispatch(registerFailed())
  }
}

export const loginApi = async (user, dispatch, navigate) => {
  dispatch(loginStart())
  try {
    const res = await axios.post(
      API_URL + '/v1/selling_e_books/auth/login',
      user
    )
    dispatch(loginSuccess(res.data))
    if (res.data.role === 'admin') {
      navigate('/admin/home')
    }
    if (res.data.role === 'user') {
      navigate('/user/home')
    }
  } catch (error) {
    dispatch(loginFailed())
  }
}
export const updateAccountAdmin = async (currentUser, account, dispatch) => {
  try {
    const res = await axios.post(
      API_URL + '/v1/selling_e_books/account/setting/' + currentUser._id,
      account,
      {
        headers: { token: currentUser.accessToken }
      }
    )

    const payloadAction = {
      ...currentUser,
      email: res.data.email,
      username: res.data.username,
      password: res.data.password,
      id_avatar: res.data.id_avatar,
      avatar_url: res.data.avatar_url,
      phoneNumber: res.data.phoneNumber,
      birthDate: res.data.birthDate,
      address: res.data.address
    }
    console.log(payloadAction)
    dispatch(updateCurrentUser(payloadAction))
  } catch (error) {
    console.log(error)
  }
}

export const updateAccountPassword = async (currentUser, account, dispatch) => {
  try {
    const res = await axios.post(
      API_URL +
        '/v1/selling_e_books/account/setting/' +
        currentUser._id +
        '/password',
      account,
      {
        headers: { token: currentUser.accessToken }
      }
    )

    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

export const getAllBook = async () => {
  try {
    const res = await axios.get(API_URL + '/v1/selling_e_books/book')
    // console.log(res.data.books)
    return res.data.books
  } catch (error) {
    console.log(error)
  }
}

export const addBook = async new_book => {
  try {
    const res = await axios.post(API_URL + '/v1/selling_e_books/book', new_book)
    console.log(res)
    const payloadAction = {
      name: res.name,
      description: res.description
    }
  } catch (error) {
    console.log(error)
  }
}

//Genre API
export const getAllGenres = async dispatch => {
  try {
    dispatch(genreLoading())
    const res = await axios.get(API_URL + '/v1/selling_e_books/genre')
    dispatch(initGenresData(res.data))
    return res
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const getDeletedGenres = async dispatch => {
  try {
    dispatch(genreLoading())
    const res = await axios.get(API_URL + '/v1/selling_e_books/genre/delete')
    dispatch(initDeletedGenresData(res.data))
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const createNewGenre = async (dispatch, genre) => {
  try {
    dispatch(genreLoading())
    const res = await axios.post(API_URL + '/v1/selling_e_books/genre', genre)
    dispatch(addGenre(res.data))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const updateGenre = async (dispatch, genre) => {
  try {
    dispatch(genreLoading())
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/genre/' + genre._id,
      genre
    )
    dispatch(updateGenreData(res.data))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const softDeleteGenre = async (dispatch, genre) => {
  try {
    dispatch(genreLoading())
    const res = await axios.delete(
      API_URL + '/v1/selling_e_books/genre/' + genre._id
    )
    console.log(res.data)
    dispatch(softDeleteUpdate(genre))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const hardDeleteGenre = async (dispatch, genre) => {
  try {
    const res = await axios.delete(
      API_URL + '/v1/selling_e_books/genre/delete/' + genre._id
    )
    console.log(res.data)
    dispatch(hardDeleteUpdate(genre))
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const restoreDeletedGenre = async (dispatch, genre) => {
  try {
    dispatch(genreLoading())
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/genre/restore/' + genre._id
    )
    console.log(res.data)
    dispatch(restoreDeleteUpdate(genre))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(genreError())
  }
}

export const getAllAuthor = async dispatch => {
  try {
    dispatch(authorLoading())
    const res = await axios.get(API_URL + '/v1/selling_e_books/author')
    dispatch(initAuthorData(res.data))
  } catch (error) {
    console.log(error)
  }
}

export const getDeletedAuthor = async dispatch => {
  try {
    dispatch(authorLoading())
    const res = await axios.get(API_URL + '/v1/selling_e_books/author/delete')
    dispatch(initDeletedAuthorData(res.data))
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const createNewAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    const res = await axios.post(API_URL + '/v1/selling_e_books/author', author)
    dispatch(addAuthor(res.data))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const updateAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    console.log(author)
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/author/' + author._id,
      author
    )
    dispatch(updateAuthorData(res.data))
    return res.data
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const softDeleteAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    const res = await axios.delete(
      API_URL + '/v1/selling_e_books/author/' + author._id
    )
    dispatch(softDeleteAuthorUpdate(res.data))
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const hardDeleteAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    const res = await axios.delete(
      API_URL + '/v1/selling_e_books/author/delete/' + author._id
    )
    console.log(res.data)
    dispatch(hardDeleteAuthorUpdate(author))
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const restoreDeletedAuthor = async (dispatch, author) => {
  try {
    dispatch(authorLoading())
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/author/restore/' + author._id
    )
    console.log(res.data)
    dispatch(restoreDeletedAuthorUpdate(res.data))
  } catch (error) {
    console.log(error)
    dispatch(authorError())
  }
}

export const getBook = async slug => {
  // console.log('slug ',slug)
  try {
    const res = await axios.get(
      API_URL + '/v1/selling_e_books/book/' + slug,
      {}
    )
    console.log(res.data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const getProvinceData = async () => {
  try {
    const res = await axios.get('https://provinces.open-api.vn/api/')
    return res.data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getDistrictData = async province => {
  try {
    const res = await axios.get(
      `https://provinces.open-api.vn/api/p/${province}?depth=2`
    )
    return res.data.districts
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getWardData = async district => {
  try {
    const res = await axios.get(
      `https://provinces.open-api.vn/api/d/${district}?depth=2`
    )
    return res.data.wards
  } catch (error) {
    console.log(error)
    return []
  }
}

//Order manage api
export const getOrders = async (status, page, sorter, filter) => {
  try {
    const queryObj = {}
    if (page) queryObj.page = page
    if (status != null && status != undefined) queryObj.status = status
    if (sorter && sorter.field && sorter.order) {
      const fields = [].concat(sorter.field)
      queryObj.sorterField = fields[0]
      queryObj.sorterOrder = sorter.order == 'ascend' ? 1 : -1
    }
    if (filter && filter.field) {
      queryObj.filterField = filter.field
      queryObj.filterValue = filter.value
    }
    const queryString = new URLSearchParams(queryObj).toString()
    const res = await axios.get(
      API_URL + '/v1/selling_e_books/order?' + queryString
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}

export const updateOrder = async order => {
  try {
    const res = await axios.put(
      API_URL + '/v1/selling_e_books/order/' + order._id,
      order
    )
    return res.data
  } catch (error) {
    console.log(error)
  }
}
