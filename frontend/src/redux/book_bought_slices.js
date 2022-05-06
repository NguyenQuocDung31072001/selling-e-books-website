import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    allBookBought:[],
    allBookReview:[]
}

const bookBoughtSlice = createSlice({
  name: 'bookBoughtQuery',
  initialState,
  reducers: {
    getAllBookBought: (state, actions) => {
      state.allBookBought=actions.payload
    },
    getAllBookReview:(state,actions)=>{
      state.allBookReview=actions.payload
    }
  }
})
export const { getAllBookBought,getAllBookReview} = bookBoughtSlice.actions

export default bookBoughtSlice.reducer
