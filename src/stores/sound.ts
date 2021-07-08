import { createSlice } from '@reduxjs/toolkit'
import sounds from '../sound'

export const soundControl = createSlice({
  name: 'soundControl',
  initialState: {
    soundOn: true,
    bgm: "myang"
  },
  reducers: {
    toggle: state => {
      // Sounds.Myang.volume = 0.5;
      state.soundOn = !state.soundOn
      if (!state.soundOn){
        Object.keys(sounds).forEach((soundKey)=>{
          if(!sounds[soundKey].paused){
            sounds[soundKey].pause()
          } 
        })
      } else{
        sounds[state.bgm].play()
      }
    },
    playSound: (state,action) => {
      if(state.soundOn){
        if (sounds[action.payload]){
          sounds[action.payload].play()
        } else{
          console.log('ERROR!!! no sound name :', action.payload)
        }
      }
    }
    // functionWithParam:(state, action) => {
    //   state.value += action.payload
    // }
  }
})

export const { toggle, playSound } = soundControl.actions

export default soundControl.reducer