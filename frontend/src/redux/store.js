import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './auth_slices'
import breadcrumbReducer from './breadcrumb_slices'
import genreReducer from './genre_slice'
import searchReducer from "./search_slices"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authorReducer from './author_slice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage
}
const rootReducer = combineReducers({
  auth: authReducer,
  breadcrumb: breadcrumbReducer,
  genre: genreReducer,
  author: authorReducer,
  search:searchReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export let persistor = persistStore(store)
