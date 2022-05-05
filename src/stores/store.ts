import { configureStore, combineReducers } from '@reduxjs/toolkit'
import soundReducer from './sound'
import stats from './stats'

export default configureStore({
  reducer: {
    soundControl: soundReducer,
    stats
  }
})

export const rootReducer = combineReducers({
  soundControl: soundReducer,
  stats
});
  
export type RootState = ReturnType<typeof rootReducer>
  