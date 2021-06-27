import * as React from "react";

const DefenseBoard : React.FC = (props:any) => {
    return (
        <div id="defense-board">
			<div id="enemy-hit-points-box"></div>
			<div id="stage-number">0</div>
			<div id="heart-box"></div>
			<div id="paw">
				<i className="fa fa-paw"></i>
			</div>
			<div id="enemy-main" className="defense-icon"></div>
			<div id="spell-burn">F I R E !</div>
			<div className="defense-icon oh-ham"></div>
			<div className="defense-icon blackcow" id="blackcow-animation"></div>
		</div>
    )
}

export default DefenseBoard;