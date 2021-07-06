import * as React from "react";
import { useSelector, useDispatch } from 'react-redux'
import { toggle } from '../stores/sound'

const Top : React.FC = (props:any) => {
	const sound = useSelector((state:any) => state.soundControl.value)
	// const sound = useSelector((state:RootState) => state.soundControl.value)
  	const dispatch = useDispatch()

    return (
        <div className="top">
			<a target="_blank" href="https://www.twitch.tv/ham_90">
				<img className="link-img" src="https://static-cdn.jtvnw.net/jtv_user_pictures/e323a411-0bdc-42d9-88ee-c5cb5f2daeef-profile_image-70x70.png"/>
			</a>
			<span className="title">Game</span>
			<div
				id="mute"
				onClick={() => dispatch(toggle())}
			></div>
		</div>
    )
}

export default Top;