import { createSlice } from '@reduxjs/toolkit'

export const stats = createSlice({
  name: 'stats',
  initialState: {
    scores:{
      enemyLife: 1000,
      hamLife: 5,
      roundScore: 0
    },
    move:5,
    blocks:{
        1:0,
        2:0,
        3:0,
        4:0,
        5:0,
    },
    useSkill: false
  },
  reducers: {
    setStatBlocks:(state,action) => {
        console.log('setStatBlocks', action)
        state.blocks = action.payload
    },
    addMove:(state, action)=>{
      console.log('setMove', action)
      state.move += action.payload
    },
    attackEnemy: (state, action) =>{
      console.log('setScores', action)
      state.scores.enemyLife -= action.payload
    },
    addLife: (state, action)=>{
      console.log('addLife', action)
      state.scores.hamLife += action.payload
    },
    setSkill: (state, action)=>{
      console.log('addLife', action)
      state.useSkill = action.payload
    }
  },
})

export const { setStatBlocks, addMove, attackEnemy, addLife, setSkill } = stats.actions

export default stats.reducer