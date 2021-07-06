import { createSlice } from '@reduxjs/toolkit'
import sounds from '../sound'

export const soundControl = createSlice({
  name: 'soundControl',
  initialState: {
    value: true
  },
  reducers: {
    toggle: state => {
      state.value = !state.value
      console.log('toggle sound dispatched! new value: ',state.value)
    },
    // functionWithParam:(state, action) => {
    //   state.value += action.payload
    // }
  }
})

export const { toggle } = soundControl.actions

export default soundControl.reducer