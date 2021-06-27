import * as React from "react";

const Top : React.FC = (props:any) => {
    return (
        <div className="top">
			<a target="_blank" href="https://www.twitch.tv/ham_90">
				<img className="link-img" src="https://static-cdn.jtvnw.net/jtv_user_pictures/e323a411-0bdc-42d9-88ee-c5cb5f2daeef-profile_image-70x70.png"/>
			</a>
			<span className="title">Game</span>
			<div id="mute"></div>
		</div>
    )
}

export default Top;