import * as React from "react";
import * as Phaser from 'phaser';
import { useSelector, useDispatch } from 'react-redux'
import { playSound } from '../stores/sound'
import { addLife, addMove } from '../stores/stats'

// import type { RootState } from '../stores/store'
import store from '../stores/store'
// import { connect } from 'react-redux'

// import MainScene from './defense-scene'
// import PreloadScene from './scenes/preloadScene'
// declare module '*.png';
// import * as imageOh from '../../images/oh.png'//'/images/oh.png'
// import * as imageHamface from '/images/hamface.png'

const imageOh = require('/images/oh.png').default
const imageHamface = require('/images/hamface.png').default
const poop = require('/images/poop.png').default
const hamMain = require('/images/hammain.png').default
const baseWidth = 360

// export const DEFAULT_WIDTH = 1280
// export const DEFAULT_HEIGHT = 720
class ReadyScene extends Phaser.Scene{
	create(){
		// this.add.text(10, 10, 'Loading...', { font: '16px Courier' });
	}

}
class DefenseScene extends Phaser.Scene
{
	dispatch
	numToLoad
	sprites
	constructor(){
		super({
			key:'DefenseScene'
		})
		this.sprites = [];
	}

    init(data)
	{
		console.log('init', data)
		this.dispatch = data.dispatch
		
	}

    preload ()
    {
		// console.log('imageOh', imageOh)
        // this.load.image('bullet', imageOh);
		// this.load.image('cannon', '/images/hamface.png');
		// this.load.image('imageHamface', '/images/hamface.png');
		this.numToLoad = 4
		this.textures.on('addtexture', () => {
			console.log('another image loaded :', this.numToLoad--)
			if (this.numToLoad < 1) this.createNext();
		})
		this.textures.addBase64('imageOh', imageOh);
		this.textures.addBase64('hamMain', hamMain);
		this.textures.addBase64('poop', poop);
		this.textures.addBase64('imageHamface', imageHamface);
		
		const currentState = store.getState()
		enemyLife = this.add.text(10, 0, 'Enemy : '+currentState.stats.scores.enemyLife , { font: '16px Courier' });
		hamLife = this.add.text(250, 0, 'Life : '+currentState.stats.scores.hamLife , { font: '16px Courier' });
    }
	createNext(){
		console.log('createNext called')
		const poopStarting = this.add.image(15, 50, 'poop')
		poopStarting.setScale(1.2)
		const hamMain = this.add.image(320, 50, 'hamMain')
		hamface = this.add.image(320, 50, 'imageOh')
		hamface.setScale(1.4)
		hamMain.setScale(0.6)
		hamface.timeout = undefined
		hamface.visible =false
		hamface.hitAnimation = () =>{
			clearTimeout(hamface.timeout)
			hamface.visible=true
			
			hamface.timeout = setTimeout(()=>{
				hamface.visible =false
			},700)
		}
		for (let i = 0; i < 50; i++)
		{
			const x = Phaser.Math.Between(34, 300);
			const y = Phaser.Math.Between(-64, 200);

			const image = this.add.image(x, y, 'imageHamface');
			// image.setBlendMode(Phaser.BlendModes.ADD);
			this.sprites.push({ s: image, r: 2 + Math.random() * 6 });
		}
	}
    create ()
    {
        //   Bullet 1 (600px in 6 seconds)
		// this.textures.addBase64('bullet', imageOh);
    // this.add.image(0, 200, 'ground').setOrigin(0);
	this.textures.once('addtexture', function () {

		speed1 = Phaser.Math.GetSpeed(200, 20) * 100;
		
		// const hamface = this.add.image(320, 50, 'imageOh')
		// this.add.image(320, 50, 'hamMain')
		
		// hamface.setScale(1.3)
	}, this);
	
	// this.textures.addBase64('poop', poop);
    
	// this.textures.addBase64('bullet', poop);
    

    // this.add.image(64, 72, 'cannon').setOrigin(0);

    // this.add.text(64, 50, '600px / 6 secs', { fill: '#000' });

    //   Bullet 2 (600px in 3 seconds)

    // this.add.image(0, 500, 'ground').setOrigin(0);

    // bullet2 = this.add.image(64, 376, 'bullet').setOrigin(0);

    // speed2 = Phaser.Math.GetSpeed(600, 3);

    // this.add.image(64, 500, 'cannon').setOrigin(0, 1);

    // this.add.text(64, 350, '600px / 3 secs', { fill: '#000' });
    }

