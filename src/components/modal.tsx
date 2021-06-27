import * as React from "react";

const Modal : React.FC = (props:any) => {
    return (
        <div className="reward-layer" id="reward">
			<div className="reward-wrap">
				<div id="reward-line" className="hidden">
					<div id="reward-box">
					</div>
				</div>
			</div>
		</div>
    )
}

export default Modal;