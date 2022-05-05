import * as React from "react";
import Bonus from './bonus'
import { TypeToShape } from '../constant'
import { connect } from 'react-redux'
import type { RootState } from '../stores/store'
import { setStatBlocks, addMove, addLife, setSkill } from '../stores/stats'
import { useDispatch } from 'react-redux'

const DataBoard = (props:any) => {
	const {
		blockStats,
		move,
	} = props
	const dispatch = useDispatch()
	const useBlock = (key) =>{
		console.log('useBlock', key)
		const score = blockStats[key]
		if (score>=10){
			useBlockAbility(key)
			dispatch(setStatBlocks({
				...blockStats,
				[key]:score-10,
			}))
		}
	}

	const useBlockAbility = (key)=>{
		console.log('useBlockAbility', key)
		switch(key){
			case "1": //blackcow
				break;
			case "2":	//think
				dispatch(addMove(1))
				break;
			case "3":
				dispatch(addLife(1))
				break;
			case "4":
				break;
			case "5":
				// dispatch(addMove(1))
				dispatch(setSkill(true))
				setTimeout(()=>{
					dispatch(setSkill(false))
				})
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

export default connect((state:RootState) => ({
	blockStats: state.stats.blocks,
	move: state.stats.move
  }))(DataBoard);
