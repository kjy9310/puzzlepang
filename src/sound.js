
require('/sounds/Coins.mp3')
require('/sounds/Woodpecker.mp3')
require('/sounds/Wakeup.mp3')
require('/sounds/Myang.mp3')
require('/sounds/Gameover.mp3')
require('/sounds/Pop.mp3')
require('/sounds/Sibal-1740.mp3')
require('/sounds/Appayo-2564.mp3')

const loadSounds = ()=>{
    const Coins = new Audio('/sounds/Coins.mp3')
    const Pop = new Audio('/sounds/Pop.mp3')
    const Woodpecker = new Audio('/sounds/Woodpecker.mp3')
    const Wakeup = new Audio('/sounds/Wakeup.mp3')
    const Myang = new Audio('/sounds/Myang.mp3')
    const Gameover = new Audio('/sounds/Gameover.mp3')
    const Sibal = new Audio('/sounds/Sibal-1740.mp3')
    const Appayo = new Audio('/sounds/Appayo-2564.mp3')
    Myang.addEventListener('timeupdate', function(){
        var buffer = .33
        if(this.currentTime > this.duration - buffer){
            this.currentTime = 0
            this.play()
        }
    })
    return {
        Myang,
        Coins,
        Pop,
        Woodpecker,
        Wakeup,
        Gameover,
        Sibal,
        Appayo
    }
}
const sounds = loadSounds()
export default sounds