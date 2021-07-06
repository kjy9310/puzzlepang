import { configureStore } from '@reduxjs/toolkit'
import soundReducer from './sound'

export default configureStore({
  reducer: {
    soundControl: soundReducer
  }
})

// export const rootReducer = combineReducers({
//     dashboard: dashboardReducer,
//     user: userReducer
//   });
  
//   export type RootState = ReturnType<typeof rootReducer>
  