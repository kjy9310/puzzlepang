import { createSlice } from '@reduxjs/toolkit'

export const stats = createSlice({
  name: 'stats',
  initialState: {
    scores:{

    },
    move:0,
    blocks:{
        1:0,
        2:0,
        3:0,
        4:0,
        5:0,
    }
  },
  reducers: {
    setStatBlocks:(state,action) => {
        console.log('setStatBlocks', action)
        state.blocks = action.payload
    }
  }
})

export const { setStatBlocks } = stats.actions

export default stats.reducer