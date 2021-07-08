
require('/sounds/Coins.mp3')
require('/sounds/Woodpecker.mp3')
require('/sounds/Wakeup.mp3')
require('/sounds/Myang.mp3')
require('/sounds/Gameover.mp3')
require('/sounds/Pop.mp3')
require('/sounds/Sibal-1740.mp3')
require('/sounds/Appayo-2564.mp3')

const loadSounds = ()=>{
    const coins = new Audio('/sounds/Coins.mp3')
    const pop = new Audio('/sounds/Pop.mp3')
    const woodpecker = new Audio('/sounds/Woodpecker.mp3')
    const wakeup = new Audio('/sounds/Wakeup.mp3')
    const myang = new Audio('/sounds/Myang.mp3')
    const gameover = new Audio('/sounds/Gameover.mp3')
    const sibal = new Audio('/sounds/Sibal-1740.mp3')
    const appayo = new Audio('/sounds/Appayo-2564.mp3')
    myang.addEventListener('timeupdate', function(){
        var buffer = .33
        if(this.currentTime > this.duration - buffer){
            this.currentTime = 0
            this.play()
        }
    })
    return {
        myang,
        coins,
        pop,
        woodpecker,
        wakeup,
        gameover,
        sibal,
        appayo
    }
}
const sounds = loadSounds()
// window.loadSounds=loadSounds
export default sounds