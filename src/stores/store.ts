import { configureStore } from '@reduxjs/toolkit'
import soundReducer from './sound'
import stats from './stats'

export default configureStore({
  reducer: {
    soundControl: soundReducer,
    stats
  }
})

// export const rootReducer = combineReducers({
//     dashboard: dashboardReducer,
//     user: userReducer
//   });
  
//   export type RootState = ReturnType<typeof rootReducer>
  