    update (time, delta)
    {
		const currentState = store.getState()
		enemyLife.destroy()
		hamLife.destroy()
		enemyLife = this.add.text(10, 0, 'Enemy : '+currentState.stats.scores.enemyLife , { font: '16px Courier' });
		hamLife = this.add.text(250, 0, 'Life : '+currentState.stats.scores.hamLife , { font: '16px Courier' });

		for (let i = 0; i < this.sprites.length; i++)
        {
            const sprite = this.sprites[i].s;

            sprite.y -= this.sprites[i].r;

            if (currentState.stats.useSkill && sprite.y < -256)
            {
                sprite.y = 300;
            }
        }


		if (globalThis.processRunning){
			return
		}
		
		if (poops.length>0){
			poops=poops.filter((poop, index, arr)=>{
				if (currentState.stats.useSkill){
					poop.stop = true
					poop.setActive(false).setVisible(false);
					poop.destroy();
					this.dispatch(addMove(1))
					return false
				}	
				if (poop.stop||poop.x>220){
					poop.stop = true
					poop.setActive(false).setVisible(false);
					poop.destroy();
					this.dispatch(playSound('sibal'))
					hamface.hitAnimation()
					this.dispatch(addLife(-1))
					return false
				} else {
					poop.x += speed1;
					return true
				}
			})
		}
        
		if (poopLastGen+poopRegen<time){
			poopLastGen = time+poopRegen
			const y = 15+55*Math.random()
			const bulletRandom = this.add.image(20, y, 'poop').setOrigin(0);
			poops.push(bulletRandom)
			console.log("poops", poops.length , poops)
		}
		// bullet2.x += speed2 * delta;

		// if (bullet2.x > 864)
		// {
		// 	bullet2.x = 64;
		// }
    }
}

let poops=[]
let poopRegen = 5000
let poopLastGen = 0


var bullet1;
var bullet2;

let speed1;
let hamface
let enemyLife
let hamLife
let skillUsed

const config = {
	backgroundColor: '#ffe3f7',
  //   scale: {
	  parent: 'defense-board', // this has to match the div id in index.html
	  // fullscreenTarget: 'body', // this has to be the wrapping element
	  width: "100",
	  height: "100",
	  // mode: Phaser.Scale.NONE // we scale the game manually in resize()
	  // autoCenter: Phaser.Scale.CENTER_BOTH
  //   },
	renderer: Phaser.CANVAS,
	useTicker: true,
  //   dom: {
  //     createContainer: false
  //   },
  //   scene: [MainScene],
	  scene: [ReadyScene, DefenseScene]
		//   preload: ()=>
		//   {
		// 	  // this.load.image('bullet', 'assets/tests/timer/bullet-bill.png');
		// 	  // this.load.image('cannon', 'assets/tests/timer/cannon.png');
		// 	  // this.load.image('ground', 'assets/tests/timer/ground.png');
		//   },
		//   create: create,
		//   update: update,
		//   sys:null, game:null, anims:null, cache:null,
		//   registry:null, sound:null, textures:null, events:null,
		//   cameras:null, add:null, make:null, scene:null,
		  
	//   },
  //   physics: {
  //     default: 'arcade',
  //     arcade: {
  //       debug: false,
  //       gravity: { y: 400 }
  //     }
  //   }
  }	
const DefenseBoard : React.FC = (props:any) => {
	const dispatch = useDispatch()
	
	const game = new Phaser.Game(config)
	game.scene.start('DefenseScene', {dispatch});
	console.log("Re render Defense Board")
    return (
        <div id="defense-board">
			{/* <div id="enemy-hit-points-box"></div>
			<div id="stage-number">0</div>
			<div id="heart-box"></div>
			<div id="paw">
				<i className="fa fa-paw"></i>
			</div>
			<div id="enemy-main" className="defense-icon"></div>
			<div id="spell-burn">F I R E !</div>
			<div className="defense-icon oh-ham"></div>
			<div className="defense-icon blackcow" id="blackcow-animation"></div> */}
		</div>
    )
}

export default DefenseBoard
// export default connect((state:RootState) => ({
// 	// blockStats: state.stats.blocks,
// 	// move: state.stats.move
// 	scores: state.stats.scores
//   }))(DefenseBoard);