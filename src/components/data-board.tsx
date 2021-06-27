import * as React from "react";

const DataBoard : React.FC = (props:any) => {
    return (
        <div id="gamedata">
			<div className="gamedata-top-box">
				<div className="bonus-box">
					<div id="bonuses">
						{`ham1 x 5 => X 2`}
					</div>		
				</div>
				<div className="spell-box">
					<div className="block-wrap">
						<div 
							id="spell-first"
							className="block first"
							style={{left:0}}
						></div>
						<div className="spell-cost">-10</div>
					</div>
					<div className="block-wrap">
						<div
							id="spell-second"
							className="block second"
							style={{left:0}}
						></div>
						<div className="spell-cost">-10</div>
					</div>
					<div className="block-wrap">
						<div id="spell-third" className="block third" style={{left:0}}></div>
						<div className="spell-cost">-50</div>
					</div>
					<div className="block-wrap">
						<div id="spell-forth" className="block forth" style={{left:0}}></div>
						<div className="spell-cost">-50</div>
					</div>
					<div className="block-wrap">
						<div id="spell-fifth" className="block fifth" style={{left:0}}></div>
						<div className="spell-cost">-50</div>
					</div>
				</div>
			</div>
			<div id="stats">
				<div id="block-counts">
					<div className="block-count-single">
						<div className="block-wrap">
							<div className="block first" style={{left:0}}></div>
						</div>
						<span id="stat-first">0</span>
					</div>
					<div className="block-count-single">
						<div className="block-wrap">
							<div className="block second" style={{left:0}}></div>
						</div>
						<span id="stat-second">0</span>
					</div>
					<div className="block-count-single">
						<div className="block-wrap">
							<div className="block third" style={{left:0}}></div>
						</div>
						<span id="stat-third">0</span>
					</div>
					<div className="block-count-single">
						<div className="block-wrap">
							<div className="block forth" style={{left:0}}></div>
						</div>
						<span id="stat-forth">0</span>
					</div>
					<div className="block-count-single">
						<div className="block-wrap">
							<div className="block fifth" style={{left:0}}></div>
						</div>
						<span id="stat-fifth">0</span>
					</div>
				</div>
				<div>Move  <span id="move">5</span></div>
			</div>
		</div>
    )
}

export default DataBoard;
