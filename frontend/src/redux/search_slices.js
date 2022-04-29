import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  query: ''
}

const searchSlice = createSlice({
  name: 'searchQuery',
  initialState,
  reducers: {
    updateQuery: (state, actions) => {
      state.query=actions.payload
    }
  }
})
export const { updateQuery } = searchSlice.actions

export default searchSlice.reducer
