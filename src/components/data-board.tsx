import * as React from "react";
import Bonus from './bonus'
import { TypeToShape } from '../constant'

const DataBoard = (props:any) => {
	const {
		blockStats,
		setBlockStats,
		move,
		setMove
	} = props
	const useBlock = (key) =>{
		console.log('useBlock', key)
		const score = blockStats[key]
		if (score>=10){
			useBlockAbility(key)
			setBlockStats({
				...blockStats,
				[key]:score-10,
			})
		}
	}

	const useBlockAbility = (key)=>{
		console.log('useBlockAbility', key)
		switch(key){
			case "1": //blackcow
				break;
			case "2":	//think
				console.log('think')
				setMove(move+1)
				break;
			case "3":
				break;
			case "4":
				break;
			case "5":
				break;
			default:
		}
	}
    return (
        <div id="gamedata">
			<div className="gamedata-top-box">
				<div className="bonus-box">
					<Bonus/>
					<div className="bonus">
						<div style={{position:"relative"}} className="block" />
						<span style={{fontSize:"30px"}}>
							{` x 5 = X 2`}
						</span>	
					</div>
					<div className="bonus">
						<div style={{position:"relative"}} className="block" />
						<span style={{fontSize:"30px"}}>
							{` x 10 = move`}
						</span>	
					</div>
					<div className="bonus">
						<div style={{position:"relative"}} className="block" />
						<span style={{fontSize:"30px"}}>
							{` x 00 = 0000`}
						</span>	
					</div>
					<div className="bonus">
						<div style={{position:"relative"}} className="block" />
						<span style={{fontSize:"30px"}}>
							{` x 00 = 0000`}
						</span>	
					</div>
				</div>
			</div>
			
			<div className="block-control">
				{Object.keys(blockStats).map((key)=>{
					const score = blockStats[key]
					return <div className="stat-block">
						<div className="spell-cost">-10</div>
						<div className="block-wrap" onClick={()=>useBlock(key)}>
							<div className={`block ${TypeToShape[key]}`} style={{left:0}}></div>
						</div>
						<div>{score}</div>
					</div>

				})}
			</div>
			<div>Move : <span id="move">{move}</span></div>
			
		</div>
    )
}

export default DataBoard;
