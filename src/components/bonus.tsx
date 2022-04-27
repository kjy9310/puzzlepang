import * as React from "react";
//import {useEffect, useState, useRef} from "react"

interface Iprops {
    
}


const Bonus = (props:Iprops) => {
    return (
        <div className="bonus">
            <div style={{position:"relative"}} className="block" />
            <span style={{fontSize:"30px"}}>
                {` x 5 = X 2`}
            </span>	
        </div>
    )
}

export default Bonus;