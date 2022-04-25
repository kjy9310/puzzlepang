import * as React from "react";
import * as Phaser from 'phaser'
// import MainScene from './defense-scene'
// import PreloadScene from './scenes/preloadScene'
// declare module '*.png';
// import * as imageOh from '../../images/oh.png'//'/images/oh.png'
// import * as imageHamface from '/images/hamface.png'

const imageOh = require('/images/oh.png').default
const imageHamface = require('/images/hamface.png').default
const poop = require('/images/poop.png').default
const baseWidth = 360

// export const DEFAULT_WIDTH = 1280
// export const DEFAULT_HEIGHT = 720

class DefenseScene extends Phaser.Scene
{
    // constructor ()
    // {
    //     super();
		
    // }

    preload ()
    {
		
		// console.log('imageOh', imageOh)
        // this.load.image('bullet', imageOh);
		// this.load.image('cannon', '/images/hamface.png');
		// this.load.image('ground', 'assets/tests/timer/ground.png');

		
	
		this.textures.addBase64('poop', poop);
    }

    create ()
    {
        //   Bullet 1 (600px in 6 seconds)
		// this.textures.addBase64('bullet', imageOh);
    // this.add.image(0, 200, 'ground').setOrigin(0);
	this.textures.once('addtexture', function () {

		speed1 = Phaser.Math.GetSpeed(200, 20);

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
		if (globalThis.processRunning){
			return
		}
		if (poops.length>0){
			poops=poops.filter((poop, index, arr)=>{
				if (poop.stop||poop.x>200){
					poop.stop = true
					poop.setActive(false).setVisible(false);
					poop.destroy();
					return false
				} else {
					poop.x += speed1;
					return true
				}
			})
		}
        
		if (poopLastGen+poopRegen<time){
			poopLastGen = time+poopRegen
			const y = 70*Math.random()
			const bulletRandom = this.add.image(10, y, 'poop').setOrigin(0);
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

var speed1;
var speed2;

const config = {
	backgroundColor: '#ffffff',
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
	  scene: [DefenseScene]
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
	let game = new Phaser.Game(config)
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

export default DefenseBoard;