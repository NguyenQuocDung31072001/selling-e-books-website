import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allBook:[]
}

const bookBoughtSlice = createSlice({
  name: 'bookBoughtQuery',
  initialState,
  reducers: {
    getAllBookBought: (state, actions) => {
      state.allBook=actions.payload
    }
  }
})
export const { getAllBookBought } = bookBoughtSlice.actions

export default bookBoughtSlice.reducer
